// composables/useApiFetch.ts
import { ref } from 'vue'

export interface ApiFetchError {
    message: string
    /** Laravel-style field errors: { field: string[] } */
    errors?: Record<string, string[]>
    status: number
}

export interface ApiRequestOptions extends Omit<RequestInit, 'body' | 'headers'> {
    body?: any
    /** plain headers object (narrower than HeadersInit) */
    headers?: Record<string, string>
    /** query params appended to the URL */
    params?: Record<string, string | number | boolean | null | undefined>
    /** send the bearer token (default: true) */
    auth?: boolean
    /** parse response as JSON (default: true); raw text when false */
    json?: boolean
    /** attach an AbortSignal to cancel this request */
    signal?: AbortSignal
}

export interface ApiFetchOptions {
    baseUrl?: string
    headers?: Record<string, string>
    /** returns the current auth token (e.g. () => useAuth().token) */
    getToken?: () => string | null
    /** called for every failed response before the error is thrown */
    onError?: (error: ApiFetchError) => void
}

/**
 * useApiFetch — tiny fetch wrapper that fits Laravel backends:
 *
 *   const api = useApiFetch({ baseUrl: '/api', getToken: () => auth.token })
 *   const rows = await api.get('/properties', { params: { page: 2 } })
 *   try { await api.post('/properties', { name }) } catch (e) {
 *     useToast.showErrors(e.errors, e.message)   // Laravel field summary
 *   }
 *
 * - JSON in/out, Bearer token, query params
 * - errors are normalized to `{ message, errors, status }`
 * - tracks `loading` (true while any request is in flight)
 */
export function useApiFetch(options: ApiFetchOptions = {}) {
    const loading = ref(false)
    const controller = new AbortController()

    const base = options.baseUrl ?? ''
    const mergeUrl = (path: string, params?: ApiRequestOptions['params']) => {
        let url = path.startsWith('http') ? path : base + path
        if (params) {
            const qs = Object.entries(params)
                .filter(([, v]) => v !== undefined && v !== null)
                .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
                .join('&')
            if (qs) url += (url.includes('?') ? '&' : '?') + qs
        }
        return url
    }

    const readError = async (res: Response): Promise<ApiFetchError> => {
        let message = `خطا در درخواست (${res.status})`
        let errors: Record<string, string[]> | undefined
        try {
            const data = await res.json()
            if (data?.message) message = String(data.message)
            if (data?.errors) errors = data.errors
        } catch { /* non-JSON error body */ }
        return { message, errors, status: res.status }
    }

    async function request<T = any>(path: string, req: ApiRequestOptions = {}): Promise<T> {
        const {
            body, params, auth = true, json = true,
            signal, headers, ...rest
        } = req

        const token = auth ? options.getToken?.() : null
        const finalHeaders: Record<string, string> = {
            ...options.headers,
            ...headers
        }
        if (body !== undefined) finalHeaders['Content-Type'] = 'application/json'
        if (token) finalHeaders['Authorization'] = `Bearer ${token}`

        loading.value = true
        try {
            const res = await fetch(mergeUrl(path, params), {
                ...rest,
                headers: finalHeaders,
                body: body !== undefined ? JSON.stringify(body) : undefined,
                signal: signal ?? controller.signal
            })

            if (!res.ok) {
                const error = await readError(res)
                options.onError?.(error)
                throw error
            }
            if (res.status === 204) return undefined as T
            return (json ? res.json() : res.text()) as Promise<T>
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        request,
        get: <T = any>(path: string, opts?: ApiRequestOptions) => request<T>(path, { ...opts, method: 'GET' }),
        post: <T = any>(path: string, body?: any, opts?: ApiRequestOptions) => request<T>(path, { ...opts, body, method: 'POST' }),
        put: <T = any>(path: string, body?: any, opts?: ApiRequestOptions) => request<T>(path, { ...opts, body, method: 'PUT' }),
        patch: <T = any>(path: string, body?: any, opts?: ApiRequestOptions) => request<T>(path, { ...opts, body, method: 'PATCH' }),
        delete: <T = any>(path: string, opts?: ApiRequestOptions) => request<T>(path, { ...opts, method: 'DELETE' }),
        /** cancel every in-flight request */
        abortAll: () => controller.abort()
    }
}
