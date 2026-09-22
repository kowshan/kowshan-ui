<!-- KBookmarkBar — saved links with folders -->
<template>
    <div class="k-bm-bar">
        <div class="k-bm-items">
            <div
                v-for="(item, i) in bookmarks"
                :key="item.id"
                class="k-bm-item"
                :class="{ 'is-folder': item.isFolder, 'is-expanded': expandedFolders.has(item.id) }"
            >
                <!-- Folder -->
                <template v-if="item.isFolder">
                    <button
                        type="button"
                        class="k-bm-btn k-bm-folder"
                        @click="toggleFolder(item.id)"
                    >
                        <FolderOpen v-if="expandedFolders.has(item.id)" :size="14" />
                        <Folder v-else :size="14" />
                        <span class="k-bm-name">{{ item.name }}</span>
                    </button>
                    <!-- Folder Dropdown -->
                    <div v-if="expandedFolders.has(item.id)" class="k-bm-dropdown">
                        <div
                            v-for="child in item.children"
                            :key="child.id"
                            class="k-bm-dropdown-item"
                            @click="openBookmark(child)"
                        >
                            <Globe :size="13" />
                            <span>{{ child.name }}</span>
                        </div>
                    </div>
                </template>

                <!-- Link -->
                <template v-else>
                    <button
                        type="button"
                        class="k-bm-btn k-bm-link"
                        :title="item.url"
                        @click="openBookmark(item)"
                    >
                        <Globe :size="13" />
                        <span class="k-bm-name">{{ item.name }}</span>
                    </button>
                </template>
            </div>

            <!-- Add Button -->
            <button type="button" class="k-bm-add" @click="showAdd = !showAdd">
                <Plus :size="14" />
            </button>
        </div>

        <!-- Add Form -->
        <div v-if="showAdd" class="k-bm-add-form">
            <input v-model="newName" placeholder="نام" class="k-bm-input" />
            <input v-model="newUrl" placeholder="آدرس" class="k-bm-input" />
            <button type="button" class="k-bm-add-btn" @click="addBookmark">
                <Check :size="14" /> افزودن
            </button>
            <button type="button" class="k-bm-cancel-btn" @click="cancelAdd">
                <X :size="14" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Folder, FolderOpen, Globe, Plus, Check, X } from 'lucide-vue-next'

export interface BookmarkItem {
    id: string
    name: string
    url?: string
    icon?: string
    isFolder?: boolean
    children?: BookmarkItem[]
}

const props = withDefaults(defineProps<{
    bookmarks?: BookmarkItem[]
}>(), {
    bookmarks: () => []
})

const emit = defineEmits<{
    'open': [item: BookmarkItem]
    'add': [name: string, url: string]
    'remove': [id: string]
}>()

const expandedFolders = ref(new Set<string>())
const showAdd = ref(false)
const newName = ref('')
const newUrl = ref('')

const toggleFolder = (id: string) => {
    const s = new Set(expandedFolders.value)
    s.has(id) ? s.delete(id) : s.add(id)
    expandedFolders.value = s
}

const openBookmark = (item: BookmarkItem) => {
    if (item.url) window.open(item.url, '_blank')
    emit('open', item)
}

const addBookmark = () => {
    if (newName.value && newUrl.value) {
        emit('add', newName.value, newUrl.value)
        newName.value = ''
        newUrl.value = ''
        showAdd.value = false
    }
}

const cancelAdd = () => {
    newName.value = ''
    newUrl.value = ''
    showAdd.value = false
}
</script>

<style scoped>
.k-bm-bar {
    width: 100%; background: var(--k-surface); border: 1px solid var(--k-border);
    border-radius: var(--k-radius-sm); overflow: visible;
}

.k-bm-items {
    display: flex; align-items: center; gap: 0; padding: 4px 8px;
    overflow-x: auto; scrollbar-width: none; min-height: 36px;
}
.k-bm-items::-webkit-scrollbar { display: none; }

.k-bm-item { position: relative; flex-shrink: 0; }

.k-bm-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 10px; border: none; background: transparent;
    border-radius: 6px; font-size: 0.72rem; font-family: inherit;
    font-weight: 500; color: var(--k-text-primary); cursor: pointer;
    transition: background 0.1s; white-space: nowrap;
}
.k-bm-btn:hover { background: var(--k-surface-hover); }
.k-bm-folder { color: var(--k-text-secondary); }

.k-bm-dropdown {
    position: absolute; top: 100%; inset-inline-start: 0; z-index: 20000;
    background: var(--k-bg); border: 1px solid var(--k-border);
    border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    min-width: 180px; padding: 4px; margin-top: 2px;
}
.k-bm-dropdown-item {
    display: flex; align-items: center; gap: 6px; padding: 6px 10px;
    border-radius: 6px; font-size: 0.75rem; color: var(--k-text-primary);
    cursor: pointer; transition: background 0.1s;
}
.k-bm-dropdown-item:hover { background: var(--k-primary-light); }

.k-bm-add {
    flex-shrink: 0; width: 28px; height: 28px; border: 1px dashed var(--k-border);
    border-radius: 6px; background: transparent; color: var(--k-text-muted);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
}
.k-bm-add:hover { border-color: var(--k-primary); color: var(--k-primary); background: var(--k-primary-light); }

.k-bm-add-form {
    display: flex; gap: 6px; padding: 8px; border-top: 1px solid var(--k-border);
}
.k-bm-input {
    flex: 1; padding: 5px 8px; border: 1px solid var(--k-border); border-radius: 6px;
    font-size: 0.75rem; font-family: inherit; color: var(--k-text-primary);
    background: var(--k-bg); outline: none;
}
.k-bm-input:focus { border-color: var(--k-primary); }
.k-bm-add-btn {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 5px 10px; border: none; border-radius: 6px;
    background: var(--k-primary); color: #fff;
    font-size: 0.72rem; font-weight: 600; font-family: inherit;
    cursor: pointer;
}
.k-bm-cancel-btn {
    display: flex; align-items: center; justify-content: center;
    width: 28px; height: 28px; border: 1px solid var(--k-border); border-radius: 6px;
    background: transparent; color: var(--k-text-muted); cursor: pointer;
    transition: all 0.15s;
}
.k-bm-cancel-btn:hover { border-color: var(--k-error); color: var(--k-error); }
</style>
