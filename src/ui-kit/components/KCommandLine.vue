<!-- KCommandLine — terminal emulator UI, arch-style dark theme -->
<template>
    <div class="k-cli" :class="size">
        <!-- Title Bar -->
        <div class="k-cli-titlebar">
            <div class="k-cli-dots">
                <span class="k-cli-dot k-cli-dot-red" />
                <span class="k-cli-dot k-cli-dot-yellow" />
                <span class="k-cli-dot k-cli-dot-green" />
            </div>
            <span class="k-cli-title">{{ title }}</span>
            <button type="button" class="k-cli-clear" @click="clear" title="پاک کردن">
                <Trash2 :size="12" />
            </button>
        </div>

        <!-- Terminal Body -->
        <div class="k-cli-body" ref="bodyRef" @click="focusInput">
            <!-- Output Lines -->
            <div
                v-for="(line, i) in displayLines"
                :key="i"
                class="k-cli-line"
                :class="line.type"
            >
                <span v-if="line.type === 'input'" class="k-cli-prompt">
                    <span class="k-cli-user">{{ promptUser }}</span>@<span class="k-cli-host">{{ promptHost }}</span>:<span class="k-cli-path">{{ promptPath }}</span>$
                </span>
                <span v-if="line.type === 'input'" class="k-cli-text">{{ line.text }}</span>
                <!-- `line.html` comes from the command that produced it, so it is
                     sanitized; plain text is interpolated, never parsed -->
                <span v-else-if="line.html" class="k-cli-text" v-html="sanitizeHtml(line.html)" />
                <span v-else class="k-cli-text">{{ line.text }}</span>
            </div>

            <!-- Current Input -->
            <div class="k-cli-line k-cli-input-line" v-if="!disabled">
                <span class="k-cli-prompt">
                    <span class="k-cli-user">{{ promptUser }}</span>@<span class="k-cli-host">{{ promptHost }}</span>:<span class="k-cli-path">{{ promptPath }}</span>$
                </span>
                <input
                    ref="inputRef"
                    v-model="input"
                    type="text"
                    class="k-cli-input"
                    :disabled="disabled"
                    @keydown="handleKeydown"
                    autocomplete="off"
                    spellcheck="false"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, computed } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import { sanitizeHtml } from '../utils/html'

export interface CLILine {
    text: string
    html?: string
    type: 'input' | 'output' | 'error' | 'success' | 'system'
}

const props = withDefaults(defineProps<{
    title?: string
    promptUser?: string
    promptHost?: string
    promptPath?: string
    initialLines?: CLILine[]
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    commands?: Record<string, (args: string) => string | CLILine[]>
}>(), {
    title: 'Terminal',
    promptUser: 'user',
    promptHost: 'localhost',
    promptPath: '~',
    initialLines: () => [
        { text: 'Welcome to K-CLI terminal emulator.', type: 'system' },
        { text: 'Type "help" for available commands.', type: 'system' }
    ],
    size: 'md',
    commands: () => ({})
})

const emit = defineEmits<{
    'command': [cmd: string]
    'clear': []
}>()

const bodyRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const input = ref('')
const history = ref<string[]>([])
const historyIndex = ref(-1)

const displayLines = ref<CLILine[]>([...props.initialLines])

const builtInCommands: Record<string, (args: string) => CLILine[]> = {
    help: () => [
        { text: 'دستورات موجود:', type: 'success' },
        { text: '  help     — نمایش این راهنما', type: 'output' },
        { text: '  clear    — پاک کردن صفحه', type: 'output' },
        { text: '  echo     — نمایش متن', type: 'output' },
        { text: '  date     — نمایش تاریخ', type: 'output' },
        { text: '  whoami   — نمایش کاربر', type: 'output' },
        { text: '  uname    — نمایش سیستم‌عامل', type: 'output' },
        { text: '  ls       — لیست فایل‌ها', type: 'output' },
        { text: '  neofetch — اطلاعات سیستم', type: 'output' },
    ],
    clear: () => [],
    echo: (args) => [{ text: args, type: 'output' }],
    date: () => [{ text: new Date().toLocaleString('fa-IR'), type: 'output' }],
    whoami: () => [{ text: props.promptUser, type: 'output' }],
    uname: () => [{ text: 'K-CLI v1.0.0 (Vue 3 + TypeScript)', type: 'output' }],
    ls: () => [
        { text: 'node_modules/  src/  dist/  package.json  tsconfig.json  vite.config.ts', type: 'output' }
    ],
    neofetch: () => [
        { text: '        .--.        ', html: '<span style="color:var(--k-primary)">        .--.        </span>', type: 'output' },
        { text: '       |o_o |       ', html: '<span style="color:var(--k-primary)">       |o_o |       </span>', type: 'output' },
        { text: '       |:_/ |       ', html: '<span style="color:var(--k-primary)">       |:_/ |       </span>', type: 'output' },
        { text: '      //   \\ \\      ', html: '<span style="color:var(--k-primary)">      //   \\ \\      </span>', type: 'output' },
        { text: '     (|     | )     ', html: '<span style="color:var(--k-primary)">     (|     | )     </span>', type: 'output' },
        { text: "    /'\\_   _/`\\     ", html: "<span style=\"color:var(--k-primary)\">    /'\\_   _/`\\     </span>", type: 'output' },
        { text: "    \\___)=(___/     ", html: "<span style=\"color:var(--k-primary)\">    \\___)=(___/     </span>", type: 'output' },
        { text: '', type: 'output' },
        { text: `OS: K-Kit UI Framework\nShell: K-CLI\nTheme: ${document?.querySelector('[data-theme]')?.getAttribute('data-theme') || 'light'}`, type: 'output' },
    ],
}

const scrollToBottom = () => {
    nextTick(() => {
        if (bodyRef.value) bodyRef.value.scrollTop = bodyRef.value.scrollHeight
    })
}

const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && input.value.trim()) {
        const cmd = input.value.trim()
        history.value.push(cmd)
        historyIndex.value = history.value.length

        displayLines.value.push({ text: cmd, type: 'input' })

        const parts = cmd.split(' ')
        const command = parts[0]
        const args = parts.slice(1).join(' ')

        // Check user commands first
        let result: CLILine[] | null = null
        if (props.commands[command]) {
            const r = props.commands[command](args)
            if (Array.isArray(r)) result = r
            else result = [{ text: r, type: 'output' }]
        } else if (builtInCommands[command]) {
            result = builtInCommands[command](args)
        } else {
            result = [{ text: `bash: ${command}: دستور یافت نشد`, type: 'error' }]
        }

        if (command === 'clear') {
            displayLines.value = []
        } else if (result) {
            displayLines.value.push(...result)
        }

        emit('command', cmd)
        input.value = ''
        scrollToBottom()
    } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (historyIndex.value > 0) {
            historyIndex.value--
            input.value = history.value[historyIndex.value]
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (historyIndex.value < history.value.length - 1) {
            historyIndex.value++
            input.value = history.value[historyIndex.value]
        } else {
            historyIndex.value = history.value.length
            input.value = ''
        }
    } else if (e.key === 'Tab') {
        e.preventDefault()
        // Simple autocomplete
        const partial = input.value.toLowerCase()
        const allCmds = [...Object.keys(builtInCommands), ...Object.keys(props.commands)]
        const match = allCmds.find(c => c.startsWith(partial))
        if (match) input.value = match
    } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault()
        clear()
    }
}

const clear = () => {
    displayLines.value = []
    emit('clear')
}

const focusInput = () => inputRef.value?.focus()

const scrollTo = scrollToBottom
defineExpose({ clear, scrollTo, displayLines, input: input })
</script>

<style scoped>
.k-cli {
    direction: ltr;
    border-radius: 10px; overflow: hidden;
    font-family: 'Cascadia Code', 'Fira Code', ui-monospace, monospace;
    border: 1px solid #2a2a3a;
}

.k-cli.sm { font-size: 0.72rem; }
.k-cli.md { font-size: 0.78rem; }
.k-cli.lg { font-size: 0.85rem; }

.k-cli-titlebar {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 12px; background: #1a1a2e;
    border-bottom: 1px solid #2a2a3a;
}

.k-cli-dots { display: flex; gap: 6px; }
.k-cli-dot { width: 10px; height: 10px; border-radius: 50%; }
.k-cli-dot-red { background: #ff5f57; }
.k-cli-dot-yellow { background: #ffbd2e; }
.k-cli-dot-green { background: #28c840; }

.k-cli-title {
    flex: 1; text-align: center; font-size: 0.72rem;
    color: #6c7086; font-family: inherit;
}

.k-cli-clear {
    border: none; background: transparent; color: #6c7086;
    cursor: pointer; padding: 4px; border-radius: 4px;
    display: flex; align-items: center;
}
.k-cli-clear:hover { background: rgba(255,255,255,0.08); color: #cdd6f4; }

.k-cli-body {
    background: #11111b; color: #cdd6f4; padding: 12px 14px;
    min-height: 200px; max-height: 400px; overflow-y: auto;
    line-height: 1.7;
}
.k-cli-body::-webkit-scrollbar { width: 6px; }
.k-cli-body::-webkit-scrollbar-track { background: transparent; }
.k-cli-body::-webkit-scrollbar-thumb { background: #45475a; border-radius: 3px; }

.k-cli-line { display: flex; gap: 0; white-space: pre-wrap; word-break: break-all; }

.k-cli-prompt { flex-shrink: 0; margin-inline-end: 8px; }
.k-cli-user { color: #a6e3a1; }
.k-cli-host { color: #89b4fa; }
.k-cli-path { color: #f9e2af; }

.k-cli-line.input .k-cli-text { color: #cdd6f4; }
.k-cli-line.output .k-cli-text { color: #bac2de; }
.k-cli-line.error .k-cli-text { color: #f38ba8; }
.k-cli-line.success .k-cli-text { color: #a6e3a1; }
.k-cli-line.system .k-cli-text { color: #6c7086; font-style: italic; }

.k-cli-input-line { display: flex; align-items: center; }
.k-cli-input {
    flex: 1; border: none; outline: none; background: transparent;
    color: #cdd6f4; font-family: inherit; font-size: inherit;
    caret-color: #f5e0dc;
}
</style>
