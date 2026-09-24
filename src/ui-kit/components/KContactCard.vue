<!-- components/KContactCard.vue -->
<template>
    <div class="k-contact" :class="{ 'is-selected': selected }">
        <!-- Top: avatar + identity -->
        <div class="k-contact-head">
            <KAvatar
                :src="contact.src"
                :name="contact.name"
                :status="contact.status"
                size="lg"
            />
            <div class="k-contact-id">
                <div class="k-contact-name">
                    {{ contact.name }}
                    <span v-if="contact.code" class="k-contact-code">{{ contact.code }}</span>
                </div>
                <div v-if="contact.role" class="k-contact-role">{{ contact.role }}</div>
                <div v-if="contact.company" class="k-contact-company">{{ contact.company }}</div>
            </div>
            <KCheckbox
                v-if="selectable"
                :model-value="selected"
                class="k-contact-select"
                aria-label="انتخاب"
                @update:model-value="emitSelect"
            />
        </div>

        <!-- Contact info -->
        <div v-if="contact.phone || contact.email || contact.address" class="k-contact-info">
            <span v-if="contact.phone" class="k-contact-line" :dir="'ltr'">
                <Phone class="icon" /> {{ contact.phone }}
            </span>
            <span v-if="contact.email" class="k-contact-line" :dir="'ltr'">
                <Mail class="icon" /> {{ contact.email }}
            </span>
            <span v-if="contact.address" class="k-contact-line">
                <MapPin class="icon" /> {{ contact.address }}
            </span>
        </div>

        <!-- Tags -->
        <div v-if="tags.length" class="k-contact-tags">
            <span
                v-for="(t, i) in tags"
                :key="i"
                class="k-contact-tag"
                :class="t.variant ? `is-${t.variant}` : ''"
            >
                {{ t.label }}
            </span>
        </div>

        <!-- Footer actions -->
        <div class="k-contact-actions">
            <button v-if="contact.phone" type="button" class="k-contact-action" @click="$emit('call', contact)">
                <Phone class="icon" />
                تماس
            </button>
            <button v-if="contact.email" type="button" class="k-contact-action" @click="$emit('mail', contact)">
                <Mail class="icon" />
                ایمیل
            </button>
            <slot name="actions" :contact="contact" />
            <button type="button" class="k-contact-action is-more" aria-label="بیشتر" @click="$emit('more', contact)">
                <MoreHorizontal class="icon" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Mail, MapPin, MoreHorizontal, Phone } from 'lucide-vue-next'
import KAvatar from './KAvatar.vue'
import KCheckbox from '../wrappers/KCheckbox.vue'

export interface KContact {
    name: string
    src?: string
    role?: string
    company?: string
    phone?: string
    email?: string
    address?: string
    status?: 'online' | 'offline' | 'away' | 'busy'
    code?: string | number
    tags?: { label: string; variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' }[]
}

const props = withDefaults(defineProps<{
    contact: KContact
    selected?: boolean
    selectable?: boolean
}>(), {
    selected: false,
    selectable: false
})

const emits = defineEmits<{
    'update:selected': [value: boolean]
    'call': [contact: KContact]
    'mail': [contact: KContact]
    'more': [contact: KContact]
    'select': [contact: KContact]
}>()

const tags = computed(() => props.contact.tags ?? [])


const emitSelect = (v: boolean) => {
    emits('update:selected', v)
    emits('select', props.contact)
}
</script>

<style scoped>
.k-contact {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: var(--k-bg, #ffffff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: var(--k-radius-md, 12px);
    padding: 14px;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.k-contact:hover {
    border-color: color-mix(in srgb, var(--k-primary, #1db954) 40%, var(--k-border, #e2e8f0));
}

.k-contact.is-selected {
    border-color: var(--k-primary, #1db954);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--k-primary, #1db954) 12%, transparent);
}

.k-contact-head {
    display: flex;
    align-items: center;
    gap: 10px;
}

.k-contact-id {
    flex: 1;
    min-width: 0;
}

.k-contact-name {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--k-text-primary, #1e293b);
}

.k-contact-code {
    font-size: 0.62rem;
    font-weight: 600;
    color: var(--k-primary, #1db954);
    background: var(--k-primary-light, #e3f8ec);
    border-radius: 999px;
    padding: 1px 8px;
    direction: ltr;
}

.k-contact-role {
    font-size: 0.74rem;
    color: var(--k-text-secondary, #64748b);
    margin-top: 2px;
}

.k-contact-company {
    font-size: 0.68rem;
    color: var(--k-text-muted, #94a3b8);
}

.k-contact-select {
    flex-shrink: 0;
}

.k-contact-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding-top: 8px;
    border-top: 1px dashed var(--k-border, #e2e8f0);
}

.k-contact-line {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 0.74rem;
    color: var(--k-text-secondary, #64748b);
}

.k-contact-line .icon {
    width: 13px;
    height: 13px;
    color: var(--k-text-muted, #94a3b8);
    flex-shrink: 0;
}

.k-contact-tags {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
}

.k-contact-tag {
    font-size: 0.66rem;
    font-weight: 600;
    border-radius: 999px;
    padding: 2px 9px;
    background: var(--k-surface-hover, #eef2f7);
    color: var(--k-text-secondary, #64748b);
}

.k-contact-tag.is-primary { background: var(--k-primary-light, #e3f8ec); color: var(--k-primary, #1db954); }
.k-contact-tag.is-success { background: var(--k-success-light); color: var(--k-success-text); }
.k-contact-tag.is-warning { background: #fef3c7; color: #d97706; }
.k-contact-tag.is-danger { background: #fee2e2; color: #dc2626; }
.k-contact-tag.is-info { background: #e0f2fe; color: #0284c7; }

.k-ui[data-theme="dark"] .k-contact-tag.is-success,
.k-ui[data-theme="oled"] .k-contact-tag.is-success { background: color-mix(in srgb, var(--k-success-text) 18%, transparent); color: var(--k-success-text); }
.k-ui[data-theme="dark"] .k-contact-tag.is-warning,
.k-ui[data-theme="oled"] .k-contact-tag.is-warning { background: rgba(217, 119, 6, 0.18); color: #fbbf24; }
.k-ui[data-theme="dark"] .k-contact-tag.is-danger,
.k-ui[data-theme="oled"] .k-contact-tag.is-danger { background: rgba(220, 38, 38, 0.18); color: #f87171; }
.k-ui[data-theme="dark"] .k-contact-tag.is-info,
.k-ui[data-theme="oled"] .k-contact-tag.is-info { background: rgba(2, 132, 199, 0.18); color: #38bdf8; }

.k-contact-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    padding-top: 8px;
    border-top: 1px solid var(--k-border, #e2e8f0);
}

.k-contact-action {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid var(--k-border, #e2e8f0);
    background: var(--k-surface, #f8fafc);
    border-radius: 8px;
    padding: 6px 10px;
    font-family: inherit;
    font-size: 0.72rem;
    color: var(--k-text-secondary, #64748b);
    cursor: pointer;
    transition: all 0.12s ease;
}

.k-contact-action:hover {
    border-color: var(--k-primary, #1db954);
    color: var(--k-primary, #1db954);
    background: var(--k-primary-light, #e3f8ec);
}

.k-contact-action .icon {
    width: 13px;
    height: 13px;
}

.k-contact-action.is-more {
    margin-inline-end: auto;
    padding: 6px 8px;
}
</style>
