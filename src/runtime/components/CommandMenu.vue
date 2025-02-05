<template>
  <Teleport to="body">
    <Transition name="command-fade">
      <div
        v-if="isOpen"
        class="command-overlay"
        :class="themeClass"
        :style="{ '--command-opacity': opacity }"
        @click="close"
      >
        <div
          class="command-modal"
          :class="themeClass"
          :style="modalStyle"
          @click.stop
        >
          <div class="command-search">
            <Search class="command-search__icon" :size="16" :stroke-width="1.5" />
            <input
              v-model="searchInput"
              type="text"
              placeholder="Type a command or search..."
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
              <div v-for="(group, index) in filteredItems" :key="index" class="command-group">
                <div v-if="group.label" class="command-group__label">{{ group.label }}</div>
                <CommandMenuItem
                  v-for="item in group.items"
                  :key="item.id"
                  :item="item"
                  :selected="false"
                  @select="handleSelect"
                />
              </div>
            </template>
            <div v-else class="command-empty">
              <Search :size="20" class="command-empty__icon" :stroke-width="1.5" />
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
import type { CommandMenuItem } from "../../types";
import { Search } from 'lucide-vue-next'

const props = defineProps<{
  items: CommandMenuItem[];
}>();

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
  if (options?.theme === "dark") return "command-theme-dark";
  if (options?.theme === "light") return "command-theme-light";
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

const opacity = computed(() => {
  const transparency = options?.transparency ?? 0.2;
  return 1 - Math.max(0, Math.min(1, transparency));
});

// Auto-focus search input when opened
onMounted(() => {
  watch(isOpen, (newValue) => {
    if (newValue && searchInput.value) {
      nextTick(() => {
        searchInput.value?.focus();
      });
    }
  });
  setMinimal(options?.minimal ?? true);
});
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
.command-theme-light {
  --command-bg-color: rgba(255, 255, 255, 0.9);
  --command-text-color: #111827;
  --command-border-color: rgba(0, 0, 0, 0.1);
  --command-overlay-color: rgba(0, 0, 0, 0.2);
}

.command-theme-dark {
  --command-bg-color: rgba(23, 23, 23, 0.9);
  --command-text-color: #ffffff;
  --command-border-color: rgba(255, 255, 255, 0.1);
  --command-overlay-color: rgba(0, 0, 0, 0.4);
}
</style>
