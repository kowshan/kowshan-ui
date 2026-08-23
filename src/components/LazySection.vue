<!-- components/LazySection.vue -->
<!--
    LazySection — mounts its slot only when the wrapper approaches the
    viewport (IntersectionObserver, 900px lookahead) or when `force` turns
    true (nav click). Once mounted it stays mounted, so navigating away and
    back never rebuilds the section. Keeps the initial page build small and
    avoids a giant one-shot layout on reload.
-->
<template>
    <div
        ref="rootEl"
        class="k-lazy"
        :class="{ 'is-empty': !mounted }"
        :data-section="id"
    >
        <slot v-if="mounted" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onScopeDispose } from 'vue'

const props = defineProps<{
    id: string
    force?: boolean
}>()

const rootEl = ref<HTMLElement | null>(null)
const mounted = ref(props.force)

let io: IntersectionObserver | null = null

const show = () => {
    if (!mounted.value) mounted.value = true
    io?.disconnect()
}

onMounted(() => {
    if (mounted.value) return
    io = new IntersectionObserver(
        (entries) => {
            if (entries.some(e => e.isIntersecting)) show()
        },
        { rootMargin: '900px 0px' }
    )
    if (rootEl.value) io.observe(rootEl.value)
})

// nav jump → mount immediately (and stay mounted afterwards)
watch(() => props.force, (v) => { if (v) show() })

onScopeDispose(() => io?.disconnect())
</script>

<style scoped>
/* placeholder height while unmounted — keeps empty wrappers spread down the
   page so each one only mounts as it approaches the viewport (without it,
   all zero-height wrappers stack at the same spot and mount at once) */
.k-lazy.is-empty {
    min-height: 420px;
}

/* native render-skipping for mounted offscreen sections — the browser skips
   layout/paint for them, so the first forced reflow stays cheap */
.k-lazy {
    content-visibility: auto;
    contain-intrinsic-size: auto 420px;
}
</style>

