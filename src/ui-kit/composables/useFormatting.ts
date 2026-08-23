export function useFormatting() {
    // Format number as currency (Tomans)
    const formatCurrency = (value: number | string): string => {
        if (!value && value !== 0) return ''
        const num = typeof value === 'string' ? parseFloat(value) : value
        return num.toLocaleString('fa-IR') + ' تومان'
    }

    // Parse currency string to number
    const parseCurrency = (value: string): number => {
        const cleaned = value.replace(/[^0-9]/g, '')
        return parseInt(cleaned) || 0
    }

    // Format number with separators
    const formatNumber = (value: number | string): string => {
        if (!value && value !== 0) return ''
        const num = typeof value === 'string' ? parseFloat(value) : value
        return num.toLocaleString('fa-IR')
    }

    // Parse formatted number
    const parseNumber = (value: string): number => {
        const cleaned = value.replace(/[^0-9]/g, '')
        return parseInt(cleaned) || 0
    }

    // Add leading zero
    const padZero = (value: number, length: number = 2): string => {
        return value.toString().padStart(length, '0')
    }

    return {
        formatCurrency,
        parseCurrency,
        formatNumber,
        parseNumber,
        padZero
    }
}