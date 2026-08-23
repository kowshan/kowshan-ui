<!-- docs/PropControl.vue — one live control per playground prop -->
<template>
    <div class="pc" :class="`pc-${kind}`">
        <KToggle
            v-if="kind === 'toggle'"
            :model-value="Boolean(value)"
            :label="prop.name"
            @update:model-value="emit('update', $event)"
        />
        <KSelect
            v-else-if="kind === 'select'"
            :model-value="value"
            :options="options"
            :label="prop.name"
            @update:model-value="emit('update', $event)"
        />
        <label v-else-if="kind === 'number'" class="pc-field">
            <span class="pc-name">{{ prop.name }}</span>
            <input
                :value="value ?? 0"
                type="number"
                class="pc-input"
                @input="emit('update', Number(($event.target as HTMLInputElement).value || 0))"
            />
        </label>
        <label v-else class="pc-field">
            <span class="pc-name">{{ prop.name }}</span>
            <input
                :value="value ?? ''"
                type="text"
                class="pc-input"
                @input="emit('update', ($event.target as HTMLInputElement).value)"
            />
        </label>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import KToggle from '../ui-kit/wrappers/KToggle.vue'
import KSelect from '../ui-kit/wrappers/KSelect.vue'
import { controlKindFor, unionMembers } from './useComponentDocs'
import type { ControlKind } from './useComponentDocs'

const props = defineProps<{
    prop: { name: string; type: string }
    value: any
}>()

const emit = defineEmits<{ (e: 'update', value: any): void }>()

const kind = computed<ControlKind>(() => controlKindFor(props.prop.type))
const options = computed(() => unionMembers(props.prop.type))
</script>

<style scoped>
.pc {
    display: flex;
    align-items: center;
    min-width: 0;
}

.pc-field {
    display: flex;
    flex-direction: column;
    gap: 3px;
    width: 100%;
    min-width: 0;
}

.pc-name {
    font-size: 0.62rem;
    font-weight: 600;
    color: var(--k-text-muted, #94a3b8);
    font-family: monospace;
    direction: ltr;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.pc-input {
    width: 100%;
    box-sizing: border-box;
    padding: 5px 8px;
    font-size: 0.7rem;
    font-family: monospace;
    direction: ltr;
    color: var(--k-text-primary, #1e293b);
    background: var(--k-bg, #fff);
    border: 1px solid var(--k-border, #e2e8f0);
    border-radius: 8px;
    outline: none;
    transition: border-color 0.15s ease;
}

.pc-input:focus {
    border-color: var(--k-primary, #1db954);
}
</style>
