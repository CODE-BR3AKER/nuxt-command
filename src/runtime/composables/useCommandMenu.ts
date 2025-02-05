import { ref, computed } from "vue";
import { useEventListener } from "@vueuse/core";
import type { CommandMenuItem, CommandMenuGroup } from "../../types";
import Fuse from "fuse.js";

const isOpen = ref(false);
const search = ref("");
const items = ref<CommandMenuGroup[]>([]);
const selectedIndex = ref(0);
const minimal = ref(true);
const transparency = ref(0.2);

const filteredItems = computed(() => {
  if (!search.value) return items.value;

  return items.value.map(group => ({
    ...group,
    items: group.items.filter(item =>
      item.label.toLowerCase().includes(search.value.toLowerCase())
    )
  })).filter(group => group.items.length > 0);
});

const showResults = computed(() => {
  return !minimal.value || search.value.length > 0;
});

const opacity = computed(() => {
  return 1 - Math.max(0, Math.min(1, transparency.value));
});

const navigateUp = () => {
  selectedIndex.value =
    selectedIndex.value <= 0
      ? filteredItems.value.length - 1
      : selectedIndex.value - 1;
};

const navigateDown = () => {
  selectedIndex.value =
    selectedIndex.value >= filteredItems.value.length - 1
      ? 0
      : selectedIndex.value + 1;
};

const selectCurrent = () => {
  const currentItem = filteredItems.value[selectedIndex.value];
  if (currentItem) {
    handleSelect(currentItem);
  }
};

const toggle = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    search.value = "";
    selectedIndex.value = 0;
  }
};

const close = () => {
  isOpen.value = false;
  search.value = "";
};

const handleSelect = (item: CommandMenuItem) => {
  if (item.handler) {
    item.handler();
  }
  if (item.to || item.href) {
    close();
  }
};

const setItems = (newItems: CommandMenuGroup[]) => {
  items.value = newItems;
};

const setMinimal = (value: boolean) => {
  minimal.value = value;
};

const setTransparency = (value: number) => {
  transparency.value = value;
};

// Create a single instance that can be reused
export function useCommandMenu() {
  return {
    isOpen,
    search,
    items,
    setItems,
    filteredItems,
    selectedIndex,
    showResults,
    opacity,
    toggle,
    close,
    handleSelect,
    navigateUp,
    navigateDown,
    selectCurrent,
    setMinimal,
    setTransparency,
  };
}
