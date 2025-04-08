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
            <Search
              class="command-search__icon"
              :size="16"
              :stroke-width="1.5"
            />
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
              <div
                v-for="(group, groupIndex) in filteredItems"
                :key="groupIndex"
                class="command-group"
              >
                <div v-if="group.label" class="command-group__label">
                  {{ group.label }}
                </div>
                <CommandMenuItem
                  v-for="(item, itemIndex) in group.items"
                  :key="item?.id"
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
import type { PropType } from "vue";
import { nextTick } from "vue";
import type { CommandMenuGroup } from "../../types";
import { useCommandTheme } from "../composables/useCommandTheme";

const props = defineProps({
  items: {
    type: Array as PropType<CommandMenuGroup[]>,
    required: true,
  },
  theme: {
    type: String as PropType<"light" | "dark" | "system">,
    default: "system",
  },
});

const config = useRuntimeConfig();
const options = config.public.commandMenu;

const searchInput = ref("");

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

const { initializeThemeColors } = useCommandTheme();

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
        const input = document.querySelector(
          ".command-search__input"
        ) as HTMLInputElement;
        if (input) input.focus();
      });
    }
  });
  setMinimal(options?.minimal ?? true);
  initializeThemeColors();
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
.command-theme-light {
  --command-bg-color: var(--command-light-background);
  --command-text-color: var(--command-light-text);
  --command-border-color: var(--command-light-border);
  --command-overlay-color: var(--command-light-overlay);
  --command-secondary-color: var(--command-light-secondary);
  --command-hover-bg: var(--command-light-hover);
  --command-active-bg: var(--command-light-active);
}

.command-theme-dark {
  --command-bg-color: var(--command-dark-background);
  --command-text-color: var(--command-dark-text);
  --command-border-color: var(--command-dark-border);
  --command-overlay-color: var(--command-dark-overlay);
  --command-secondary-color: var(--command-dark-secondary);
  --command-hover-bg: var(--command-dark-hover);
  --command-active-bg: var(--command-dark-active);
}

.command-overlay {
  position: fixed;
  inset: 0;
  background: var(--command-overlay-color);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 8rem;
}

.command-modal {
  width: 100%;
  max-width: 480px;
  background: var(--command-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  overflow: hidden;
  margin: 0 16px;
}

.command-search {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--command-border-color);
}

.command-search__icon {
  color: var(--command-secondary-color);
  margin-right: 12px;
}

.command-search__input {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 14px;
  color: var(--command-text-color);
  outline: none;
}

.command-search__input::placeholder {
  color: var(--command-secondary-color);
}

.command-results {
  max-height: 400px;
  overflow-y: auto;
  padding: 8px 12px 12px;
}

.command-group__label {
  padding: 8px 4px 6px;
  color: var(--command-secondary-color);
  font-size: 12px;
  font-weight: 500;
}

.command-empty {
  padding: 8px;
  text-align: center;
  color: var(--command-secondary-color);
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
.command-overlay {
  background-color: var(--command-overlay-color);
}

.command-modal {
  background-color: var(--command-bg-color);
  color: var(--command-text-color);
  border-color: var(--command-border-color);
}
</style>
