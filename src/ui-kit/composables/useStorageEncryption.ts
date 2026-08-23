// composables/useStorageEncryption.ts

export interface StorageEncryptionOptions {
    /** passphrase, or a function resolving the current passphrase */
    passphrase?: string | (() => string | null)
    storage?: Storage
}

const enc = (v: string) => new TextEncoder().encode(v)
const dec = (v: Uint8Array) => new TextDecoder().decode(v)

const toB64 = (buf: ArrayBuffer | Uint8Array) => {
    const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
    let s = ''
    for (let i = 0; i < bytes.length; i += 0x8000) {
        s += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
    }
    return btoa(s)
}

const fromB64 = (s: string): Uint8Array => {
    const bin = atob(s)
    const bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    return bytes
}

const hashKey = async (key: string): Promise<string> => {
    const digest = await crypto.subtle.digest('SHA-256', enc(`k-sec:${key}`))
    return Array.from(new Uint8Array(digest).slice(0, 12))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
}

/**
 * useStorageEncryption — AES-GCM encrypted values in localStorage:
 *
 *   const vault = useStorageEncryption({ passphrase: () => userSecret })
 *   await vault.setItem('token', { access: '…', refresh: '…' })
 *   const token = await vault.getItem('token')
 *
 * - key is derived with PBKDF2 (100k iterations) from the passphrase + a
 *   random per-storage salt — never stored in plaintext
 * - every write uses a fresh random IV; stored keys are SHA-256 hashed
 * - value may be any JSON-serializable object
 */
export function useStorageEncryption(options: StorageEncryptionOptions = {}) {
    const storage = options.storage ?? (typeof localStorage !== 'undefined' ? localStorage : null)

    const SALT_KEY = 'k-sec-salt'
    const ITERATIONS = 100_000

    const getPassphrase = (): string | null => {
        if (typeof options.passphrase === 'function') return options.passphrase()
        return options.passphrase ?? null
    }

    const getSalt = (): Uint8Array => {
        if (!storage) return new Uint8Array(16)
        const raw = storage.getItem(SALT_KEY)
        if (raw) return fromB64(raw)
        const salt = crypto.getRandomValues(new Uint8Array(16))
        storage.setItem(SALT_KEY, toB64(salt))
        return salt
    }

    const deriveKey = async (passphrase: string): Promise<CryptoKey> => {
        const material = await crypto.subtle.importKey(
            'raw', enc(passphrase), 'PBKDF2', false, ['deriveKey']
        )
        return crypto.subtle.deriveKey(
            { name: 'PBKDF2', salt: getSalt(), iterations: ITERATIONS, hash: 'SHA-256' },
            material,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        )
    }

    // session cache of derived keys (Map: WeakMap needs object keys)
    const keyCache = new Map<string, Promise<CryptoKey>>()
    const getKey = (passphrase: string) => {
        if (!keyCache.has(passphrase)) {
            keyCache.set(passphrase, deriveKey(passphrase))
        }
        return keyCache.get(passphrase)!
    }

    const isReady = () => !!getPassphrase() && !!storage && !!crypto?.subtle

    async function setItem<T = any>(key: string, value: T): Promise<void> {
        if (!storage || !crypto?.subtle) throw new Error('Web Crypto / storage not available')
        const pass = getPassphrase()
        if (!pass) throw new Error('useStorageEncryption: passphrase is required')
        const iv = crypto.getRandomValues(new Uint8Array(12))
        const payload = enc(JSON.stringify(value))
        const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await getKey(pass), payload)
        storage.setItem(await hashKey(key), toB64(iv) + '.' + toB64(cipher))
    }

    async function getItem<T = any>(key: string): Promise<T | null> {
        if (!storage || !crypto?.subtle) return null
        const pass = getPassphrase()
        if (!pass) return null
        const raw = storage.getItem(await hashKey(key))
        if (!raw) return null
        const [ivB64, dataB64] = raw.split('.')
        if (!ivB64 || !dataB64) return null
        try {
            const plain = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: fromB64(ivB64) },
                await getKey(pass),
                fromB64(dataB64)
            )
            return JSON.parse(dec(new Uint8Array(plain))) as T
        } catch {
            return null // wrong passphrase or tampered data
        }
    }

    async function removeItem(key: string): Promise<void> {
        if (!storage) return
        storage.removeItem(await hashKey(key))
    }

    async function clear(): Promise<void> {
        if (!storage) return
        const salt = storage.getItem(SALT_KEY)
        storage.clear()
        if (salt) storage.setItem(SALT_KEY, salt)
    }

    return { isReady, setItem, getItem, removeItem, clear }
}
