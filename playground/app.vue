<template>
  <div class="playground">
    <h1>Nuxt Command Menu Demo</h1>
    <button @click="$command.toggle()">Open Menu (⌘K)</button>
    <CommandMenu :items="menuGroups" />
  </div>
</template>

<script setup>
const menuGroups = [
  {
    label: 'Suggestions',
    items: [
      {
        id: 'calendar',
        label: 'Calendar',
        icon: 'calendar',
        handler: () => console.log('Calendar clicked')
      },
      {
        id: 'search-emoji',
        label: 'Search Emoji',
        icon: 'smile',
        handler: () => console.log('Search Emoji clicked')
      },
      {
        id: 'launch',
        label: 'Launch',
        icon: 'rocket',
        handler: () => console.log('Launch clicked')
      }
    ]
  },
  {
    label: 'Settings',
    items: [
      {
        id: 'profile',
        label: 'Profile',
        icon: 'user',
        shortcut: ['⌘', 'P'],
        handler: () => console.log('Profile clicked')
      },
      {
        id: 'mail',
        label: 'Mail',
        icon: 'mail',
        shortcut: ['⌘', 'B'],
        handler: () => console.log('Mail clicked')
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: 'settings',
        shortcut: ['⌘', 'S'],
        handler: () => console.log('Settings clicked')
      }
    ]
  }
]
</script>

<style>
.playground {
  padding: 2rem;
}

button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  cursor: pointer;
}

button:hover {
  background: #e5e7eb;
}
</style>
