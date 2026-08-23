// docs/useComponentDocs.ts
// Build-time catalog of every kit component: parses each SFC's <script setup>
// (defineProps + withDefaults) into a prop table, extracts the first comment
// block as the description, groups by category, and GENERATES a usage snippet
// from the component's own props — no hand-written docs.

export interface DocProp {
    name: string
    type: string
    optional: boolean
    defaultRaw?: string
    defaultValue?: any
    description?: string
}

export interface ComponentDoc {
    name: string
    dir: 'components' | 'wrappers'
    source: string
    description: string
    category: string
    props: DocProp[]
    snippet: string
}

/* ── SFC source (raw strings — no module graph, keeps optional deps out) ── */
const componentSources = import.meta.glob('../ui-kit/components/*.vue', { query: '?raw', import: 'default', eager: true })
const wrapperSources = import.meta.glob('../ui-kit/wrappers/*.vue', { query: '?raw', import: 'default', eager: true })

/* lazy module importers for the live playground */
export const componentLoaders = import.meta.glob('../ui-kit/components/*.vue')
export const wrapperLoaders = import.meta.glob('../ui-kit/wrappers/*.vue')

/* ── category map (curated; unmatched fall into «سایر») ── */
const CATEGORIES: Record<string, string[]> = {
    'فرم و ورودی': [
        'KAutocomplete', 'KBankCardInput', 'KCaptcha', 'KCheckbox', 'KColorPicker', 'KCurrency',
        'KDatePicker', 'KDatePickerModal', 'KDateRange', 'KFileInput', 'KFileUpload', 'KForm',
        'KGuestPicker', 'KImageUpload', 'KInlineEdit', 'KMultiSelect', 'KNationalIdInput',
        'KNumberInput', 'KOTPInput', 'KPasswordInput', 'KPhoneInput', 'KPostalCodeInput',
        'KProvinceCitySelect', 'KRadioGroup', 'KRating', 'KSearchInput', 'KSelect', 'KShibaInput',
        'KSignaturePad', 'KSlider', 'KTextarea', 'KTextInput', 'KTimePickerModal', 'KToggle', 'KWheelPicker',
    ],
    'دکمه و نشان': ['KBadge', 'KButton', 'KIconButton'],
    'نمایش داده': [
        'KActivityHeatmap', 'KAvatar', 'KAvatarGroup', 'KAvailabilityGrid', 'KChart', 'KDataTable',
        'KEmptyState', 'KJsonNode', 'KJsonViewer', 'KPagination', 'KSkeleton', 'KSparkline',
        'KStatCard', 'KTimeline', 'KTreeNode', 'KTreeView', 'KVirtualList',
    ],
    'بازخورد': [
        'KAlert', 'KConfirmDialog', 'KCountdownTimer', 'KGauge', 'KNotificationBell', 'KProgress',
        'KProgressRing', 'KResultPage', 'KSpinner', 'KToastHost', 'KTooltip',
    ],
    'پیمایش': ['KAccordion', 'KAppBar', 'KBreadcrumb', 'KCommandPalette', 'KDropdownMenu', 'KSidebar', 'KStepper', 'KTabs'],
    'پوشش (Overlay)': ['KBottomSheet', 'KContextMenu', 'KDrawer', 'KLightbox', 'KModal'],
    'CRM': ['KAssessment', 'KContactCard', 'KFilterBar', 'KKanban', 'KMagicFill', 'KStories'],
    'رزرو': ['KAvailabilityGrid', 'KCountdownTimer', 'KDateRange', 'KGuestPicker'],
    'موبایل و PWA': ['KBottomNav', 'KInstallPrompt', 'KOfflineBanner', 'KUpdatePrompt'],
    'دوره و تخفیف': ['KCartItem', 'KCouponInput', 'KCourseCard', 'KLessonList', 'KOrderSummary'],
    'کارت‌های زیبا': ['KCard', 'KFeatureCard', 'KPricingCard', 'KProfileCard', 'KSpotlightCard', 'KTestimonialCard'],
    'تأیید هویت': ['KOTPInput', 'KVerificationCard', 'KVerifyBadge'],
    'پیشرفته': [
        'KAudioPlayer', 'KCopyButton', 'KImportWizard', 'KOrgChart', 'KOrgNode', 'KPermissionTree',
        'KPermissionTreeNode', 'KQrCode', 'KSplitPane', 'KVideoPlayer',
    ],
    'رسانه و نقشه': ['KLightbox', 'KMap', 'KMediaGallery'],
}

const CATEGORY_ORDER = Object.keys(CATEGORIES)
const categoryOf = (name: string) => {
    for (const [cat, list] of Object.entries(CATEGORIES)) {
        if (list.includes(name)) return cat
    }
    return 'سایر'
}

/* ── helpers ── */
const firstLine = (s: string) => s.split('\n').map(l => l.trim()).find(Boolean) ?? ''

/* balanced scan: find the matching close for open at index i of str.
   Comment-aware: quotes inside /* * / or // comments must not open strings,
   and braces inside comments must not count (e.g. KForm's `inputs' \`rules\`)`). */
function balanced(str: string, i: number, open: string, close: string) {
    let depth = 0
    let inStr = false
    let strCh = ''
    let inComment = false
    for (; i < str.length; i++) {
        const c = str[i]
        if (inComment) {
            if (c === '*' && str[i + 1] === '/') { inComment = false; i++ }
            continue
        }
        if (inStr) {
            if (c === '\\') i++
            else if (c === strCh) inStr = false
            continue
        }
        if (c === '/' && str[i + 1] === '*') { inComment = true; i++; continue }
        if (c === '/' && str[i + 1] === '/') {
            while (i < str.length && str[i] !== '\n') i++
            continue
        }
        if (c === '"' || c === "'" || c === '`') { inStr = true; strCh = c; continue }
        if (c === open) depth++
        else if (c === close) {
            depth--
            if (depth === 0) return i
        }
    }
    return -1
}

/* ── props type block: defineProps<{...}> or defineProps<Props> + interface ── */
function extractPropsBlock(src: string): string | null {
    const idx = src.indexOf('defineProps')
    if (idx < 0) return null
    const after = src.slice(idx + 'defineProps'.length)
    const lt = after.indexOf('<')
    if (lt < 0) return null
    let i = lt + 1
    while (i < after.length && /\s/.test(after[i])) i++
    if (after[i] === '{') {
        const end = balanced(after, i, '{', '}')
        return end > 0 ? after.slice(i, end + 1) : null
    }
    const named = after.slice(lt + 1).match(/^([A-Za-z_$][\w$]*)/)
    if (named) {
        const name = named[1]
        const itf = src.match(new RegExp(`interface\\s+${name}\\s*\\{([\\s\\S]*?)\\}`))
        if (itf) return itf[1]
        const tp = src.match(new RegExp(`type\\s+${name}\\s*=\\s*\\{([\\s\\S]*?)\\}`))
        if (tp) return tp[1]
    }
    return null
}

/* ── defaults object: withDefaults(defineProps<...>(), { ... }) ── */
function extractDefaults(src: string): Record<string, string> {
    const idx = src.indexOf('withDefaults')
    if (idx < 0) return {}
    const after = src.slice(idx + 'withDefaults'.length)
    // locate the defaults object INSIDE the call:
    //   withDefaults( defineProps<{...}>( ), { ... } )
    const dIdx = after.indexOf('defineProps')
    if (dIdx < 0) return {}
    const lt = after.indexOf('<', dIdx)
    if (lt < 0) return {}
    let angle = 0
    let typeClose = -1
    for (let i = lt; i < after.length; i++) {
        if (after[i] === '<') angle++
        else if (after[i] === '>') {
            if (after[i - 1] === '=') continue // arrow `=>`, not a closing angle
            angle--
            if (angle === 0) { typeClose = i; break }
        }
    }
    if (typeClose < 0) return {}
    let j = typeClose + 1
    while (j < after.length && /\s/.test(after[j])) j++
    if (after[j] === '(') j++
    while (j < after.length && /\s/.test(after[j])) j++
    if (after[j] === ')') j++
    while (j < after.length && /\s/.test(after[j])) j++
    if (after[j] !== ',') return {}
    j++
    while (j < after.length && /\s/.test(after[j])) j++
    const brace = j
    if (after[j] !== '{') return {}
    const close = balanced(after, brace, '{', '}')
    if (close < 0) return {}
    const obj = after.slice(brace + 1, close)

    const out: Record<string, string> = {}
    let i = 0
    const n = obj.length
    while (i < n) {
        while (i < n && /[\s,]/.test(obj[i])) i++
        if (i >= n) break
        // skip comment lines (e.g. `// Persian kit convention: …`)
        if (obj[i] === '/' && obj[i + 1] === '/') {
            while (i < n && obj[i] !== '\n') i++
            continue
        }
        const nameStart = i
        while (i < n && /[\w$]/.test(obj[i])) i++
        const name = obj.slice(nameStart, i)
        while (i < n && /\s/.test(obj[i])) i++
        if (obj[i] !== ':') { i++; continue }
        i++
        while (i < n && /\s/.test(obj[i])) i++
        // strip arrow-function wrapper: () => value
        if (obj.startsWith('() =>', i)) i += 5
        else if (obj.startsWith('()=>', i)) i += 4
        while (i < n && /\s/.test(obj[i])) i++
        const valStart = i
        if (obj[i] === '{' || obj[i] === '[' || obj[i] === '(') {
            const open2 = obj[i]
            const close2 = open2 === '{' ? '}' : open2 === '[' ? ']' : ')'
            const e = balanced(obj, i, open2, close2)
            i = e > 0 ? e + 1 : n
        } else if (obj[i] === '"' || obj[i] === "'" || obj[i] === '`') {
            const q = obj[i]
            i++
            while (i < n) {
                if (obj[i] === '\\') i += 2
                else if (obj[i] === q) { i++; break }
                else i++
            }
        } else {
            while (i < n && !/[\s,]/.test(obj[i])) i++
        }
        if (i > valStart) out[name] = obj.slice(valStart, i).trim()
    }
    return out
}

/* parse a raw default string into a JS value where possible */
function parseDefault(raw: string): any {
    if (raw === undefined || raw === '') return undefined
    const t = raw.trim()
    try {
        return JSON.parse(t) // double-quoted strings, numbers, booleans, arrays, objects
    } catch { /* fall through */ }
    const sq = t.match(/^'((?:[^'\\]|\\.)*)'$/)
    if (sq) return sq[1] // single-quoted string
    return t
}

/* ── props from the type block ── */
function parsePropsBlock(block: string): DocProp[] {
    const props: DocProp[] = []
    const re = /^\s*([A-Za-z_$][\w$]*)(\??)\s*:\s*([^\n]+?)\s*$/gm
    let m: RegExpExecArray | null
    while ((m = re.exec(block))) {
        const [, name, q, rawType] = m
        const comment = rawType.match(/\/\/\s*(.+)$/)
        const type = (comment ? rawType.slice(0, comment.index) : rawType).trim()
        if (!type) continue
        props.push({
            name,
            optional: q === '?',
            type,
            description: comment ? comment[1].trim() : undefined,
        })
    }
    return props
}

/* ── description: first comment block, else filename ── */
function extractDescription(src: string, name: string): string {
    const comment = src.match(/<!--\s*([\s\S]*?)-->/)
    if (comment) {
        const lines = comment[1].split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('<') && !l.startsWith('K'))
        if (lines.length) return lines[0]
    }
    const jsComment = src.match(/\/\/\s*(.+)/)
    if (jsComment && jsComment[1]) return jsComment[1].trim()
    return name
}

/* ── control kind + example value for the playground ── */
export type ControlKind = 'toggle' | 'select' | 'text' | 'number' | 'none'

export function controlKindFor(type: string): ControlKind {
    const t = type.trim()
    if (t === 'boolean') return 'toggle'
    if (t === 'number') return 'number'
    if (t === 'string') return 'text'
    const quoted = t.match(/'([^']*)'/g) ?? t.match(/"([^"]*)"/g)
    if (quoted && quoted.length >= 2 && t.replace(/'[^']*'/g, '').replace(/"[^"]*"/g, '').trim() === '') {
        return 'select'
    }
    return 'none'
}

export function unionMembers(type: string): string[] {
    const members = type.match(/'([^']*)'/g) ?? []
    return members.map(x => x.slice(1, -1))
}

export function exampleForType(type: string): any {
    const kind = controlKindFor(type)
    if (kind === 'toggle') return false // optional booleans default OFF (e.g. loading/disabled)
    if (kind === 'number') return 0
    if (kind === 'select') return unionMembers(type)[0] ?? ''
    if (kind === 'text') return 'متن'
    return undefined
}

/* ── snippet generation ── */
const SKIP_SNIPPET = new Set(['customClass', 'ariaLabel', 'describedBy', 'id'])

function formatSnippetValue(p: DocProp): { attr: string; binding: boolean; value: string } | null {
    if (p.defaultValue !== undefined && p.defaultValue !== null && p.defaultValue !== '') {
        const d = p.defaultValue
        if (typeof d === 'string') return { attr: p.name, binding: false, value: d }
        if (typeof d === 'boolean' || typeof d === 'number') return { attr: p.name, binding: true, value: String(d) }
        if (Array.isArray(d)) return { attr: p.name, binding: true, value: JSON.stringify(d) }
        return null
    }
    if (!p.optional) {
        const kind = controlKindFor(p.type)
        if (kind === 'text') return { attr: p.name, binding: false, value: 'متن' }
        if (kind === 'select') return { attr: p.name, binding: false, value: unionMembers(p.type)[0] ?? '' }
        if (kind === 'number') return { attr: p.name, binding: true, value: '0' }
        if (kind === 'toggle') return { attr: p.name, binding: true, value: 'true' }
    }
    return null
}

function buildSnippet(doc: { name: string; props: DocProp[] }): string {
    const parts: string[] = []
    for (const p of doc.props) {
        if (SKIP_SNIPPET.has(p.name)) continue
        const v = formatSnippetValue(p)
        if (!v) continue
        const head = v.binding ? `:${v.attr}="${v.value}"` : `${v.attr}="${v.value}"`
        parts.push(`    ${head}`)
    }
    if (!parts.length) return `<${doc.name} />`
    return `<${doc.name}\n${parts.join('\n')}\n/>`
}

/* curated usage examples for the most common components (the generated
   snippet is empty or bare for them) */
const SNIPPET_OVERRIDES: Record<string, string> = {
    KButton: `<KButton
    text="ذخیره تغییرات"
    bgColor="#3b82f6"
    textColor="#ffffff"
    @click="save"
/>`,
    KIconButton: `<KIconButton
    :icon="SaveIcon"
    bg-color="#3b82f6"
    text-color="#ffffff"
    tooltip="ذخیره"
/>`,
    KBadge: `<KBadge label="جدید" color="#10b981" />`,
    KTextInput: `<KTextInput v-model="name" label="نام" placeholder="نام را وارد کنید" />`,
    KSelect: `<KSelect v-model="city" :options="cities" label="شهر" />`,
    KCheckbox: `<KCheckbox v-model="accepted" label="قوانین را می‌پذیرم" />`,
    KToggle: `<KToggle v-model="enabled" label="فعال" />`,
    KAlert: `<KAlert type="success" title="ذخیره شد" message="تغییرات با موفقیت ثبت شد" />`,
    KCard: `<KCard title="عنوان کارت">
    محتوای کارت
    <template #footer>پانوشت</template>
</KCard>`,
    KDataTable: `<KDataTable :data="rows" :columns="columns" title="مشتریان" />`,
    KModal: `<KModal id="my-modal" title="عنوان">
    محتوای مودال
</KModal>`,
    KChart: `<KChart
    type="bar"
    :data="[
        { label: 'فروردین', value: 120 },
        { label: 'اردیبهشت', value: 90 },
    ]"
/>`,
    KQrCode: `<KQrCode value="https://example.com" size="160" />`,
    KSpinner: `<KSpinner size="md" />`,
    KProgress: `<KProgress :value="65" show-label />`,
}

/* ── catalog ── */
function buildCatalog(): ComponentDoc[] {
    const docs: ComponentDoc[] = []
    for (const [path, raw] of Object.entries({ ...componentSources, ...wrapperSources })) {
        const source = raw as string // `?raw` glob values are typed unknown
        const file = path.split('/').pop() ?? ''
        const name = file.replace(/\.vue$/, '')
        const dir = path.includes('/wrappers/') ? 'wrappers' : 'components'
        const propsBlock = extractPropsBlock(source)
        const props = propsBlock ? parsePropsBlock(propsBlock) : []
        const defaults = extractDefaults(source)
        for (const p of props) {
            if (p.name in defaults) {
                p.defaultRaw = defaults[p.name]
                p.defaultValue = parseDefault(defaults[p.name])
            }
        }
        const doc: ComponentDoc = {
            name,
            dir,
            source,
            description: extractDescription(source, name),
            category: categoryOf(name),
            props,
            snippet: '',
        }
        doc.snippet = SNIPPET_OVERRIDES[doc.name] ?? buildSnippet(doc)
        docs.push(doc)
    }
    return docs.sort((a, b) => a.name.localeCompare(b.name))
}

export const catalog: ComponentDoc[] = buildCatalog()
export const catalogByCategory = CATEGORY_ORDER
    .map(cat => ({ category: cat, items: catalog.filter(d => d.category === cat) }))
    .filter(g => g.items.length)
    .concat(CATEGORY_ORDER.includes('سایر') ? [] : [{ category: 'سایر', items: catalog.filter(d => d.category === 'سایر') }])
    .filter(g => g.items.length)

export const docByName = (name: string) => catalog.find(d => d.name === name)
