// composables/useCart.ts
/**
 * Global cart store (singleton, like useToastStore / useModalStore — no Pinia
 * required). Holds items + quantities, validates coupons against a rule list
 * (percent or fixed amount), computes shipping (free above a threshold) and
 * the final total — all reactive, in Persian-digit-friendly shape.
 *
 *   const cart = useCart({ coupons: [{ code: 'KIT10', percent: 10 }], freeShippingThreshold: 1_000_000 })
 *   cart.add({ id: 1, title: 'دوره Vue', price: 890_000, image: '…' })
 *   cart.applyCoupon('kit10')
 */
import { reactive, computed } from 'vue'

export type CartItem = {
    id: string | number
    title: string
    /** unit price in Toman (the price the customer actually pays per unit) */
    price: number
    /** strikethrough reference price, optional */
    oldPrice?: number
    image?: string
    meta?: string
    qty?: number
}

export type CartCouponRule = {
    code: string
    /** percent discount (e.g. 10 = 10%) */
    percent?: number
    /** fixed-amount discount in Toman */
    amount?: number
}

export type AppliedCoupon = {
    code: string
    saving: number
    percent?: number
}

export type CartOptions = {
    coupons?: CartCouponRule[]
    /** custom validator — returns discount in Toman, or 0/false for invalid */
    validateCoupon?: (code: string) => number | false
    /** orders at or above this subtotal ship free */
    freeShippingThreshold?: number
    shippingCost?: number
    currency?: string
}

const items = reactive<CartItem[]>([])
const coupon = reactive<{ applied: AppliedCoupon | null }>({ applied: null })
let options: Required<Pick<CartOptions, 'freeShippingThreshold' | 'shippingCost' | 'currency'>> & CartOptions = {
    coupons: [],
    validateCoupon: undefined,
    freeShippingThreshold: 0,
    shippingCost: 0,
    currency: 'تومان'
}

export function useCart(opts: CartOptions = {}) {
    options = { ...options, ...opts }

    /* ---- items ---- */
    const add = (item: CartItem) => {
        const existing = items.find(i => i.id === item.id)
        if (existing) {
            existing.qty = (existing.qty ?? 1) + 1
        } else {
            items.push({ ...item, qty: item.qty ?? 1 })
        }
    }

    const remove = (id: string | number) => {
        const idx = items.findIndex(i => i.id === id)
        if (idx !== -1) items.splice(idx, 1)
    }

    const setQty = (id: string | number, qty: number) => {
        const item = items.find(i => i.id === id)
        if (!item) return
        if (qty <= 0) {
            remove(id)
            return
        }
        item.qty = qty
    }

    const increment = (id: string | number) => {
        const item = items.find(i => i.id === id)
        if (item) item.qty = (item.qty ?? 1) + 1
    }

    const decrement = (id: string | number) => {
        const item = items.find(i => i.id === id)
        if (!item) return
        setQty(id, (item.qty ?? 1) - 1)
    }

    const clear = () => {
        items.splice(0, items.length)
        coupon.applied = null
    }

    /* ---- computed totals ---- */
    const count = computed(() => items.reduce((sum, i) => sum + (i.qty ?? 1), 0))
    const subtotal = computed(() =>
        items.reduce((sum, i) => sum + i.price * (i.qty ?? 1), 0)
    )

    const shipping = computed(() => {
        if (options.freeShippingThreshold && subtotal.value >= options.freeShippingThreshold) return 0
        return options.shippingCost ?? 0
    })

    const discount = computed(() => coupon.applied?.saving ?? 0)
    const total = computed(() => Math.max(0, subtotal.value - discount.value + shipping.value))

    const isEmpty = computed(() => items.length === 0)

    /* ---- coupon ---- */
    const applyCoupon = (code: string): boolean => {
        const clean = code.trim()
        if (!clean) return false
        let saving: number | false
        if (options.validateCoupon) {
            saving = options.validateCoupon(clean)
        } else {
            const rule = options.coupons?.find(
                c => c.code.trim().toLowerCase() === clean.toLowerCase()
            )
            if (!rule) return false
            if (rule.amount) saving = Math.min(rule.amount, subtotal.value)
            else if (rule.percent) saving = Math.round((subtotal.value * rule.percent) / 100)
            else saving = false
        }
        if (saving === false || saving <= 0) return false
        coupon.applied = { code: clean, saving }
        return true
    }

    const removeCoupon = () => { coupon.applied = null }

    return {
        items,
        add,
        remove,
        setQty,
        increment,
        decrement,
        clear,
        count,
        subtotal,
        shipping,
        discount,
        total,
        isEmpty,
        appliedCoupon: coupon.applied,
        applyCoupon,
        removeCoupon,
        currency: options.currency
    }
}
