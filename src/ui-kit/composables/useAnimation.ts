import { ref, watch, nextTick } from 'vue'

export interface AnimationOptions {
    duration?: number
    delay?: number
    easing?: string
}

export function useAnimation() {
    const shake = ref(false)
    const pulse = ref(false)
    const fadeIn = ref(false)
    const fadeOut = ref(false)

    // Simple CSS animations (no GSAP for now)
    const triggerShake = (duration = 500) => {
        shake.value = true
        setTimeout(() => { shake.value = false }, duration)
    }

    const triggerPulse = (duration = 500) => {
        pulse.value = true
        setTimeout(() => { pulse.value = false }, duration)
    }

    const triggerFadeIn = (duration = 200) => {
        fadeIn.value = true
        setTimeout(() => { fadeIn.value = false }, duration)
    }

    const triggerFadeOut = (duration = 200) => {
        fadeOut.value = true
        setTimeout(() => { fadeOut.value = false }, duration)
    }

    // GSAP version (optional, only if GSAP is installed)
    let gsapAvailable = false

    const checkGsap = async () => {
        try {
            // @vite-ignore — gsap is optional; leave it as a runtime import
            await import(/* @vite-ignore */ 'gsap')
            gsapAvailable = true
        } catch {
            gsapAvailable = false
        }
    }

    const smoothShake = async (element: HTMLElement, duration = 0.3) => {
        if (!gsapAvailable) {
            triggerShake(duration * 1000)
            return
        }

        // @vite-ignore — gsap is optional
        const gsap = (await import(/* @vite-ignore */ 'gsap')).gsap
        gsap.to(element, {
            x: 5,
            duration: duration / 4,
            repeat: 3,
            yoyo: true,
            ease: 'power1.inOut'
        })
    }

    const smoothPulse = async (element: HTMLElement, duration = 0.3) => {
        if (!gsapAvailable) {
            triggerPulse(duration * 1000)
            return
        }

        // @vite-ignore — gsap is optional
        const gsap = (await import(/* @vite-ignore */ 'gsap')).gsap
        gsap.to(element, {
            scale: 1.02,
            duration: duration / 2,
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut'
        })
    }

    // Check GSAP availability on mount
    if (typeof window !== 'undefined') {
        checkGsap()
    }

    return {
        // Simple CSS animations
        shake,
        pulse,
        fadeIn,
        fadeOut,
        triggerShake,
        triggerPulse,
        triggerFadeIn,
        triggerFadeOut,
        // Smooth GSAP animations (if available)
        smoothShake,
        smoothPulse
    }
}