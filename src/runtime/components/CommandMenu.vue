<template>
  <Teleport to="body">
    <Transition name="command-fade">
      <div
        v-if="isOpen"
        class="command-overlay"
        :class="`command-theme-${theme}`"
        @click="close"
      >
        <div
          class="command-modal"
          :class="`command-theme-${theme}`"
          :style="{ ...modalStyle, opacity: opacity }"
          @click.stop
        >
          <div class="command-search">
            <Search class="command-search__icon" :size="16" :stroke-width="1.5" />
            <input
              v-model="searchInput"
              type="text"
              :placeholder="options.placeholder"
              class="command-search__input"
              @keydown.stop
              @keydown.down.prevent="navigateDown"
              @keydown.up.prevent="navigateUp"
              @keydown.enter.prevent="selectCurrent"
              @keydown.esc="close"
            />
          </div>

          <div v-if="showResults" class="command-results">
            <template v-if="filteredItems.length">
              <div v-for="(group, groupIndex) in filteredItems" :key="groupIndex" class="command-group">
                <div v-if="group.label" class="command-group__label">{{ group.label }}</div>
                <CommandMenuItem
                  v-for="(item, itemIndex) in group.items"
                  :key="item.id"
                  :item="item"
                  :selected="isItemSelected(groupIndex, itemIndex)"
                  @select="handleSelect"
                />
              </div>
            </template>
            <div v-else class="command-empty">
              <p>No results found</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useCommandMenu } from "../composables/useCommandMenu";
import { useRuntimeConfig, onMounted, ref, computed, watch } from "#imports";
import { Search } from "lucide-vue-next";
import type { PropType } from 'vue'
import { nextTick } from "vue";
import type { CommandMenuGroup } from '../../types'

const props = defineProps({
  items: {
    type: Array as PropType<CommandMenuGroup[]>,
    required: true
  },
  theme: {
    type: String as PropType<'light' | 'dark' | 'system'>,
    default: 'system'
  }
})

const config = useRuntimeConfig();
const options = config.public.commandMenu;

const searchInput = ref('');

const {
  isOpen,
  search,
  items,
  setItems,
  filteredItems,
  selectedIndex,
  showResults,
  handleSelect,
  close,
  navigateUp,
  navigateDown,
  selectCurrent,
  setMinimal,
} = useCommandMenu();

// Watch for props.items changes and update the composable
watch(
  () => props.items,
  (newItems) => {
    setItems(newItems);
  },
  { immediate: true }
);

// Handle search input changes
watch(searchInput, (value) => {
  search.value = value;
});

const placeholder = computed(
  () => options?.placeholder ?? "Search commands..."
);

const themeClass = computed(() => {
  if (props?.theme === "dark") return "command-theme-dark";
  if (props?.theme === "light") return "command-theme-light";
  // Handle system theme
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "command-theme-dark"
    : "command-theme-light";
});

const modalStyle = computed(() => ({
  maxWidth: options?.style?.maxWidth || "600px",
  minWidth: options?.style?.minWidth || "300px",
}));

const opacity = computed(() => options?.style?.opacity ?? 1);

// Auto-focus search input when opened
onMounted(() => {
  watch(isOpen, (newValue) => {
    if (newValue) {
      nextTick(() => {
        const input = document.querySelector('.command-search__input') as HTMLInputElement;
        if (input) input.focus();
      });
    }
  });
  setMinimal(options?.minimal ?? true);
});

const isItemSelected = (groupIndex: number, itemIndex: number) => {
  let currentIndex = -1;
  for (let i = 0; i <= groupIndex; i++) {
    const group = filteredItems.value[i];
    if (i === groupIndex) {
      currentIndex += itemIndex + 1;
      break;
    }
    currentIndex += group.items.length;
  }
  return currentIndex === selectedIndex.value;
};
</script>

<style>
.command-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.12);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 8rem;
}

.command-modal {
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  overflow: hidden;
  margin: 0 16px; /* Add horizontal margin */
}

.command-search {
  padding: 12px 16px; /* Increased horizontal padding */
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.command-search__icon {
  color: #6b7280;
  margin-right: 12px;
}

.command-search__input {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #374151;
  outline: none;
}

.command-search__input::placeholder {
  color: #9ca3af;
}

.command-results {
  max-height: 400px;
  overflow-y: auto;
  padding: 8px 12px 12px; /* Increased padding, especially bottom */
}

.command-group__label {
  padding: 8px 4px 6px;
  color: #9ca3af; /* Lighter color */
  font-size: 12px; /* Smaller font */
  font-weight: 500;
}

.command-empty {
  padding: 8px;
  text-align: center;
  color: #6b7280;
  font-size: 13px;
}

/* Transitions */
.command-fade-enter-active,
.command-fade-leave-active {
  transition: opacity 0.2s ease;
}

.command-fade-enter-from,
.command-fade-leave-to {
  opacity: 0;
}

/* Add theme classes */
.command-theme-dark {
  --command-bg-color: #111827;
  --command-text-color: #ffffff;
  --command-border-color: #ffffff1a;
  --command-overlay-color: #00000066;
}

.command-theme-light {
  --command-bg-color: #ffffff;
  --command-text-color: #111827;
  --command-border-color: #0000001a;
  --command-overlay-color: #00000033;
}

.command-overlay {
  background-color: var(--command-overlay-color);
}

.command-modal {
  background-color: var(--command-bg-color);
  color: var(--command-text-color);
  border-color: var(--command-border-color);
}
</style>
