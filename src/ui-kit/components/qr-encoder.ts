/**
 * qr-encoder.ts — minimal dependency-free QR code encoder.
 *
 * Byte mode, error correction level L, versions 1–6 (up to ~130 bytes).
 * Scannable output for short texts, URLs and payment strings. Generates a
 * boolean matrix that KQrCode renders as an SVG.
 *
 * Based on the public-domain algorithms popularized by Kazuhiko Arase's
 * qrcode-generator (MIT) and Thonky's QR tutorial.
 */

/* ---- Galois field GF(256), generator 0x11d ---- */
const GF_EXP = new Array(512)
const GF_LOG = new Array(256)
let gfX = 1
for (let i = 0; i < 255; i++) {
    GF_EXP[i] = gfX
    GF_LOG[gfX] = i
    gfX <<= 1
    if (gfX & 0x100) gfX ^= 0x11d
}
for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255]

const gmul = (a: number, b: number) => (a === 0 || b === 0) ? 0 : GF_EXP[GF_LOG[a] + GF_LOG[b]]
const gexp = (n: number) => GF_EXP[n % 255]
const glog = (n: number) => GF_LOG[n]

/* ---- polynomial arithmetic ---- */
class QRPoly {
    num: number[]
    constructor(num: number[], shift: number) {
        let offset = 0
        while (offset < num.length && num[offset] === 0) offset++
        this.num = new Array(num.length - offset + shift).fill(0)
        for (let i = 0; i < num.length - offset; i++) this.num[i] = num[i + offset]
    }
    get(i: number) { return this.num[i] }
    getLength() { return this.num.length }
    multiply(e: QRPoly) {
        const num = new Array(this.getLength() + e.getLength() - 1).fill(0)
        for (let i = 0; i < this.getLength(); i++) {
            for (let j = 0; j < e.getLength(); j++) {
                num[i + j] ^= gmul(this.get(i), e.get(j))
            }
        }
        return new QRPoly(num, 0)
    }
    mod(e: QRPoly): QRPoly {
        if (this.getLength() - e.getLength() < 0) return this
        const ratio = glog(this.get(0)) - glog(e.get(0))
        const num = this.num.slice()
        for (let i = 0; i < e.getLength(); i++) {
            num[i] ^= gmul(e.get(i), gexp(ratio))
        }
        return new QRPoly(num, 0).mod(e)
    }
}

const rsGenerator = (ecLength: number) => {
    let poly = new QRPoly([1], 0)
    for (let i = 0; i < ecLength; i++) {
        poly = poly.multiply(new QRPoly([1, gexp(i)], 0))
    }
    return poly
}

const rsEncode = (data: number[], ecLength: number): number[] => {
    const dataPoly = new QRPoly(data, ecLength)
    const mod = dataPoly.mod(rsGenerator(ecLength))
    const out = new Array(ecLength).fill(0)
    for (let i = 0; i < ecLength; i++) out[i] = mod.get(i)
    return out
}

/* ---- version tables (EC level L, versions 1-6, single block) ---- */
const VERSIONS: { size: number; total: number; ec: number; align: number[] }[] = [
    { size: 21, total: 26, ec: 7, align: [] },
    { size: 25, total: 44, ec: 10, align: [6, 18] },
    { size: 29, total: 70, ec: 15, align: [6, 22] },
    { size: 33, total: 100, ec: 20, align: [6, 26] },
    { size: 37, total: 134, ec: 26, align: [6, 30] },
    { size: 41, total: 172, ec: 36, align: [6, 34] },
]

const DATA_CAPACITY = VERSIONS.map(v => v.total - v.ec - 2) // minus mode + count bytes

/* ---- format info BCH (EC level L = 01, mask 0 = 000) ---- */
const bchDigit = (v: number) => {
    let d = 0
    while (v !== 0) { d++; v >>>= 1 }
    return d
}

const getBchTypeInfo = (data: number) => {
    let d = data << 10
    while (bchDigit(d) - bchDigit(0x537) >= 0) {
        d ^= 0x537 << (bchDigit(d) - bchDigit(0x537))
    }
    return ((data << 10) | d) ^ 0x5412
}

/* ---- byte-mode data encoding ---- */
const encodeData = (text: string, ecLength: number, total: number): number[] => {
    const bytes: number[] = []
    for (let i = 0; i < text.length; i++) {
        const code = text.charCodeAt(i)
        if (code < 0x80) bytes.push(code)
        else if (code < 0x800) bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f))
        else bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f))
    }

    // mode indicator (byte = 0100) + char count (8 bits for v1-9)
    const header = [0x40, bytes.length]

    // pad data with terminator (up to 4 zero bits) then 0xEC / 0x11 to capacity
    const paddedData = header.concat(bytes)
    const dataCapacity = total - ecLength
    const padBytes = [0xec, 0x11]
    let pi = 0
    while (paddedData.length < dataCapacity) {
        paddedData.push(padBytes[pi % 2])
        pi++
    }

    return paddedData.concat(rsEncode(paddedData, ecLength))
}

/* ---- module placement ---- */
export function generateQrMatrix(text: string): { matrix: boolean[][]; version: number; size: number } | null {
    const clean = text || ''
    // pick smallest version that fits
    let vi = -1
    for (let i = 0; i < DATA_CAPACITY.length; i++) {
        // count utf-8 bytes
        let n = 0
        for (let j = 0; j < clean.length; j++) {
            const c = clean.charCodeAt(j)
            n += c < 0x80 ? 1 : c < 0x800 ? 2 : 3
        }
        if (n <= DATA_CAPACITY[i]) { vi = i; break }
    }
    if (vi < 0) return null

    const ver = VERSIONS[vi]
    const size = ver.size
    const modules: (boolean | null)[][] = Array.from({ length: size }, () => new Array(size).fill(null))
    const MASK = 0

    const isDark = (r: number, c: number) => modules[r][c] === true
    const set = (r: number, c: number, dark: boolean) => { modules[r][c] = dark }

    /* finder probes + separators */
    const probe = (row: number, col: number) => {
        for (let r = -1; r <= 7; r++) {
            if (row + r < 0 || size <= row + r) continue
            for (let c = -1; c <= 7; c++) {
                if (col + c < 0 || size <= col + c) continue
                const dark =
                    (0 <= r && r <= 6 && (c === 0 || c === 6)) ||
                    (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
                    (2 <= r && r <= 4 && 2 <= c && c <= 4)
                modules[row + r][col + c] = dark
            }
        }
    }
    probe(0, 0)
    probe(0, size - 7)
    probe(size - 7, 0)

    /* alignment patterns */
    for (const ar of ver.align) {
        for (const ac of ver.align) {
            // skip corners already occupied by finders
            if ((ar === 6 && ac === 6) || (ar === 6 && ac === size - 7) || (ar === size - 7 && ac === 6)) continue
            for (let dr = -2; dr <= 2; dr++) {
                for (let dc = -2; dc <= 2; dc++) {
                    const dark = Math.max(Math.abs(dr), Math.abs(dc)) !== 1
                    modules[ar + dr][ac + dc] = dark
                }
            }
        }
    }

    /* timing patterns */
    for (let i = 8; i < size - 8; i++) {
        if (modules[i][6] === null) modules[i][6] = i % 2 === 0
        if (modules[6][i] === null) modules[6][i] = i % 2 === 0
    }

    /* format info */
    const fmtBits = getBchTypeInfo((1 << 3) | MASK) // L=01 -> 1
    for (let i = 0; i < 15; i++) {
        const bit = ((fmtBits >> i) & 1) === 1
        const row = i < 6 ? i : i < 8 ? i + 1 : size - 15 + i
        modules[row][8] = bit
        const col = i < 8 ? size - 1 - i : i < 9 ? 15 - i : 15 - i - 1
        modules[8][col] = bit
    }
    modules[size - 8][8] = true // dark module

    /* data placement */
    const data = encodeData(clean, ver.ec, ver.total)
    let row = size - 1
    let col = size - 1
    let dir = -1
    let bitIndex = 7
    let byteIndex = 0

    const getMask = (r: number, c: number) => (MASK === 0) ? (r + c) % 2 === 0 : false

    while (col > 0) {
        if (col === 6) col--
        for (;;) {
            for (let i = 0; i < 2; i++) {
                const c = col - i
                if (modules[row][c] === null) {
                    let dark = false
                    if (byteIndex < data.length) {
                        dark = ((data[byteIndex] >>> bitIndex) & 1) === 1
                    }
                    if (getMask(row, c)) dark = !dark
                    modules[row][c] = dark
                    bitIndex--
                    if (bitIndex === -1) { byteIndex++; bitIndex = 7 }
                }
            }
            row += dir
            if (row < 0 || size <= row) {
                row -= dir
                dir = -dir
                col -= 2
                if (col === 6) col--
                break
            }
        }
    }

    return {
        matrix: modules.map(r => r.map(c => c === true)),
        version: vi + 1,
        size
    }
}
