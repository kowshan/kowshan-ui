<!-- components/KLessonList.vue -->
<!--
    KLessonList — course curriculum (syllabus) list:

      <KLessonList
        :sections="[{
          title: 'مقدمه',
          lessons: [
            { id: 1, title: 'خوش‌آمدگویی', type: 'video', duration: '3:20', done: true },
            { id: 2, title: 'نصب ابزارها', type: 'video', duration: '12:05' },
            { id: 3, title: 'آزمون ورودی', type: 'quiz', duration: '5 سوال', locked: true },
          ],
        }]"
        @select="onSelect"
      />
-->
<template>
    <div class="k-lessons">
        <!-- Header -->
        <div v-if="headerText || showProgress" class="k-lessons-head">
            <span class="k-lessons-head-text">{{ headerText }}</span>
            <span v-if="showProgress" class="k-lessons-head-progress">
                {{ doneCount }} از {{ totalCount }} درس
                <span class="k-lessons-head-bar">
                    <span class="k-lessons-head-bar-fill" :style="{ width: percent + '%' }"></span>
                </span>
            </span>
        </div>

        <!-- Sections -->
        <div v-for="(section, si) in sections" :key="si" class="k-lessons-section">
            <div class="k-lessons-section-title">{{ section.title }}</div>

            <button
                v-for="lesson in section.lessons"
                :key="lesson.id"
                type="button"
                class="k-lessons-item"
                :class="{ 'is-done': lesson.done, 'is-locked': lesson.locked, 'is-current': currentId === lesson.id }"
                :disabled="lesson.locked"
                @click="select(lesson)"
            >
                <span class="k-lessons-item-icon" :class="`is-${lesson.type || 'video'}`">
                    <component :is="iconFor(lesson)" :size="14" />
                </span>
                <span class="k-lessons-item-main">
                    <span class="k-lessons-item-title">{{ lesson.title }}</span>
                    <span class="k-lessons-item-meta">
                        <span v-if="lesson.duration">{{ lesson.duration }}</span>
                        <span v-if="lesson.type === 'quiz'">آزمون</span>
                        <span v-if="lesson.locked" class="k-lessons-item-locked-badge">قفل</span>
                    </span>
                </span>
                <span class="k-lessons-item-state">
                    <CheckCircle2 v-if="lesson.done" class="is-done-icon" :size="16" />
                    <Play v-else-if="!lesson.locked && currentId === lesson.id" class="is-current-icon" :size="15" />
                    <Lock v-else-if="lesson.locked" class="is-locked-icon" :size="13" />
                    <ChevronLeft v-else class="is-chevron" :size="14" />
                </span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, markRaw } from 'vue'
import { CheckCircle2, ChevronLeft, FileText, HelpCircle, Lock, Play, Video } from 'lucide-vue-next'
import { usePersianNumbers } from '../composables/usePersianNumbers'

export type LessonItem = {
    id: string | number
    title: string
    type?: 'video' | 'quiz' | 'doc'
    duration?: string
    done?: boolean
    locked?: boolean
}

export type LessonSection = {
    title: string
    lessons: LessonItem[]
}

const props = withDefaults(defineProps<{
    sections: LessonSection[]
    headerText?: string
    showProgress?: boolean
    currentId?: string | number | null
}>(), {
    headerText: '',
    showProgress: true,
    currentId: null
})

const emits = defineEmits<{
    (e: 'select', lesson: LessonItem): void
}>()

const { toPersianDigits } = usePersianNumbers()

const allLessons = computed(() => props.sections.flatMap(s => s.lessons))
const totalCount = computed(() => allLessons.value.length)
const doneCount = computed(() => allLessons.value.filter(l => l.done).length)
const percent = computed(() => (totalCount.value ? Math.round((doneCount.value / totalCount.value) * 100) : 0))

const iconFor = (lesson: LessonItem) => {
    if (lesson.type === 'quiz') return markRaw(HelpCircle)
    if (lesson.type === 'doc') return markRaw(FileText)
    return markRaw(Video)
}

const select = (lesson: LessonItem) => {
    if (!lesson.locked) emits('select', lesson)
}
</script>

<style scoped>
.k-lessons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    max-width: 420px;
}

.k-lessons-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 12px;
    background: var(--k-surface, #f8fafc);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 10px;
}

.k-lessons-head-text {
    font-size: 0.78rem;
    font-weight: 800;
    color: var(--k-text-primary, #1e293b);
}

.k-lessons-head-progress {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.66rem;
    font-weight: 700;
    color: var(--k-text-secondary, #64748b);
}

.k-lessons-head-bar {
    width: 60px;
    height: 5px;
    border-radius: 999px;
    background: var(--k-surface-hover, #e2e8f0);
    overflow: hidden;
}

.k-lessons-head-bar-fill {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--k-primary, #1db954);
    transition: width 0.4s ease;
}

.k-lessons-section {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.k-lessons-section-title {
    font-size: 0.68rem;
    font-weight: 800;
    color: var(--k-text-muted, #94a3b8);
    padding: 2px 4px 4px;
}

.k-lessons-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 9px 10px;
    border: 1px solid transparent;
    border-radius: 10px;
    background: transparent;
    cursor: pointer;
    font-family: inherit;
    text-align: start;
    transition: all 0.15s ease;
}

.k-lessons-item:hover:not(:disabled) {
    background: var(--k-surface-hover, #f1f5f9);
}

.k-lessons-item.is-current {
    border-color: color-mix(in srgb, var(--k-primary, #1db954) 35%, transparent);
    background: var(--k-primary-light, color-mix(in srgb, #1db954 8%, transparent));
}

.k-lessons-item:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

.k-lessons-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: var(--k-surface-hover, #f1f5f9);
    color: var(--k-text-secondary, #64748b);
    flex-shrink: 0;
}

.k-lessons-item-icon.is-quiz {
    color: var(--k-primary, #1db954);
    background: var(--k-primary-light, color-mix(in srgb, #1db954 12%, transparent));
}

.k-lessons-item-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
}

.k-lessons-item-title {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--k-text-primary, #1e293b);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.k-lessons-item.is-done .k-lessons-item-title {
    color: var(--k-text-muted, #94a3b8);
}

.k-lessons-item-meta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.62rem;
    color: var(--k-text-muted, #94a3b8);
}

.k-lessons-item-locked-badge {
    font-size: 0.56rem;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 999px;
    background: var(--k-surface-hover, #e2e8f0);
    color: var(--k-text-muted, #94a3b8);
}

.k-lessons-item-state {
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

.is-done-icon {
    color: var(--k-success, #16a34a);
}

.is-current-icon {
    color: var(--k-primary, #1db954);
}

.is-locked-icon {
    color: var(--k-text-muted, #94a3b8);
}

.is-chevron {
    color: var(--k-text-muted, #94a3b8);
}
</style>
