// composables/useBrowserDb.ts

export interface BrowserDbOptions {
    storeName?: string
    version?: number
}

const stores = new Map<string, Promise<IDBDatabase>>()

/**
 * useBrowserDb — tiny promise-based IndexedDB wrapper for temporary data
 * (form drafts, offline queue, local caches):
 *
 *   const db = useBrowserDb('k-forms')
 *   await db.set('property-form', { title: '…', price: 0 })   // autosave draft
 *   const draft = await db.get('property-form')
 *   const all = await db.all()
 *
 * Values are structured-cloneable (objects, arrays, Files, Dates…).
 */
export function useBrowserDb(dbName: string, options: BrowserDbOptions = {}) {
    const storeName = options.storeName ?? 'kv'
    const version = options.version ?? 1

    const open = (): Promise<IDBDatabase> => {
        const key = `${dbName}:${storeName}:${version}`
        if (!stores.has(key)) {
            stores.set(key, new Promise((resolve, reject) => {
                const req = indexedDB.open(dbName, version)
                req.onupgradeneeded = () => {
                    const db = req.result
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName)
                    }
                }
                req.onsuccess = () => resolve(req.result)
                req.onerror = () => reject(req.error)
            }))
        }
        return stores.get(key)!
    }

    const tx = async <T>(
        mode: IDBTransactionMode,
        run: (store: IDBObjectStore) => IDBRequest
    ): Promise<T> => {
        const db = await open()
        return new Promise<T>((resolve, reject) => {
            const t = db.transaction(storeName, mode)
            const req = run(t.objectStore(storeName))
            req.onsuccess = () => resolve(req.result as T)
            req.onerror = () => reject(req.error)
        })
    }

    return {
        set<T = any>(key: string, value: T): Promise<void> {
            return tx('readwrite', store => store.put(value, key)) as Promise<void>
        },
        get<T = any>(key: string): Promise<T | undefined> {
            return tx('readonly', store => store.get(key)) as Promise<T | undefined>
        },
        remove(key: string): Promise<void> {
            return tx('readwrite', store => store.delete(key)) as Promise<void>
        },
        clear(): Promise<void> {
            return tx('readwrite', store => store.clear()) as Promise<void>
        },
        count(): Promise<number> {
            return tx('readonly', store => store.count()) as Promise<number>
        },
        keys(): Promise<IDBValidKey[]> {
            return tx('readonly', store => store.getAllKeys()) as Promise<IDBValidKey[]>
        },
        async all<T = any>(): Promise<{ key: IDBValidKey; value: T }[]> {
            const db = await open()
            return new Promise((resolve, reject) => {
                const t = db.transaction(storeName, 'readonly')
                const store = t.objectStore(storeName)
                const keysReq = store.getAllKeys()
                const valsReq = store.getAll()
                t.oncomplete = () => {
                    resolve(keysReq.result.map((key, i) => ({ key, value: valsReq.result[i] as T })))
                }
                t.onerror = () => reject(t.error)
            })
        },
        close() {
            stores.delete(`${dbName}:${storeName}:${version}`)
            open().then(db => db.close())
        }
    }
}
