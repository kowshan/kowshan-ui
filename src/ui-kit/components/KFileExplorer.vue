<!-- KFileExplorer — general file manager: recursive tree + grid + preview.
     Every create/rename/delete happens via right-click on the target node,
     or from the content toolbar (acts on the OPEN folder). -->
<template>
    <div class="k-fe">
        <div class="k-fe-sidebar">
            <div class="k-fe-sidebar-head">
                <span class="k-fe-sidebar-title">پوشه‌ها</span>
                <button type="button" class="k-fe-add-btn" title="پوشه جدید در ریشه" @click="startCreate(null, 'folder')">
                    <Plus :size="14" />
                </button>
            </div>
            <div class="k-fe-tree">
                <template v-for="row in treeRows" :key="row.node.id">
                    <div
                        class="k-fe-tree-item"
                        :class="{ 'is-active': activeId === row.node.id, 'is-expanded': expanded.has(row.node.id) }"
                        :style="{ paddingInlineStart: 14 + row.depth * 16 + 'px' }"
                        @click="row.node.isFolder ? openFolder(row.node) : selectFile(row.node)"
                    >
                        <template v-if="row.node.isFolder">
                            <ChevronRight
                                v-if="row.node.children?.length"
                                :size="14"
                                class="k-fe-tree-chevron"
                                :class="{ 'is-open': expanded.has(row.node.id) }"
                                @click.stop="toggle(row.node.id)"
                            />
                            <span v-else class="k-fe-tree-chevron-spacer" />
                            <Folder v-if="!expanded.has(row.node.id)" :size="15" class="k-fe-tree-icon" />
                            <FolderOpen v-else :size="15" class="k-fe-tree-icon is-open" />
                        </template>
                        <component v-else :is="fileIcon(row.node)" :size="15" class="k-fe-tree-icon" />
                        <span class="k-fe-tree-name">{{ row.node.name }}</span>
                        <MoreHorizontal :size="14" class="k-fe-tree-more" @click.stop="row.node.isFolder ? folderMenu($event, row.node) : fileMenu($event, row.node)" />
                    </div>
                </template>
            </div>
        </div>

        <div class="k-fe-main">
            <div class="k-fe-toolbar">
                <div class="k-fe-breadcrumb">
                    <span
                        v-for="(crumb, i) in breadcrumbs"
                        :key="i"
                        class="k-fe-crumb"
                        :class="{ 'is-link': crumb.id }"
                        @click="crumb.id && openFolderById(crumb.id)"
                    >{{ crumb.name }}</span>
                </div>
                <div class="k-fe-actions">
                    <button type="button" class="k-fe-tool-btn" title="پوشه جدید" @click="startCreate(openCtxTarget, 'folder')">
                        <FolderPlus :size="14" />
                    </button>
                    <button type="button" class="k-fe-tool-btn" title="فایل جدید" @click="startCreate(openCtxTarget, 'file')">
                        <FilePlus :size="14" />
                    </button>
                    <button type="button" class="k-fe-tool-btn is-danger" title="حذف" :disabled="!selected" @click="removeSelected">
                        <Trash2 :size="14" />
                    </button>
                </div>
            </div>

            <div class="k-fe-grid" @contextmenu.prevent="gridMenu">
                <div
                    v-for="item in openItems"
                    :key="item.id"
                    class="k-fe-file"
                    :class="{ 'is-selected': selected?.id === item.id }"
                    @click="item.isFolder ? openFolder(item) : selectFile(item)"
                    @dblclick="!item.isFolder && startRename(item)"
                    @contextmenu.prevent.stop="item.isFolder ? gridFolderMenu($event, item) : fileMenu($event, item)"
                >
                    <div class="k-fe-file-icon" :class="{ 'is-folder': item.isFolder }">
                        <component :is="item.isFolder ? folderIcon(item) : fileIcon(item)" :size="28" />
                    </div>
                    <input
                        v-if="renaming === item.id"
                        v-model="newName"
                        class="k-fe-inline-input"
                        @keydown.enter="confirmRename"
                        @keydown.esc="renaming = ''"
                        @blur="confirmRename"
                    />
                    <template v-else>
                        <span class="k-fe-file-name">{{ item.name }}</span>
                        <span v-if="item.size" class="k-fe-file-size">{{ item.size }}</span>
                    </template>
                </div>
                <div v-if="creating" class="k-fe-file is-creating">
                    <div class="k-fe-file-icon" :class="{ 'is-folder': createKind === 'folder' }">
                        <component :is="createKind === 'folder' ? Folder : File" :size="28" />
                    </div>
                    <input
                        ref="inputEl"
                        v-model="newName"
                        class="k-fe-inline-input"
                        :placeholder="createKind === 'folder' ? 'نام پوشه' : 'نام فایل'"
                        @keydown.enter="confirmCreate"
                        @keydown.esc="creating = false"
                        @blur="confirmCreate"
                    />
                </div>
                <div v-if="!openItems.length && !creating" class="k-fe-empty">
                    <FolderOpen :size="32" />
                    <span>پوشه خالی</span>
                    <span class="k-fe-empty-hint">راست‌کلیک یا دکمه‌های بالا برای افزودن</span>
                </div>
            </div>

            <div v-if="selected && !selected.isFolder" class="k-fe-preview">
                <div class="k-fe-preview-header">
                    <component :is="fileIcon(selected)" :size="20" />
                    <span>{{ selected.name }}</span>
                    <span class="k-fe-preview-actions">
                        <button type="button" class="k-fe-tool-btn" title="تغییر نام" @click="startRename(selected)"><Pencil :size="13" /></button>
                        <button type="button" class="k-fe-tool-btn is-danger" title="حذف" @click="removeItem(selected)"><Trash2 :size="13" /></button>
                    </span>
                </div>
                <div class="k-fe-preview-body">
                    <div v-if="selected.preview" class="k-fe-preview-img">
                        <img :src="selected.preview" :alt="selected.name" />
                    </div>
                    <div class="k-fe-preview-meta">
                        <div><strong>نام:</strong> {{ selected.name }}</div>
                        <div v-if="selected.size"><strong>اندازه:</strong> {{ selected.size }}</div>
                        <div v-if="selected.type"><strong>نوع:</strong> {{ selected.type }}</div>
                        <div v-if="selected.modified"><strong>تغییر:</strong> {{ selected.modified }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- inline create input (rendered under the open folder in the sidebar OR in grid) -->
        <Teleport to="#k-teleport-hub">
            <div
                v-if="menu.open"
                class="k-ui k-ctx-menu k-fe-ctx"
                :data-theme="theme"
                :style="{ top: menu.y + 'px', left: menu.x + 'px' }"
                @contextmenu.prevent
            >
                <template v-for="(item, i) in menuEntries" :key="i">
                    <div v-if="item === 'divider'" class="k-fe-ctx-divider" />
                    <button
                        v-else
                        type="button"
                        class="k-fe-ctx-item"
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
    ChevronRight, Folder, FolderOpen, File, FileText,
    Image, Film, Music, Archive, Code, FileJson,
    Plus, FolderPlus, FilePlus, Trash2, Pencil, MoreHorizontal,
} from 'lucide-vue-next'
import { useKitTheme } from '../composables/useKitTheme'
import { useKContextMenu } from '../composables/useKContextMenu'
import { findNode, removeNode, flattenFiles, uid, type TreeNode } from '../utils/tree'

export type FileItem = TreeNode

const props = withDefaults(defineProps<{
    folders: FileItem[]
    /** max nesting depth (0 = unlimited) */
    maxDepth?: number
}>(), { folders: () => [], maxDepth: 0 })

const emit = defineEmits<{
    'select': [item: FileItem]
    'open': [item: FileItem]
    'crud': [action: 'create' | 'rename' | 'delete', item: FileItem, tree: FileItem[]]
}>()

const theme = useKitTheme()
const { ctx: menu, entries: menuEntries, openCtx } = useKContextMenu('.k-fe-ctx')

const tree = ref<FileItem[]>(JSON.parse(JSON.stringify(props.folders)))
const activeId = ref('')
const expanded = ref(new Set<string>())
const selected = ref<FileItem | null>(null)
const creating = ref(false)
const createKind = ref<'folder' | 'file'>('folder')
const createParentId = ref('')
const renaming = ref('')
const newName = ref('')
const inputEl = ref<HTMLInputElement | null>(null)

/* ── views ── */
const openCtxTarget = computed<FileItem | null>(() => findNode(tree.value, activeId.value))

/** flattened, depth-aware rows of the expanded tree (folders AND files) */
const treeRows = computed(() => {
    const rows: { node: FileItem; depth: number }[] = []
    const walk = (items: FileItem[], depth: number) => {
        for (const n of items) {
            rows.push({ node: n, depth })
            if (n.children?.length && expanded.value.has(n.id)) walk(n.children, depth + 1)
        }
    }
    walk(tree.value, 0)
    return rows
})

const openItems = computed(() => openCtxTarget.value?.children || [])
const breadcrumbs = computed(() => {
    const crumbs: { name: string; id?: string }[] = [{ name: 'خانه' }]
    if (!activeId.value) return crumbs
    const path: { name: string; id?: string }[] = []
    const walk = (items: FileItem[], target: string, acc: { name: string; id?: string }[]): boolean => {
        for (const item of items) {
            if (item.id === target) { acc.push({ name: item.name, id: item.id }); return true }
            if (item.children && walk(item.children, target, [...acc, { name: item.name, id: item.id }])) return true
        }
        return false
    }
    walk(tree.value, activeId.value, path)
    return [...crumbs, ...path]
})

/* ── navigation ── */
const openFolder = (f: FileItem) => {
    activeId.value = f.id
    selected.value = null
    if (f.children?.length) expanded.value = new Set([...expanded.value, f.id])
}
const openFolderById = (id: string) => {
    const f = findNode(tree.value, id)
    if (f) openFolder(f)
}
const toggle = (id: string) => {
    const s = new Set(expanded.value)
    s.has(id) ? s.delete(id) : s.add(id)
    expanded.value = s
}
const selectFile = (f: FileItem) => { selected.value = f; activeId.value = f.id; emit('select', f) }

/* ── CRUD ── */
const startCreate = (parent: FileItem | null, kind: 'folder' | 'file') => {
    createKind.value = kind
    createParentId.value = parent?.id || ''
    newName.value = ''
    creating.value = true
    if (parent) expanded.value = new Set([...expanded.value, parent.id])
    activeId.value = parent?.id || ''
    nextTick(() => inputEl.value?.focus())
}

const confirmCreate = () => {
    if (!creating.value) return
    creating.value = false
    const name = newName.value.trim()
    if (!name) return
    const parent = createParentId.value ? findNode(tree.value, createParentId.value) : null
    const node: FileItem = createKind.value === 'folder'
        ? { id: uid(), name, isFolder: true, children: [], parentId: parent?.id }
        : { id: uid(), name, size: '۰ KB', modified: 'همین حالا', parentId: parent?.id }
    if (parent) {
        parent.children = parent.children || []
        parent.children.push(node)
        expanded.value = new Set([...expanded.value, parent.id])
    } else {
        tree.value.push(node)
    }
    if (!node.isFolder) selected.value = node
    emit('crud', 'create', node, tree.value)
}

const startRename = (f: FileItem) => {
    renaming.value = f.id
    newName.value = f.name
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

const removeItem = (f: FileItem) => {
    removeNode(tree.value, f.id)
    if (selected.value?.id === f.id) selected.value = null
    if (activeId.value === f.id) activeId.value = ''
    emit('crud', 'delete', f, tree.value)
}
const removeSelected = () => { if (selected.value) removeItem(selected.value) }

/* ── icons ── */
const folderIcon = (f: FileItem) => f.children?.some(c => c.isFolder) ? FolderOpen : Folder
const fileIcon = (f: FileItem) => {
    const ext = f.name.split('.').pop()?.toLowerCase() || ''
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
const fileMenu = (e: MouseEvent, f: FileItem) => {
    selectFile(f)
    openCtx(e, [
        { label: 'تغییر نام', icon: Pencil, run: () => startRename(f) },
        'divider',
        { label: 'حذف', icon: Trash2, danger: true, run: () => removeItem(f) },
    ])
}
const folderMenu = (e: MouseEvent, f: FileItem) => {
    openFolder(f)
    openCtx(e, [
        { label: 'باز کردن', icon: FolderOpen, run: () => openFolder(f) },
        { label: 'تغییر نام', icon: Pencil, run: () => startRename(f) },
        { label: 'پوشه جدید داخل آن', icon: FolderPlus, run: () => startCreate(f, 'folder') },
        { label: 'فایل جدید داخل آن', icon: FilePlus, run: () => startCreate(f, 'file') },
        'divider',
        { label: 'حذف پوشه', icon: Trash2, danger: true, run: () => removeItem(f) },
    ])
}
const gridFolderMenu = (e: MouseEvent, f: FileItem) => folderMenu(e, f)
const gridMenu = (e: MouseEvent) => {
    openCtx(e, [
        { label: 'پوشه جدید', icon: FolderPlus, run: () => startCreate(openCtxTarget.value, 'folder') },
        { label: 'فایل جدید', icon: FilePlus, run: () => startCreate(openCtxTarget.value, 'file') },
    ])
}

defineExpose({ confirmCreate, confirmRename })
</script>

<style scoped>
.k-fe { display: flex; border: 1px solid var(--k-border); border-radius: var(--k-radius-sm); overflow: hidden; height: 440px; font-size: 0.82rem; position: relative; }

.k-fe-sidebar {
    width: 230px; border-left: 1px solid var(--k-border); background: var(--k-surface);
    display: flex; flex-direction: column; overflow-y: auto;
}
.k-fe-sidebar-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 10px 8px 14px; border-bottom: 1px solid var(--k-border);
}
.k-fe-sidebar-title { font-weight: 700; font-size: 0.72rem; color: var(--k-text-muted); }
.k-fe-add-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 22px; height: 22px; border: none; border-radius: 6px;
    background: transparent; color: var(--k-text-muted); cursor: pointer;
}
.k-fe-add-btn:hover { background: var(--k-surface-hover); color: var(--k-primary); }

.k-fe-tree { padding-bottom: 8px; }
.k-fe-tree-item {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 14px; padding-inline-start: 14px; cursor: pointer; color: var(--k-text-primary);
    transition: background 0.1s;
}
.k-fe-tree-item:hover { background: var(--k-surface-hover); }
.k-fe-tree-item.is-active { background: var(--k-primary-light); color: var(--k-primary); font-weight: 600; }
.k-fe-tree-chevron { transition: transform 0.15s; color: var(--k-text-muted); flex-shrink: 0; }
.k-fe-tree-chevron.is-open { transform: rotate(90deg); }
.k-fe-tree-chevron-spacer { width: 14px; flex-shrink: 0; }
.k-fe-tree-icon { color: var(--k-text-muted); flex-shrink: 0; }
.k-fe-tree-icon.is-open { color: var(--k-primary); }
.k-fe-tree-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.k-fe-tree-more { color: var(--k-text-muted); opacity: 0; flex-shrink: 0; border-radius: 4px; }
.k-fe-tree-item:hover .k-fe-tree-more { opacity: 1; }
.k-fe-tree-more:hover { color: var(--k-primary); }

.k-fe-inline-input {
    width: 100%; min-width: 0; border: 1px solid var(--k-primary); border-radius: 5px;
    background: var(--k-bg); color: var(--k-text-primary);
    font: inherit; font-size: 0.75rem; padding: 2px 6px; outline: none;
    box-sizing: border-box;
}
.k-fe-file.is-creating { cursor: default; }

.k-fe-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

.k-fe-toolbar {
    display: flex; align-items: center; justify-content: space-between; gap: 8px;
    padding: 6px 14px; border-bottom: 1px solid var(--k-border);
}
.k-fe-breadcrumb { display: flex; gap: 4px; font-size: 0.72rem; color: var(--k-text-muted); flex-wrap: wrap; min-width: 0; }
.k-fe-crumb:not(:last-child)::after { content: ' / '; margin: 0 2px; }
.k-fe-crumb.is-link { cursor: pointer; }
.k-fe-crumb.is-link:hover { color: var(--k-primary); }
.k-fe-actions { display: flex; gap: 4px; flex-shrink: 0; }
.k-fe-tool-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 26px; height: 26px; border: none; border-radius: 6px;
    background: transparent; color: var(--k-text-secondary); cursor: pointer;
    transition: background 0.12s, color 0.12s;
}
.k-fe-tool-btn:hover:not(:disabled) { background: var(--k-surface-hover); color: var(--k-primary); }
.k-fe-tool-btn.is-danger:hover:not(:disabled) { color: var(--k-error, #ef4444); }
.k-fe-tool-btn:disabled { opacity: 0.35; cursor: not-allowed; }

.k-fe-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 8px; padding: 14px; flex: 1; overflow-y: auto; align-content: start;
}
.k-fe-file {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    padding: 10px 4px; border-radius: 8px; cursor: pointer; text-align: center;
    transition: background 0.1s;
}
.k-fe-file:hover { background: var(--k-surface-hover); }
.k-fe-file.is-selected { background: var(--k-primary-light); }
.k-fe-file-icon { color: var(--k-text-muted); }
.k-fe-file-icon.is-folder { color: var(--k-warning, #f59e0b); }
.k-fe-file.is-selected .k-fe-file-icon { color: var(--k-primary); }
.k-fe-file-name { font-size: 0.7rem; color: var(--k-text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }
.k-fe-file-size { font-size: 0.62rem; color: var(--k-text-muted); }

.k-fe-empty { grid-column: 1/-1; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 40px; color: var(--k-text-muted); }
.k-fe-empty-hint { font-size: 0.7rem; opacity: 0.7; }

.k-fe-preview { border-top: 1px solid var(--k-border); padding: 14px; background: var(--k-surface); }
.k-fe-preview-header { display: flex; align-items: center; gap: 8px; font-weight: 700; margin-bottom: 10px; color: var(--k-text-primary); }
.k-fe-preview-actions { margin-inline-start: auto; display: flex; gap: 2px; }
.k-fe-preview-body { display: flex; gap: 14px; }
.k-fe-preview-img { width: 120px; height: 90px; border-radius: 6px; overflow: hidden; flex-shrink: 0; }
.k-fe-preview-img img { width: 100%; height: 100%; object-fit: cover; }
.k-fe-preview-meta { font-size: 0.75rem; color: var(--k-text-secondary); display: flex; flex-direction: column; gap: 4px; }
.k-fe-preview-meta strong { color: var(--k-text-primary); }

.k-fe-ctx {
    position: fixed; z-index: 20000; min-width: 180px;
    background: var(--k-bg); border: 1px solid var(--k-border);
    border-radius: 10px; padding: 4px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}
.k-fe-ctx-item {
    display: flex; align-items: center; gap: 8px; width: 100%;
    padding: 7px 10px; border: none; border-radius: 6px;
    background: transparent; color: var(--k-text-primary);
    font: inherit; font-size: 0.78rem; text-align: start; cursor: pointer;
}
.k-fe-ctx-item:hover { background: var(--k-surface-hover); }
.k-fe-ctx-item.is-danger { color: var(--k-error, #ef4444); }
.k-fe-ctx-divider { height: 1px; background: var(--k-border); margin: 4px 6px; }
</style>
