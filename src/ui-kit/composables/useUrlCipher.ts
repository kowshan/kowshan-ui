// composables/useUrlCipher.ts

const toB64 = (bytes: Uint8Array) => {
    let s = ''
    for (let i = 0; i < bytes.length; i += 0x8000) {
        s += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
    }
    // URL-safe base64 (no + / = padding)
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const fromB64 = (s: string) => {
    const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4)
    const bin = atob(b64)
    const bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    return bytes
}

/**
 * useUrlCipher — HMAC-signed reversible ID hashing for URLs:
 *
 *   const cipher = useUrlCipher('app-secret-key')
 *   const token = await cipher.hash(128)          // "8V2s0s…" (unique per call)
 *   const id = await cipher.unhash(token)         // 128
 *   cipher.unhash(tamperedToken)                  // null (signature mismatch)
 *
 * - the plain id is URL-safe-base64 encoded (compact) and signed with
 *   HMAC-SHA256, so tokens are unguessable, tamper-proof and expire-able
 * - pass `ttl` seconds to make tokens expire (e.g. password-reset links)
 * - `hash` adds random salt, so the same id produces different tokens
 */
export function useUrlCipher(secret: string) {
    const enc = (v: string) => new TextEncoder().encode(v)

    const sign = async (data: Uint8Array): Promise<Uint8Array> => {
        const key = await crypto.subtle.importKey(
            'raw', enc(`k-urlcipher:${secret}`), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
        )
        const sig = await crypto.subtle.sign('HMAC', key, data)
        return new Uint8Array(sig).slice(0, 10) // 10 bytes ≈ 80-bit — plenty for URLs
    }

    async function hash(id: string | number, opts?: { ttl?: number }): Promise<string> {
        if (!crypto?.subtle) throw new Error('Web Crypto not available')
        const salt = crypto.getRandomValues(new Uint8Array(6))
        const expires = opts?.ttl ? Math.floor(Date.now() / 1000) + opts.ttl : 0
        // payload = salt || id || expires(4 bytes)
        const idBytes = enc(String(id))
        const payload = new Uint8Array(salt.length + idBytes.length + 4)
        payload.set(salt, 0)
        payload.set(idBytes, salt.length)
        new DataView(payload.buffer).setUint32(payload.length - 4, expires)
        const sig = await sign(payload)
        return toB64(payload) + '.' + toB64(sig)
    }

    async function unhash(token: string): Promise<string | number | null> {
        if (!crypto?.subtle) return null
        const dot = token.indexOf('.')
        if (dot <= 0) return null
        let payload: Uint8Array
        let sig: Uint8Array
        try {
            payload = fromB64(token.slice(0, dot))
            sig = fromB64(token.slice(dot + 1))
        } catch {
            return null
        }
        const expected = await sign(payload)
        if (sig.length !== expected.length) return null
        let ok = true
        for (let i = 0; i < sig.length; i++) {
            if (sig[i] !== expected[i]) { ok = false; break }
        }
        if (!ok) return null

        const dataView = new DataView(payload.buffer, payload.byteOffset, payload.byteLength)
        const expires = dataView.getUint32(payload.length - 4)
        if (expires && expires < Math.floor(Date.now() / 1000)) return null // expired

        const idBytes = payload.slice(6, payload.length - 4)
        const id = new TextDecoder().decode(idBytes)
        return /^\d+$/.test(id) ? Number(id) : id
    }

    return { hash, unhash }
}
