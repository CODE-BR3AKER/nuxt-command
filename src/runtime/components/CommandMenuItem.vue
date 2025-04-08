<template>
  <div
    class="command-menu-item"
    :class="{
      'command-menu-item--selected': selected,
      'command-menu-item--active': item.active,
    }"
    @click="$emit('select', item)"
  >
    <div class="command-menu-item__content">
      <component
        :is="getIcon()"
        class="command-menu-item__icon"
        :size="16"
        :stroke-width="1.5"
      />
      <div class="command-menu-item__text">
        <div class="command-menu-item__label">{{ item.label }}</div>
        <div
          v-if="item.description"
          class="command-menu-item__description"
          v-html="highlightedDescription"
        ></div>
      </div>
    </div>
    <div v-if="item.shortcut" class="command-menu-item__shortcut">
      <span v-for="(key, i) in item.shortcut" :key="i" class="shortcut-key">
        {{ formatShortcutKey(key) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CommandMenuItem } from "../../types";
import * as lucideIcons from "lucide-vue-next";
import { computed } from "vue";
import { useCommandMenu } from "../composables/useCommandMenu";

const props = defineProps<{
  item: CommandMenuItem;
  selected: boolean;
}>();

const { search, getMatchesForItem } = useCommandMenu();

const highlightedDescription = computed(() => {
  if (!props.item.description || !search.value) return props.item.description;

  const matches = getMatchesForItem(props.item);
  if (!matches?.length) return props.item.description;

  let desc = props.item.description;
  const searchLower = search.value.toLowerCase();

  // Don't process if the description already contains mark tags
  if (desc.includes("<mark")) return desc;

  const indices = matches
    .filter((match) => match.key === "description")
    .flatMap((match) => match.indices)
    .sort((a, b) => b[0] - a[0]);

  indices.forEach(([start, end]) => {
    const matchText = desc.slice(start, end + 1);
    const isExactMatch = matchText.toLowerCase() === searchLower;
    // Use single quotes for consistency
    const markClass = isExactMatch ? "mark-exact" : "mark-partial";

    const before = desc.slice(0, start);
    const after = desc.slice(end + 1);
    desc =
      before + `<mark class='${markClass}'>` + matchText + "</mark>" + after;
  });

  return desc;
});

// Get icon component dynamically
const getIcon = () => {
  if (!props.item.icon) return lucideIcons.FileText;
  const iconName = props.item.icon
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  return (
    lucideIcons[iconName as keyof typeof lucideIcons] || lucideIcons.FileText
  );
};

// Format shortcut key for display
const formatShortcutKey = (key: string) => {
  switch (key.toLowerCase()) {
    case "meta":
    case "⌘":
      return "⌘";
    case "alt":
      return "⌥";
    case "shift":
      return "⇧";
    case "ctrl":
      return "⌃";
    default:
      return key.toUpperCase();
  }
};

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
  margin-top: 2px;
}

.command-menu-item:hover,
.command-menu-item--selected {
  background-color: var(--command-hover-bg);
}

.command-menu-item__content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.command-menu-item__icon {
  color: var(--command-secondary-color);
  flex-shrink: 0;
}

.command-menu-item__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.command-menu-item__label {
  font-size: 14px;
  color: var(--command-text-color);
}

.command-menu-item__shortcut {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--command-secondary-color);
  font-size: 12px;
  margin-left: 12px;
}

.shortcut-key {
  min-width: 16px;
  padding: 0 2px;
  text-align: center;
}

.command-menu-item--active {
  background-color: var(--command-active-bg);
}

.command-menu-item__active {
  color: var(--command-text-color);
}

.command-menu-item__description {
  font-size: 12px;
  color: var(--command-secondary-color);
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

.command-menu-item__description .mark-exact {
  background-color: lemonchiffon;
  padding: 0 2px;
  border-radius: 2px;
}

.command-menu-item__description .mark-partial {
  background-color: #e6f3ff; /* Light blue */
  color: #0066cc; /* Darker blue for text */
  padding: 0 2px;
  border-radius: 2px;
}
</style>
