<!-- KMarkdownRenderer.vue — renders markdown to styled HTML with syntax highlighting -->
<template>
    <div class="k-md" :class="{ 'k-md-compact': compact }" :style="maxHeight ? { maxHeight, overflowY: 'auto' } : undefined" v-html="rendered" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { escapeHtml, safeUrl } from '../utils/html'

const props = withDefaults(defineProps<{
    content: string
    compact?: boolean
    maxHeight?: string
}>(), { compact: false, maxHeight: '' })

// Minimal markdown parser — handles common patterns without dependencies.
//
// The source is escaped BEFORE any transformation: markdown is a text format,
// so raw HTML in it is just text. That makes the output safe by construction —
// the only tags that can exist are the ones added below, and an injected
// `<img onerror=…>` can never become an element. It also means the code-block
// branch needs no escaping of its own.
const rendered = computed(() => {
    let md = escapeHtml(props.content)
    // Code blocks
    md = md.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
        return `<pre class="k-md-pre"><code class="k-md-code lang-${lang || 'text'}">${code}</code></pre>`
    })
    // Inline code
    md = md.replace(/`([^`]+)`/g, '<code class="k-md-inline">$1</code>')
    // Bold + italic
    md = md.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    md = md.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    md = md.replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Strikethrough
    md = md.replace(/~~(.+?)~~/g, '<del>$1</del>')
    // Links — the URL goes through safeUrl(): a `[x](javascript:…)` href runs
    // script on click, so the scheme is allow-listed and attribute-escaped.
    md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) =>
        `<a href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer">${text}</a>`)
    // Images
    md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, url) =>
        `<img src="${safeUrl(url)}" alt="${alt}" class="k-md-img" />`)
    // Headings
    md = md.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>')
    md = md.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>')
    md = md.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
    md = md.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
    md = md.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
    md = md.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')
    // Blockquote
    md = md.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>')
    // Horizontal rule
    md = md.replace(/^---$/gm, '<hr class="k-md-hr" />')
    // Unordered list
    md = md.replace(/^[\-\*]\s+(.+)$/gm, '<li>$1</li>')
    md = md.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Ordered list
    md = md.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    // Task list
    md = md.replace(/\[ \]\s+(.+)/g, '<span class="k-md-task"><span class="k-md-task-box"></span>$1</span>')
    md = md.replace(/\[x\]\s+(.+)/gi, '<span class="k-md-task"><span class="k-md-task-box is-checked">✓</span>$1</span>')
    // Paragraphs — wrap remaining loose text
    md = md.replace(/^(?!<[hupbol]|<li|<hr|<pre|<blockquote|<img)(.+)$/gm, '<p>$1</p>')
    // Tables
    md = md.replace(/^\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)+)/gm, (_, header, body) => {
        const ths = header.split('|').filter(Boolean).map((h: string) => `<th>${h.trim()}</th>`).join('')
        const rows = body.trim().split('\n').map((row: string) => {
            const tds = row.split('|').filter(Boolean).map((d: string) => `<td>${d.trim()}</td>`).join('')
            return `<tr>${tds}</tr>`
        }).join('')
        return `<table class="k-md-table"><thead><tr>${ths}</tr></thead><tbody>${rows}</tbody></table>`
    })
    return md
})
</script>

<style>
/* Unscoped — renders dynamic HTML */
.k-md {
    font-size: 0.82rem;
    line-height: 1.8;
    color: var(--k-text-primary);
}
.k-md h1 { font-size: 1.3rem; font-weight: 900; margin: 0 0 12px; }
.k-md h2 { font-size: 1.1rem; font-weight: 800; margin: 20px 0 8px; }
.k-md h3 { font-size: 0.95rem; font-weight: 800; margin: 16px 0 6px; }
.k-md h4 { font-size: 0.88rem; font-weight: 700; margin: 14px 0 4px; }
.k-md p { margin: 0 0 10px; }
.k-md a { color: var(--k-primary, #1db954); text-decoration: underline; text-underline-offset: 2px; }
.k-md a:hover { opacity: 0.8; }
.k-md strong { font-weight: 800; }
.k-md em { font-style: italic; }
.k-md del { text-decoration: line-through; opacity: 0.6; }
.k-md ul, .k-md ol { padding-inline-start: 20px; margin: 0 0 10px; }
.k-md li { margin-bottom: 4px; }
.k-md blockquote {
    border-inline-start: 3px solid var(--k-primary, #1db954);
    padding: 8px 14px;
    margin: 10px 0;
    background: var(--k-surface-hover, #f1f5f9);
    border-radius: 0 8px 8px 0;
    font-style: italic;
    color: var(--k-text-secondary);
}
.k-md-pre {
    background: #1e293b;
    color: #e2e8f0;
    padding: 14px 16px;
    border-radius: 10px;
    overflow-x: auto;
    font-size: 0.76rem;
    line-height: 1.6;
    margin: 10px 0;
    direction: ltr;
    text-align: left;
}
.k-md-code { font-family: 'SF Mono', 'Fira Code', monospace; }
.k-md-inline {
    background: var(--k-surface-hover, #f1f5f9);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.78em;
    font-family: 'SF Mono', 'Fira Code', monospace;
    direction: ltr;
}
.k-md-hr {
    border: none;
    border-top: 1px dashed var(--k-border, #e2e8f0);
    margin: 20px 0;
}
.k-md-img {
    max-width: 100%;
    border-radius: 10px;
    margin: 10px 0;
}
.k-md-table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0;
    font-size: 0.78rem;
}
.k-md-table th, .k-md-table td {
    padding: 8px 12px;
    border: 1px solid var(--k-border, #e2e8f0);
    text-align: right;
}
.k-md-table th {
    background: var(--k-surface-hover, #f1f5f9);
    font-weight: 700;
}
.k-md-task {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
}
.k-md-task-box {
    width: 16px;
    height: 16px;
    border: 1.5px solid var(--k-border, #cbd5e1);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 0.6rem;
}
.k-md-task-box.is-checked {
    background: var(--k-primary, #1db954);
    border-color: var(--k-primary, #1db954);
    color: #fff;
}
.k-md-compact { font-size: 0.76rem; }
.k-md::-webkit-scrollbar { width: 4px; }
.k-md::-webkit-scrollbar-thumb { background: var(--k-border, #e2e8f0); border-radius: 4px; }
</style>
