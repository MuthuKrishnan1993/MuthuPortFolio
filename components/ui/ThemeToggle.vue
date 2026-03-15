<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (val) => {
    colorMode.preference = val ? 'dark' : 'light'
  },
})

function toggle() {
  isDark.value = !isDark.value
}
</script>

<template>
  <button
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :aria-pressed="isDark"
    class="relative flex items-center gap-1.5 px-2 py-1.5 rounded-full border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.04)] dark:bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(0,0,0,0.08)] dark:hover:bg-[rgba(255,255,255,0.1)] transition-all duration-200 focus-ring cursor-pointer select-none"
    @click="toggle"
  >
    <!-- Sun icon -->
    <span
      class="i-lucide-sun w-3.5 h-3.5 transition-all duration-300"
      :class="isDark ? 'text-label-tertiary dark:text-label-tertiary-dark' : 'text-[#FF9F0A]'"
    />

    <!-- Sliding pill indicator -->
    <span class="relative w-7 h-4 rounded-full bg-[rgba(0,0,0,0.08)] dark:bg-[rgba(255,255,255,0.1)] transition-colors duration-300">
      <span
        class="absolute top-0.5 w-3 h-3 rounded-full bg-white dark:bg-dark-secondary shadow-sm transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        :class="isDark ? 'left-[14px]' : 'left-0.5'"
      />
    </span>

    <!-- Moon icon -->
    <span
      class="i-lucide-moon w-3.5 h-3.5 transition-all duration-300"
      :class="isDark ? 'text-apple-blue' : 'text-label-tertiary'"
    />
  </button>
</template>
