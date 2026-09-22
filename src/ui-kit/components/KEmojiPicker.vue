<!-- KEmojiPicker — Telegram-style emoji picker with categories and search -->
<template>
    <div class="k-ep" ref="pickerRef">
        <!-- Search -->
        <div class="k-ep-search">
            <Search :size="14" class="k-ep-search-icon" />
            <input
                ref="searchInput"
                v-model="query"
                type="text"
                placeholder="جستجو..."
                class="k-ep-search-input"
            />
        </div>

        <!-- Category Tabs -->
        <div class="k-ep-tabs">
            <button
                v-for="cat in categories"
                :key="cat.id"
                type="button"
                class="k-ep-tab"
                :class="{ 'is-active': activeCategory === cat.id }"
                @click="scrollToCategory(cat.id)"
                :title="cat.name"
            >{{ cat.icon }}</button>
        </div>

        <!-- Emoji Grid -->
        <div class="k-ep-grid" ref="gridRef" @scroll="onScroll">
            <template v-if="query">
                <div class="k-ep-section-title">نتایج جستجو</div>
                <div class="k-ep-items">
                    <button
                        v-for="em in searchResults"
                        :key="em"
                        type="button"
                        class="k-ep-emoji"
                        @click="select(em)"
                        @mouseenter="hoverEmoji = em"
                        @mouseleave="hoverEmoji = ''"
                    >{{ em }}</button>
                </div>
                <div v-if="!searchResults.length" class="k-ep-empty">موردی یافت نشد</div>
            </template>
            <template v-else>
                <div v-for="cat in categories" :key="cat.id" :ref="el => setSectionRef(cat.id, el as HTMLElement)">
                    <div class="k-ep-section-title">{{ cat.name }}</div>
                    <div class="k-ep-items">
                        <button
                            v-for="em in cat.emojis"
                            :key="em"
                            type="button"
                            class="k-ep-emoji"
                            @click="select(em)"
                            @mouseenter="hoverEmoji = em"
                            @mouseleave="hoverEmoji = ''"
                        >{{ em }}</button>
                    </div>
                </div>
            </template>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
    multiple?: boolean
}>(), {
    multiple: false
})

const emit = defineEmits<{
    'select': [emoji: string]
    'done': [emojis: string[]]
}>()

const query = ref('')
const activeCategory = ref('recent')
const hoverEmoji = ref('')
const pickerRef = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const sectionRefs = ref<Record<string, HTMLElement>>({})

const setSectionRef = (id: string, el: HTMLElement | null) => {
    if (el) sectionRefs.value[id] = el
}

const categories = [
    {
        id: 'recent', name: 'اخیراً استفاده شده', icon: '🕐',
        emojis: ['😊', '👍', '❤️', '😂', '🔥', '✅', '🙏', '😍', '🎉', '💯', '👋', '🤔']
    },
    {
        id: 'smileys', name: 'چهره‌ها', icon: '😀',
        emojis: ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','😊','😇','🥰','😍','🤩','😘','😗','😚','😙','🥲','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🫢','🤫','🤔','🫡','🤐','🤨','😐','😑','😶','🫥','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🥵','🥶','🥴','😵','🤯','🤠','🥳','🥸','😎','🤓','🧐','😕','🫤','😟','🙁','☹️','😮','😯','😲','😳','🥺','🥹','😦','😧','😨','😰','😥','😢','😭','😱','😖','😣','😞','😓','😩','😫','🥱','😤','😡','😠','🤬','😈','👿','💀','☠️','💩','🤡','👹','👺','👻','👽','👾','🤖']
    },
    {
        id: 'gestures', name: 'حرکات دست', icon: '👋',
        emojis: ['👋','🤚','🖐️','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','✍️','💪']
    },
    {
        id: 'nature', name: 'طبیعت', icon: '🌿',
        emojis: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🙈','🙉','🙊','🐔','🐧','🐦','🐤','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐜','🐢','🐍','🦎','🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🐊','🐅','🐆','🦓','🦍','🐘','🐪','🐫','🦒','🦘','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🦙','🐐','🦌','🐕','🐩','🐈']
    },
    {
        id: 'food', name: 'غذا', icon: '🍔',
        emojis: ['🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🥦','🥬','🥒','🌶️','🫑','🌽','🥕','🧄','🧅','🥔','🍠','🥐','🍞','🥖','🥨','🧀','🥚','🍳','🥞','🧇','🥓','🥩','🍗','🍖','🌭','🍔','🍟','🍕','🥪','🌮','🌯','🥗','🥘','🍝','🍜','🍲','🍛','🍣','🍱','🥟','🍤','🍙','🍚','🍘','🍥','🍢','🍡','🍧','🍨','🍦','🥧','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍩','🍪','🌰','🥜','🍯','🥛','🍼','☕','🍵','🥤','🍶','🍺','🍻','🥂','🍷','🥃','🍸','🍹','🍾','🧊']
    },
    {
        id: 'objects', name: 'اشیاء', icon: '💡',
        emojis: ['⌚','📱','💻','⌨️','🖥️','🖨️','🖱️','🕹️','📷','📸','📹','🎥','📽️','📞','☎️','📺','📻','🧭','⏱️','⏲️','⏰','⏳','📡','🔋','🔌','💡','🔦','🕯️','💰','🪙','💴','💵','💶','💷','💳','💎','⚖️','🧰','🪛','🔧','🔩','⚙️','⛏️','🛠️','🔨','🔗','🧲','🔫','💣','🧨','🔪','🗡️','⚔️','🛡️','🔮','🔭','🔬','💊','💉','🧬','🧪','🌡️','🧹','🪠','🧺','🚽','🚿','🛁','🔑','🗝️','🚪','🪑','🛋️','🛏️','🧸','📦','🏷️']
    },
    {
        id: 'symbols', name: 'نمادها', icon: '✨',
        emojis: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','☮️','✝️','☪️','🕉️','☸️','✡️','☯️','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','🆔','⚛️','🉑','☢️','☣️','❌','⭕','🛑','⛔','📛','🚫','💯','💢','♨️','❗','❕','❓','❔','‼️','⁉️','🔅','🔆','⚠️','♻️','✅','❇️','✳️','❎','🌐','💠','Ⓜ️','🌀','💤','🏧','🚾','♿','🅿️','♿','🚹','🚺','🚼','🚻','🚮','🎦','📶','ℹ️','🆖','🆗','🆙','🆒','🆕','🆓','0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟','🔢','▶️','⏸️','⏹️','⏩','⏪','🔀','🔁','🔂','🔄','🎵','🎶','➕','➖','➗','✖️','💲','♾️','™️','©️','®️','〰️','✔️','☑️','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🟤','🔺','🔻','🔸','🔹','🔶','🔷','🔳','🔲','♠️','♣️','♥️','♦️','🕐','🕑','🕒','🕓','🕔','🕕','🕖','🕗','🕘','🕙','🕚','🕛']
    }
]

const emojiNames: Record<string, string> = {
    '😀': 'خندان', '😂': 'خنده', '❤️': 'قلب', '👍': 'آفرین', '🔥': 'آتش',
    '✅': 'تأیید', '🙏': 'لطفاً', '😍': 'عاشق', '🎉': 'جشن', '💯': 'صددرصد',
    '👋': 'سلام', '🤔': 'فکر', '😊': 'خجالتی', '🥰': 'مهربان', '😢': 'گریه',
    '😠': 'عصبانی', '💪': 'قدرت', '🌟': 'ستاره', '☕': 'قهوه'
}

const allEmojis = computed(() => categories.flatMap(c => c.emojis))

const searchResults = computed(() => {
    if (!query.value) return []
    const q = query.value.toLowerCase()
    return allEmojis.value.filter(em => {
        const name = emojiNames[em] || ''
        return name.toLowerCase().includes(q) || em.includes(q)
    }).slice(0, 60)
})

const scrollToCategory = (id: string) => {
    activeCategory.value = id
    const el = sectionRefs.value[id]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const onScroll = () => {
    if (!gridRef.value) return
    const scrollTop = gridRef.value.scrollTop
    for (const cat of categories) {
        const el = sectionRefs.value[cat.id]
        if (el && el.offsetTop <= scrollTop + 40) {
            activeCategory.value = cat.id
        }
    }
}

const select = (emoji: string) => {
    emit('select', emoji)
}

onMounted(() => {})
</script>

<style scoped>
.k-ep {
    width: 100%; min-width: 260px; max-width: 320px;
    background: var(--k-bg); border: 1px solid var(--k-border);
    border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    display: flex; flex-direction: column; overflow: hidden;
    font-family: inherit; direction: rtl;
}

.k-ep-search {
    display: flex; align-items: center; gap: 8px; padding: 8px 12px;
    border-bottom: 1px solid var(--k-border);
}
.k-ep-search-icon { color: var(--k-text-muted); flex-shrink: 0; }
.k-ep-search-input {
    flex: 1; border: none; outline: none; background: transparent;
    font-size: 0.82rem; color: var(--k-text-primary); font-family: inherit;
}
.k-ep-search-input::placeholder { color: var(--k-text-muted); }

.k-ep-tabs {
    display: flex; gap: 0; padding: 4px 8px; border-bottom: 1px solid var(--k-border);
    overflow-x: auto; scrollbar-width: none;
}
.k-ep-tabs::-webkit-scrollbar { display: none; }

.k-ep-tab {
    flex-shrink: 0; width: 32px; height: 32px; border: none;
    background: transparent; border-radius: 8px; font-size: 18px;
    cursor: pointer; transition: background 0.1s; padding: 0;
    display: flex; align-items: center; justify-content: center;
}
.k-ep-tab:hover { background: var(--k-surface-hover); }
.k-ep-tab.is-active { background: var(--k-primary-light); }

.k-ep-grid {
    flex: 1; overflow-y: auto; max-height: 280px; padding: 4px 8px;
    scrollbar-width: none;
}
.k-ep-grid::-webkit-scrollbar { width: 0; display: none; }

.k-ep-section-title {
    font-size: 0.7rem; font-weight: 700; color: var(--k-text-muted);
    padding: 8px 4px 4px; position: relative;
}

.k-ep-items {
    display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px;
}

.k-ep-emoji {
    width: 100%; aspect-ratio: 1; border: none; background: transparent;
    border-radius: 6px; font-size: 22px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.1s, transform 0.1s;
}
.k-ep-emoji:hover { background: var(--k-surface-hover); transform: scale(1.15); }

.k-ep-empty { text-align: center; padding: 20px; color: var(--k-text-muted); font-size: 0.78rem; }
</style>
