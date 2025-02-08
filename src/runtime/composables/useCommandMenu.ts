import { ref, computed } from "vue";
import type { CommandMenuItem, CommandMenuGroup } from "../../types";
import Fuse from "fuse.js";
import { useRuntimeConfig } from '#imports'

const isOpen = ref(false);
const search = ref("");
const items = ref<CommandMenuGroup[]>([]);
const selectedIndex = ref(-1);
const minimal = ref(true);
const transparency = ref(0.2);
const searchResults = ref<Fuse.FuseResult<CommandMenuItem>[]>([]);

// Get flattened list of items for navigation
const flattenedItems = computed(() => {
  if (!search.value) {
    return items.value.flatMap(group => group.items);
  }
  return filteredItems.value.flatMap(group => group.items);
});

function calculateContextSize(maxWidth: string = '600px'): number {
  // Convert maxWidth to number (remove 'px' and parse)
  const width = parseInt(maxWidth.replace('px', ''));

  // Rough estimate: 1 char ≈ 8px in typical font
  // We want context to be about 30% of max width
  // So: (maxWidth * 0.3) / 8px per char
  const contextSize = Math.floor((width * 0.3) / 8);

  // Clamp between 15 and 40 chars for readability
  return Math.min(Math.max(contextSize, 15), 40);
}

const filteredItems = computed(() => {
  if (!search.value) {
    searchResults.value = [];
    return items.value;
  }

  const config = useRuntimeConfig();
  const maxWidth = config.public.commandMenu?.style?.maxWidth || '600px';
  const contextSize = calculateContextSize(maxWidth);

  const fuse = new Fuse(items.value.flatMap(group => group.items), {
    keys: [
      'label',
      'description',
      'fullContent',
    ],
    threshold: 0.4,
    distance: 100,
    includeMatches: true,
    ignoreLocation: true,
    useExtendedSearch: true,
    minMatchCharLength: 2,
    shouldSort: true,
    findAllMatches: true
  });

  searchResults.value = fuse.search(search.value);

  return items.value.map(group => ({
    ...group,
    items: group.items.map(item => {
      const result = searchResults.value.find(r => r.item.id === item.id);
      if (!result) return null;

      // Find best match in fullContent
      const contentMatch = result.matches?.find(m => m.key === 'fullContent');
      if (contentMatch && contentMatch.indices.length > 0) {
        const content = result.item.fullContent;

        // Find the best matching section (closest to exact match)
        let bestMatch = contentMatch.indices[0];
        let bestMatchText = '';

        contentMatch.indices.forEach(([start, end]) => {
          const matchText = content.slice(start, end + 1);
          if (matchText.toLowerCase() === search.value.toLowerCase()) {
            bestMatch = [start, end];
            bestMatchText = matchText;
          }
        });

        if (!bestMatchText) {
          bestMatchText = content.slice(bestMatch[0], bestMatch[1] + 1);
        }

        // Use calculated contextSize instead of hardcoded value
        const contextStart = content.lastIndexOf(' ', bestMatch[0] - contextSize) + 1;
        const contextEnd = content.indexOf(' ', bestMatch[1] + contextSize);

        // Create snippet with highlighted match
        const before = content.slice(contextStart, bestMatch[0]);
        const after = content.slice(bestMatch[1] + 1, contextEnd === -1 ? content.length : contextEnd);

        const isExactMatch = bestMatchText.toLowerCase() === search.value.toLowerCase();
        const markClass = isExactMatch ? 'mark-exact' : 'mark-partial';

        const snippet = '...' +
          before +
          `<mark class="${markClass}">` + bestMatchText + '</mark>' +
          after + '...';

        return {
          ...item,
          description: snippet
        };
      }
      return item;
    }).filter(Boolean)
  })).filter(group => group.items.length > 0);
});

const showResults = computed(() => {
  return !minimal.value || search.value.length > 0;
});

const opacity = computed(() => {
  return 1 - Math.max(0, Math.min(1, transparency.value));
});

const navigateUp = () => {
  const total = flattenedItems.value.length;
  if (total === 0) return;

  selectedIndex.value = selectedIndex.value <= 0
    ? total - 1
    : selectedIndex.value - 1;
};

const navigateDown = () => {
  const total = flattenedItems.value.length;
  if (total === 0) return;

  selectedIndex.value = selectedIndex.value >= total - 1
    ? 0
    : selectedIndex.value + 1;
};

const selectCurrent = () => {
  const currentItem = flattenedItems.value[selectedIndex.value];
  if (currentItem) {
    handleSelect(currentItem);
  }
};

const toggle = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    search.value = "";
    selectedIndex.value = -1;
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

const getMatchesForItem = (item: CommandMenuItem) => {
  const result = searchResults.value.find(r => r.item.id === item.id);
  if (!result?.matches) return null;

  // Check if there are any exact matches
  const exactMatches = result.matches.filter(match => {
    const value = match.value?.toLowerCase();
    return value?.includes(search.value.toLowerCase());
  });

  // If we have exact matches, only return those
  return exactMatches.length > 0 ? exactMatches : result.matches;
};

// Create a single instance that can be reused
export function useCommandMenu() {
  return {
    isOpen,
    search,
    items,
    selectedIndex,
    setItems,
    filteredItems,
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
    getMatchesForItem
  };
}
