<template>
  <div
    class="command-menu-item"
    :class="{ 'command-menu-item--selected': selected }"
    @click="$emit('select', item)"
  >
    <div class="command-menu-item__content">
      <component
        :is="getIcon()"
        class="command-menu-item__icon"
        :size="16"
        :stroke-width="1.5"
      />
      <span class="command-menu-item__label">{{ item.label }}</span>
    </div>
    <div v-if="item.shortcut" class="command-menu-item__shortcut">
      <span v-for="(key, i) in item.shortcut" :key="i" class="shortcut-key">
        {{ formatShortcutKey(key) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CommandMenuItem } from '../../types'
import * as lucideIcons from 'lucide-vue-next'

const props = defineProps<{
  item: CommandMenuItem
  selected: boolean
}>()

// Get icon component dynamically
const getIcon = () => {
  if (!props.item.icon) return lucideIcons.FileText
  const iconName = props.item.icon
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
  return lucideIcons[iconName] || lucideIcons.FileText
}

// Format shortcut key for display
const formatShortcutKey = (key: string) => {
  switch (key.toLowerCase()) {
    case 'meta':
    case '⌘':
      return '⌘'
    case 'alt':
      return '⌥'
    case 'shift':
      return '⇧'
    case 'ctrl':
      return '⌃'
    default:
      return key.toUpperCase()
  }
}

defineEmits<{
  select: [item: CommandMenuItem];
}>();
</script>

<style>
.command-menu-item {
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
}

.command-menu-item:hover,
.command-menu-item--selected {
  background: rgba(0, 0, 0, 0.04);
}

.command-menu-item__content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.command-menu-item__icon {
  color: #6b7280;
  flex-shrink: 0;
}

.command-menu-item__label {
  font-size: 14px;
  color: #374151;
}

.command-menu-item__shortcut {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #9ca3af;
  font-size: 12px;
  margin-left: 12px;
}

.shortcut-key {
  min-width: 16px;
  padding: 0 2px;
  text-align: center;
}
</style>
