<!-- KContentManager — chapter/lesson tree manager (course builder style).
     Sidebar = chapter tree (folders only, nested, "add chapter" / "add sub-chapter").
     Content = items of the selected chapter; toolbar creates inside the open chapter only.
     All mutations emit `crud`; the host owns persistence. -->
<template>
    <div class="k-cm2">
        <!-- ── Sidebar: chapters ── -->
        <div class="k-cm2-side">
            <div class="k-cm2-side-head">
                <span class="k-cm2-side-title">{{ chaptersLabel }}</span>
                <span class="k-cm2-side-tools">
                    <button type="button" class="k-cm2-ib" :title="'افزودن ' + chaptersLabel" @click="startCreate('chapter', null)">
                        <Plus :size="14" />
                    </button>
                    <button
                        type="button" class="k-cm2-ib"
                        :title="'افزودن ' + chaptersLabel + ' داخلی'"
                        :disabled="!activeChapter"
                        @click="startCreate('chapter', activeChapter)"
                    >
                        <FolderPlus :size="14" />
                    </button>
                </span>
            </div>

            <div class="k-cm2-tree">
                <template v-for="row in chapterRows" :key="row.node.id">
                    <div
                        class="k-cm2-row"
                        :class="{ 'is-active': activeChapterId === row.node.id }"
                        :style="{ paddingInlineStart: 12 + row.depth * 18 + 'px' }"
                        @click="openChapter(row.node)"
                    >
                        <ChevronRight
                            v-if="row.hasChildren"
                            :size="14"
                            class="k-cm2-chevron"
                            :class="{ 'is-open': expanded.has(row.node.id) }"
                            @click.stop="toggle(row.node.id)"
                        />
                        <span v-else class="k-cm2-chevron-spacer" />
                        <component :is="expanded.has(row.node.id) ? FolderOpen : Folder" :size="15" class="k-cm2-icon" :class="{ 'is-open': expanded.has(row.node.id) }" />
                        <input
                            v-if="renaming === row.node.id"
                            ref="inputEl"
                            v-model="newName"
                            class="k-cm2-input"
                            @keydown.enter="confirmRename"
                            @keydown.esc="renaming = ''"
                            @blur="confirmRename"
                        />
                        <template v-else>
                            <span class="k-cm2-name">{{ row.node.name }}</span>
                            <span class="k-cm2-count">{{ row.node.children?.length || 0 }}</span>
                        </template>
                        <MoreHorizontal :size="14" class="k-cm2-more" @click.stop="chapterMenu($event, row.node)" />
                    </div>
                </template>

                <div v-if="creatingKind === 'chapter'" class="k-cm2-row is-creating" :style="{ paddingInlineStart: 12 + createDepth * 18 + 'px' }">
                    <span class="k-cm2-chevron-spacer" />
                    <Folder :size="15" class="k-cm2-icon" />
                    <input
                        ref="inputEl"
                        v-model="newName"
                        class="k-cm2-input"
                        :placeholder="'نام ' + chaptersLabel"
                        @keydown.enter="confirmCreate"
                        @keydown.esc="creatingKind = ''"
                        @blur="confirmCreate"
                    />
                </div>

                <div v-if="!chapterRows.length && creatingKind !== 'chapter'" class="k-cm2-empty">
                    <FolderPlus :size="24" />
                    <span>{{ chaptersLabel }}ی نیست</span>
                </div>
            </div>
        </div>

        <!-- ── Content: items of open chapter ── -->
        <div class="k-cm2-main">
            <div class="k-cm2-head">
                <div class="k-cm2-crumb">
                    <span v-for="(c, i) in crumbs" :key="i" class="k-cm2-crumb-item" :class="{ 'is-link': c.id }" @click="c.id && openChapterById(c.id)">
                        {{ c.name }}
                    </span>
                </div>
                <div class="k-cm2-actions">
                    <button type="button" class="k-cm2-ib" title="پوشه جدید" :disabled="!activeChapter" @click="startCreate('folder', null)">
                        <FolderPlus :size="14" />
                    </button>
                    <button type="button" class="k-cm2-ib" title="فایل جدید" :disabled="!activeChapter" @click="startCreate('file', null)">
                        <FilePlus :size="14" />
                    </button>
                    <button type="button" class="k-cm2-ib is-danger" title="حذف انتخاب‌شده" :disabled="!selected" @click="removeSelected">
                        <Trash2 :size="14" />
                    </button>
                </div>
            </div>

            <div class="k-cm2-grid" @contextmenu.prevent="gridMenu">
                <div
                    v-for="item in contentItems"
                    :key="item.id"
                    class="k-cm2-card"
                    :class="{ 'is-selected': selected?.id === item.id }"
                    @click="item.isFolder ? openSubFolder(item) : select(item)"
                    @dblclick="!item.isFolder && startRename(item)"
                    @contextmenu.prevent.stop="item.isFolder ? subFolderMenu($event, item) : fileMenu($event, item)"
                >
                    <div class="k-cm2-card-icon" :class="{ 'is-folder': item.isFolder }">
                        <component :is="iconOf(item)" :size="26" />
                    </div>
                    <input
                        v-if="renaming === item.id"
                        v-model="newName"
                        class="k-cm2-input"
                        @keydown.enter="confirmRename"
                        @keydown.esc="renaming = ''"
                        @blur="confirmRename"
                    />
                    <template v-else>
                        <span class="k-cm2-card-name">{{ item.name }}</span>
                        <span v-if="item.meta" class="k-cm2-card-meta">{{ item.meta }}</span>
                        <span v-if="item.duration" class="k-cm2-card-duration">{{ item.duration }}</span>
                    </template>
                </div>

                <div v-if="creatingKind === 'folder' || creatingKind === 'file'" class="k-cm2-card is-creating">
                    <div class="k-cm2-card-icon">
                        <component :is="creatingKind === 'folder' ? Folder : File" :size="26" />
                    </div>
                    <input
                        ref="inputEl"
                        v-model="newName"
                        class="k-cm2-input"
                        :placeholder="creatingKind === 'folder' ? 'نام پوشه' : 'نام فایل'"
                        @keydown.enter="confirmCreate"
                        @keydown.esc="creatingKind = ''"
                        @blur="confirmCreate"
                    />
                </div>

                <div v-if="!contentItems.length && !creatingKind" class="k-cm2-empty">
                    <FolderOpen :size="32" />
                    <span>{{ activeChapter ? 'خالی است' : 'یک ' + chaptersLabel + ' انتخاب کنید' }}</span>
                    <span v-if="activeChapter" class="k-cm2-empty-hint">راست‌کلیک یا دکمه‌های بالا</span>
                </div>
            </div>

            <!-- preview strip -->
            <div v-if="selected" class="k-cm2-preview">
                <component :is="iconOf(selected)" :size="18" />
                <strong>{{ selected.name }}</strong>
                <span v-if="selected.duration" class="k-cm2-card-duration">{{ selected.duration }}</span>
                <span class="k-cm2-preview-actions">
                    <button type="button" class="k-cm2-ib" title="تغییر نام" @click="startRename(selected)"><Pencil :size="13" /></button>
                    <button type="button" class="k-cm2-ib is-danger" title="حذف" @click="removeItem(selected)"><Trash2 :size="13" /></button>
                </span>
            </div>
        </div>

        <!-- context menu -->
        <Teleport to="#k-teleport-hub">
            <div
                v-if="menu.open"
                class="k-ui k-ctx-menu k-cm2-ctx"
                :data-theme="theme"
                :style="{ top: menu.y + 'px', left: menu.x + 'px' }"
                @contextmenu.prevent
            >
                <template v-for="(item, i) in menuEntries" :key="i">
                    <div v-if="item === 'divider'" class="k-cm2-ctx-divider" />
                    <button
                        v-else type="button" class="k-cm2-ctx-item"
                        :class="{ 'is-danger': item.danger }"
                        :disabled="item.disabled"
                        @click="item.run(); menu.open = false"
                    >
                        <component :is="item.icon" v-if="item.icon" :size="14" />
                        <span>{{ item.label }}</span>
                    </button>
                </template>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import {
    ChevronRight, Folder, FolderOpen, File, FileText, Image, Film, Music,
    Archive, Code, FileJson, Plus, FolderPlus, FilePlus, Trash2, Pencil,
    MoreHorizontal, Youtube,
} from 'lucide-vue-next'
import { useKitTheme } from '../composables/useKitTheme'
import { useKContextMenu } from '../composables/useKContextMenu'
import { findNode, removeNode, uid, type TreeNode } from '../utils/tree'

export interface ContentItem extends TreeNode {
    meta?: string
    duration?: string
}

const props = withDefaults(defineProps<{
    chapters: ContentItem[]
    /** label used in UI, e.g. 'فصل' (course), 'پوشه' (files), 'بخش' (pages) */
    chaptersLabel?: string
    /** max chapter nesting depth, e.g. 3 */
    maxDepth?: number
}>(), {
    chapters: () => [],
    chaptersLabel: 'فصل',
    maxDepth: 3,
})

const emit = defineEmits<{
    'select': [item: ContentItem]
    'open': [item: ContentItem]
    'chapter-change': [chapter: ContentItem | null]
    'crud': [action: 'create' | 'rename' | 'delete', item: ContentItem, chapters: ContentItem[]]
}>()

const theme = useKitTheme()
const { ctx: menu, entries: menuEntries, openCtx } = useKContextMenu('.k-cm2-ctx')

const tree = ref<ContentItem[]>(JSON.parse(JSON.stringify(props.chapters)))
const activeChapterId = ref('')
const expanded = ref(new Set<string>())
const selected = ref<ContentItem | null>(null)
const creatingKind = ref<'' | 'chapter' | 'folder' | 'file'>('')
const createParentId = ref('')
const renaming = ref('')
const newName = ref('')
const inputEl = ref<HTMLInputElement | null>(null)

/* ── chapter tree rows (flattened for rendering, depth-aware) ── */
const chapterRows = computed(() => {
    const rows: { node: ContentItem; depth: number; hasChildren: boolean }[] = []
    const walk = (items: ContentItem[], depth: number) => {
        for (const n of items) {
            rows.push({ node: n, depth, hasChildren: !!n.children?.length })
            if (n.children?.length && expanded.value.has(n.id)) walk(n.children, depth + 1)
        }
    }
    walk(tree.value, 0)
    return rows
})

const activeChapter = computed(() => activeChapterId.value ? findNode(tree.value, activeChapterId.value) : null)
const createDepth = computed(() => {
    if (!createParentId.value) return 0
    const walk = (items: ContentItem[], target: string, d: number): number => {
        for (const n of items) {
            if (n.id === target) return d + 1
            if (n.children) { const r = walk(n.children, target, d + 1); if (r) return r }
        }
        return 0
    }
    return walk(tree.value, createParentId.value, 0)
})

const contentItems = computed(() => {
    if (!activeChapter.value) return []
    const ch = activeChapter.value
    // sub-chapters surface first, then content of the open sub-folder (if user navigated deeper)
    return ch.children || []
})

/* ── navigation ── */
const crumbs = computed(() => {
    if (!activeChapterId.value) return []
    const acc: { name: string; id?: string }[] = []
    const walk = (items: ContentItem[], target: string, path: { name: string; id?: string }[]): boolean => {
        for (const n of items) {
            if (n.id === target) { acc.push(...path, { name: n.name, id: n.id }); return true }
            if (n.children && walk(n.children, target, [...path, { name: n.name, id: n.id }])) return true
        }
        return false
    }
    walk(tree.value, activeChapterId.value, [])
    return acc
})
const openChapter = (n: ContentItem) => {
    activeChapterId.value = n.id
    selected.value = null
    if (n.children?.length) expanded.value = new Set([...expanded.value, n.id])
    emit('chapter-change', n)
}
const toggle = (id: string) => {
    const s = new Set(expanded.value)
    s.has(id) ? s.delete(id) : s.add(id)
    expanded.value = s
}
const openChapterById = (id: string) => {
    const n = findNode(tree.value, id)
    if (n) openChapter(n)
}
/** drill into a sub-folder inside the content grid (reuses chapter navigation — sub-folders are folders too) */
const openSubFolder = (n: ContentItem) => openChapter(n)
const select = (n: ContentItem) => { selected.value = n; emit('select', n) }

/* ── CRUD ── */
const startCreate = (kind: 'chapter' | 'folder' | 'file', parent: ContentItem | null) => {
    creatingKind.value = kind
    createParentId.value = kind === 'chapter' ? (parent?.id || '') : (activeChapterId.value)
    if (kind === 'chapter' && parent) expanded.value = new Set([...expanded.value, parent.id])
    newName.value = ''
    nextTick(() => inputEl.value?.focus())
}

const confirmCreate = () => {
    const kind = creatingKind.value
    if (!kind) return
    creatingKind.value = ''
    const name = newName.value.trim()
    if (!name) return

    if (kind === 'chapter') {
        const depth = createDepth.value // depth of the NEW node = parent depth + 1
        const parent = createParentId.value ? findNode(tree.value, createParentId.value) : null
        if (depth > props.maxDepth) return
        const node: ContentItem = { id: uid('ch'), name, isFolder: true, children: [] }
        if (parent) {
            parent.children = parent.children || []
            parent.children.push(node)
            expanded.value = new Set([...expanded.value, parent.id])
        } else {
            tree.value.push(node)
        }
        emit('crud', 'create', node, tree.value)
        return
    }

    // folder / file → inside the open chapter
    const parent = activeChapter.value
    if (!parent) return
    const node: ContentItem = kind === 'folder'
        ? { id: uid('f'), name, isFolder: true, children: [] }
        : { id: uid('f'), name, size: '۰ KB', modified: 'همین حالا' }
    parent.children = parent.children || []
    parent.children.push(node)
    if (kind === 'file') selected.value = node
    emit('crud', 'create', node, tree.value)
}

const startRename = (n: ContentItem) => {
    renaming.value = n.id
    newName.value = n.name
    if (n.isFolder && n.children?.length) expanded.value = new Set([...expanded.value, n.id])
    nextTick(() => inputEl.value?.focus())
}
const confirmRename = () => {
    if (!renaming.value) return
    const node = findNode(tree.value, renaming.value)
    renaming.value = ''
    const name = newName.value.trim()
    if (!node || !name || node.name === name) return
    node.name = name
    emit('crud', 'rename', node, tree.value)
}

const removeItem = (n: ContentItem) => {
    removeNode(tree.value, n.id)
    if (selected.value?.id === n.id) selected.value = null
    if (activeChapterId.value === n.id) activeChapterId.value = ''
    emit('crud', 'delete', n, tree.value)
}
const removeSelected = () => { if (selected.value) removeItem(selected.value) }

/* ── icons ── */
const iconOf = (n: ContentItem) => {
    if (n.isFolder) return expanded.value.has(n.id) ? FolderOpen : Folder
    const ext = n.name.split('.').pop()?.toLowerCase() || ''
    if (['jpg','jpeg','png','gif','svg','webp'].includes(ext)) return Image
    if (['mp4','webm','avi','mov'].includes(ext)) return Film
    if (['mp3','wav','ogg','flac'].includes(ext)) return Music
    if (['zip','rar','7z','tar','gz'].includes(ext)) return Archive
    if (['js','ts','vue','css','html','py','rb'].includes(ext)) return Code
    if (['json'].includes(ext)) return FileJson
    if (['pdf','doc','docx','txt','md'].includes(ext)) return FileText
    return File
}

/* ── menus ── */
const chapterMenu = (e: MouseEvent, n: ContentItem) => {
    openChapter(n)
    const canNest = createDepth.value < props.maxDepth
    openCtx(e, [
        { label: 'باز کردن', icon: FolderOpen, run: () => openChapter(n) },
        { label: 'تغییر نام', icon: Pencil, run: () => startRename(n) },
        { label: `${props.chaptersLabel} داخلی`, icon: FolderPlus, disabled: !canNest, run: () => startCreate('chapter', n) },
        { label: 'پوشه جدید داخل آن', icon: FolderPlus, run: () => startCreate('folder', null) },
        { label: 'فایل جدید داخل آن', icon: FilePlus, run: () => startCreate('file', null) },
        'divider',
        { label: `حذف ${props.chaptersLabel}`, icon: Trash2, danger: true, run: () => removeItem(n) },
    ])
}
const subFolderMenu = (e: MouseEvent, n: ContentItem) => folderMenuFor(e, n)
const folderMenuFor = (e: MouseEvent, n: ContentItem) => {
    openCtx(e, [
        { label: 'باز کردن', icon: FolderOpen, run: () => openSubFolder(n) },
        { label: 'تغییر نام', icon: Pencil, run: () => startRename(n) },
        'divider',
        { label: 'حذف پوشه', icon: Trash2, danger: true, run: () => removeItem(n) },
    ])
}
const fileMenu = (e: MouseEvent, n: ContentItem) => {
    select(n)
    openCtx(e, [
        { label: 'تغییر نام', icon: Pencil, run: () => startRename(n) },
        'divider',
        { label: 'حذف', icon: Trash2, danger: true, run: () => removeItem(n) },
    ])
}
const gridMenu = (e: MouseEvent) => {
    openCtx(e, [
        { label: 'پوشه جدید', icon: FolderPlus, disabled: !activeChapter.value, run: () => startCreate('folder', null) },
        { label: 'فایل جدید', icon: FilePlus, disabled: !activeChapter.value, run: () => startCreate('file', null) },
    ])
}

defineExpose({ confirmCreate, confirmRename })
</script>

<style scoped>
.k-cm2 { display: flex; border: 1px solid var(--k-border); border-radius: var(--k-radius-sm); overflow: hidden; height: 460px; font-size: 0.82rem; position: relative; }

/* sidebar */
.k-cm2-side {
    width: 250px; border-left: 1px solid var(--k-border); background: var(--k-surface);
    display: flex; flex-direction: column; overflow: hidden;
}
.k-cm2-side-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 10px 8px 14px; border-bottom: 1px solid var(--k-border); flex-shrink: 0;
}
.k-cm2-side-title { font-weight: 700; font-size: 0.72rem; color: var(--k-text-muted); }
.k-cm2-side-tools { display: flex; gap: 2px; }
.k-cm2-ib {
    display: inline-flex; align-items: center; justify-content: center;
    width: 24px; height: 24px; border: none; border-radius: 6px;
    background: transparent; color: var(--k-text-secondary); cursor: pointer;
    transition: background 0.12s, color 0.12s;
}
.k-cm2-ib:hover:not(:disabled) { background: var(--k-surface-hover); color: var(--k-primary); }
.k-cm2-ib.is-danger:hover:not(:disabled) { color: var(--k-error, #ef4444); }
.k-cm2-ib:disabled { opacity: 0.35; cursor: not-allowed; }

.k-cm2-tree { flex: 1; overflow-y: auto; padding-bottom: 8px; }
.k-cm2-row {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 12px; cursor: pointer; color: var(--k-text-primary);
    transition: background 0.1s;
}
.k-cm2-row:hover { background: var(--k-surface-hover); }
.k-cm2-row.is-active { background: var(--k-primary-light); color: var(--k-primary); font-weight: 600; }
.k-cm2-row.is-creating { cursor: default; }
.k-cm2-chevron { transition: transform 0.15s; color: var(--k-text-muted); flex-shrink: 0; }
.k-cm2-chevron.is-open { transform: rotate(90deg); }
.k-cm2-chevron-spacer { width: 14px; flex-shrink: 0; }
.k-cm2-icon { color: var(--k-text-muted); flex-shrink: 0; }
.k-cm2-icon.is-open { color: var(--k-primary); }
.k-cm2-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.k-cm2-count { font-size: 0.65rem; color: var(--k-text-muted); background: var(--k-surface-hover); border-radius: 8px; padding: 1px 6px; }
.k-cm2-more { color: var(--k-text-muted); opacity: 0; flex-shrink: 0; }
.k-cm2-row:hover .k-cm2-more { opacity: 1; }
.k-cm2-more:hover { color: var(--k-primary); }

.k-cm2-input {
    flex: 1; width: 100%; min-width: 0; box-sizing: border-box;
    border: 1px solid var(--k-primary); border-radius: 5px;
    background: var(--k-bg); color: var(--k-text-primary);
    font: inherit; font-size: 0.75rem; padding: 2px 6px; outline: none;
}
.k-cm2-empty { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 32px 12px; color: var(--k-text-muted); text-align: center; }
.k-cm2-empty-hint { font-size: 0.68rem; opacity: 0.7; }

/* main */
.k-cm2-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.k-cm2-head {
    display: flex; align-items: center; justify-content: space-between; gap: 8px;
    padding: 6px 14px; border-bottom: 1px solid var(--k-border); flex-shrink: 0;
}
.k-cm2-crumb { display: flex; gap: 4px; font-size: 0.72rem; color: var(--k-text-muted); flex-wrap: wrap; min-width: 0; }
.k-cm2-crumb-item:not(:last-child)::after { content: ' / '; margin: 0 2px; }
.k-cm2-crumb-item.is-link { cursor: pointer; }
.k-cm2-crumb-item.is-link:hover { color: var(--k-primary); }
.k-cm2-actions { display: flex; gap: 4px; flex-shrink: 0; }

.k-cm2-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 10px; padding: 14px; flex: 1; overflow-y: auto; align-content: start;
}
.k-cm2-card {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    padding: 12px 8px; border-radius: 10px; border: 1px solid transparent;
    cursor: pointer; text-align: center; transition: background 0.1s, border-color 0.1s;
}
.k-cm2-card:hover { background: var(--k-surface-hover); }
.k-cm2-card.is-selected { background: var(--k-primary-light); border-color: var(--k-primary); }
.k-cm2-card.is-creating { cursor: default; }
.k-cm2-card-icon { color: var(--k-text-muted); }
.k-cm2-card-icon.is-folder { color: var(--k-warning, #f59e0b); }
.k-cm2-card-name { font-size: 0.72rem; color: var(--k-text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }
.k-cm2-card-meta { font-size: 0.62rem; color: var(--k-text-muted); }
.k-cm2-card-duration { font-size: 0.62rem; color: var(--k-primary); direction: ltr; }

.k-cm2-preview {
    display: flex; align-items: center; gap: 8px;
    border-top: 1px solid var(--k-border); padding: 10px 14px; background: var(--k-surface);
    color: var(--k-text-primary); flex-shrink: 0;
}
.k-cm2-preview-actions { margin-inline-start: auto; display: flex; gap: 2px; }

/* context menu */
.k-cm2-ctx {
    position: fixed; z-index: 20000; min-width: 190px;
    background: var(--k-bg); border: 1px solid var(--k-border);
    border-radius: 10px; padding: 4px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}
.k-cm2-ctx-item {
    display: flex; align-items: center; gap: 8px; width: 100%;
    padding: 7px 10px; border: none; border-radius: 6px;
    background: transparent; color: var(--k-text-primary);
    font: inherit; font-size: 0.78rem; text-align: start; cursor: pointer;
}
.k-cm2-ctx-item:hover:not(:disabled) { background: var(--k-surface-hover); }
.k-cm2-ctx-item:disabled { opacity: 0.4; cursor: not-allowed; }
.k-cm2-ctx-item.is-danger { color: var(--k-error, #ef4444); }
.k-cm2-ctx-divider { height: 1px; background: var(--k-border); margin: 4px 6px; }
</style>
