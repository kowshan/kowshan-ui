<!-- layouts/DefaultLayout.vue — sidebar + content shell with 3-way theme toggle -->
<template>
    <div class="kit-shell">
        <header class="kit-header">
            <h1 class="kit-title">Kowshan Kit (k-kit v1.0.0)</h1>
            <div class="kit-themes">
                <component
                    v-for="t in themes"
                    :is="t.icon"
                    :key="t.id"
                    class="kit-theme-btn"
                    :class="{ active: theme === t.id }"
                    @click="setTheme(t.id)"
                />
            </div>
        </header>
        <div class="kit-body">
            <aside class="kit-sidebar" ref="sidebarRef">
                <input
                    v-model="search"
                    type="text"
                    class="kit-search"
                    placeholder="جستجو..."
                    dir="rtl"
                />
                <div class="kit-sidebar-list">
                    <div
                        v-for="group in filtered"
                        :key="group.letter"
                        class="kit-sidebar-group"
                    >
                        <div class="kit-sidebar-letter">{{ group.letter }}</div>
                        <button
                            v-for="comp in group.items"
                            :key="comp"
                            class="kit-sidebar-item"
                            :class="{ active: selected === comp }"
                            @click="select(comp)"
                        >{{ comp }}</button>
                    </div>
                </div>
            </aside>
            <main class="kit-main">
                <router-view :key="selected" />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { EyeIcon, MoonIcon, SunIcon } from 'lucide-vue-next'
import { ref, computed, provide, inject, type Ref } from 'vue'
import { useRouter } from 'vue-router'

const theme = inject<Ref<string>>('theme')!
const setTheme = inject<(t: string) => void>('setTheme')!
const router = useRouter()

const themes = [
    { id: 'light', icon: SunIcon },
    { id: 'dark', icon: MoonIcon },
    { id: 'oled', icon: EyeIcon },
]

const search = ref('')
const selected = ref('')

const select = (name: string) => {
    selected.value = name
    router.push({ name: 'component', params: { name } })
}

// Full component list — flat, A-Z
const allNames = [
    'KAccordion','KActivityHeatmap','KAlert','KAppBar','KAssessment',
    'KAssessmentContent','KAssessmentInput','KAssessmentOption','KAssessmentQuestion','KAssessmentResult',
    'KAudioPlayer','KAudioWaveform','KAutocomplete','KAvailabilityGrid','KAvatar','KAvatarGroup',
    'KBackToTop','KBadge','KBankCardInput','KBookmarkBar','KBottomNav','KBottomSheet','KBreadcrumb','KButton',
    'KCalendarHeatmap','KCameraCapture','KCaptcha','KCard','KCarousel','KCartItem','KChart','KChat','KChatInput',
    'KColorPicker','KCommandLine','KCommandPalette','KCommentThread','KConfirmDialog','KContactCard', 'KContentManager',
    'KContextMenu','KCopyButton','KCountdownTimer','KCouponInput','KCourseCard',
    'KDataTableAdvanced','KDataTableExport','KDatePickerModal','KDateRange','KDiffView',
    'KDrawer','KDropdownMenu',
    'KEmbedPreview','KEmojiPicker','KEmptyState',
    'KFab','KFeatureCard','KFileExplorer','KFileUpload','KFilterBar','KForm','KFunnel',
    'KGanttAnalysis','KGanttChart','KGauge','KGlobalLayer','KGuestPicker',
    'KIconButton','KImageGallery','KImportWizard','KInfiniteScroll','KInlineEdit','KInstallPrompt',
    'KJobCard','KJsonNode','KJsonViewer',
    'KKanban',
    'KLessonList','KLightbox',
    'KMagicFill','KMarkdownRenderer','KMasonry','KMegaMenu','KMegaMenuBar','KMegaMenuItem','KModal','KMultiStepWizard',
    'KNationalIdInput','KNotificationBell','KNumberInput',
    'KOfflineBanner','KOnboardingTour','KOrderSummary','KOrgChart','KOrgNode','KOTPInput',
    'KPageHeader','KPagination','KPasswordStrength','KPermissionTree','KPermissionTreeNode',
    'KPhoneInput','KPillTabs','KPivotTable','KPostalCodeInput','KPresenceIndicator',
    'KPricingCard','KProductCard','KProfileCard','KProgress','KProgressRing','KProvinceCitySelect',
    'KQrCode','KQuizCard',
    'KRating','KResultPage',
    'KScatterPlot','KScreenRecorder','KSearchInput','KShibaInput','KSidebar','KSignaturePad',
    'KSkeleton','KSortableList','KSparkline','KSpinner','KSplitPane','KSpotlightCard',
    'KStatCard','KStepper','KStickyHeader','KStories','KSwiper','KSwiperButton',
    'KTabs','KTagInput','KTeamCard','KTeleportHub','KTestimonialCard','KTimeline',
    'KTimePickerModal','KToastHost','KTooltip','KTreeMap','KTreeNode','KTreeView','KTypingIndicator',
    'KUpdatePrompt',
    'KVerificationCard','KVerifyBadge','KVideoPlayer','KVideoThumbnail','KVirtualList','KVoiceRecorder',
    'KWaterfall','KWheelPicker',
    // Wrappers
    'KCheckbox','KCurrency','KDataTable','KDatePicker','KFileInput','KImageUpload',
    'KMap','KMediaGallery','KMultiSelect','KPasswordInput','KRadioGroup',
    'KSelect','KSlider','KTextarea','KTextInput','KTimePicker','KToggle',
]

// Pinned groups at the bottom of the list (not part of the A→Z catalogue)
const pinnedGroups = [
    {
        letter: 'examples',
        names: ['ExampleAssessment1', 'ExampleAssessment2', 'ExampleAssessment3', 'ExampleAssessment4', 'ExampleAssessment5'],
    },
    { letter: 'extra', names: ['KCalendar', 'KAssessmentWizard'] },
]

const filtered = computed(() => {
    const q = search.value.toLowerCase()
    const items = allNames.filter(n => !q || n.toLowerCase().includes(q))
    const groups = new Map<string, string[]>()
    for (const name of items) {
        const letter = name.charAt(1).toUpperCase()
        if (!groups.has(letter)) groups.set(letter, [])
        groups.get(letter)!.push(name)
    }
    for (const list of groups.values()) list.sort((a, b) => a.localeCompare(b))
    const letters = [...groups.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([letter, items]) => ({ letter, items }))
    const pinned = pinnedGroups
        .map(g => ({ letter: g.letter, items: g.names.filter(n => !q || n.toLowerCase().includes(q)) }))
        .filter(g => g.items.length)
    return [...letters, ...pinned]
})

provide('selected', selected)
</script>

<style scoped>
.kit-shell {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
}

.kit-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 48px;
    flex-shrink: 0;
    border-bottom: 1px solid var(--k-border);
    background: var(--k-bg);
    z-index: 100;
}

.kit-title {
    font-size: 0.95rem;
    font-weight: 800;
    margin: 0;
    color: var(--k-text-primary);
}

.kit-themes {
    display: flex;
    gap: 4px;
}

.kit-theme-btn {
    width: 30px;
    height: 30px;
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-sm);
    background: var(--k-surface);
    padding: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.12s;
}

.kit-theme-btn:hover {
    border-color: var(--k-border-focus);
}

.kit-theme-btn.active {
    background: var(--k-primary);
    border-color: var(--k-primary);
}

.kit-body {
    display: flex;
    flex: 1;
    overflow: hidden;
}

.kit-sidebar {
    width: 220px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    border-left: 1px solid var(--k-border);
    background: var(--k-surface);
    overflow: hidden;
}

.kit-search {
    margin: 8px 8px 0;
    height: 32px;
    padding: 0 10px;
    border: 1px solid var(--k-border);
    border-radius: var(--k-radius-sm);
    background: var(--k-bg);
    color: var(--k-text-primary);
    font-family: inherit;
    font-size: 0.78rem;
    outline: none;
    flex-shrink: 0;
}

.kit-search:focus {
    border-color: var(--k-border-focus);
}

.kit-sidebar-list {
    flex: 1;
    overflow-y: auto;
    padding: 4px 0 12px;
}

.kit-sidebar-group {
    margin-bottom: 2px;
}

.kit-sidebar-letter {
    font-size: 0.65rem;
    font-weight: 800;
    color: var(--k-text-muted);
    padding: 6px 12px 2px;
    text-transform: uppercase;
}

.kit-sidebar-item {
    display: block;
    width: 100%;
    text-align: right;
    padding: 4px 12px;
    border: none;
    background: transparent;
    color: var(--k-text-secondary);
    font-size: 0.72rem;
    font-family: ui-monospace, monospace;
    cursor: pointer;
    transition: all 0.1s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.kit-sidebar-item:hover {
    background: var(--k-surface-hover);
    color: var(--k-text-primary);
}

.kit-sidebar-item.active {
    background: var(--k-primary-light, rgba(29, 185, 84, 0.1));
    color: var(--k-primary);
    font-weight: 600;
}

.kit-main {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px;
    min-width: 0;
}
</style>
