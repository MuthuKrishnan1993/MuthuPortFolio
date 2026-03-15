<script setup lang="ts">
defineProps<{
  navLinks: { label: string; href: string }[]
}>()

const emit = defineEmits<{
  close: []
}>()

const isOpen = ref(false)

function toggle() {
  isOpen.value = !isOpen.value
}

function handleLinkClick() {
  isOpen.value = false
  emit('close')
}

defineExpose({ isOpen, toggle })
</script>

<template>
  <div class="flex md:hidden items-center justify-between h-[44px]">

    <!-- Logo placeholder — replace with actual logo later -->
    <NuxtLink
      to="/"
      class="flex items-center hover:opacity-70 transition-opacity duration-200"
      aria-label="Home"
      @click="handleLinkClick"
    >
      <div class="w-8 h-8 rounded-lg bg-label-primary dark:bg-label-primary-dark flex items-center justify-center">
        <span class="text-white dark:text-dark text-[13px] font-semibold leading-none">MK</span>
      </div>
    </NuxtLink>

    <!-- Right actions -->
    <div class="flex items-center gap-1">
      <!-- Hamburger -->
      <button
        class="flex items-center justify-center w-8 h-8 rounded-md text-label-secondary dark:text-label-secondary-dark hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 focus-ring"
        :aria-label="isOpen ? 'Close menu' : 'Open menu'"
        @click="toggle"
      >
        <Transition
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 scale-75 rotate-45"
          enter-to-class="opacity-100 scale-100 rotate-0"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 scale-100 rotate-0"
          leave-to-class="opacity-0 scale-75 rotate-45"
          mode="out-in"
        >
          <span v-if="isOpen" key="close" class="i-lucide-x w-4 h-4" />
          <span v-else key="menu" class="i-lucide-menu w-4 h-4" />
        </Transition>
      </button>
    </div>

    <!-- Dropdown Menu — Apple-style frosted sheet -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-3 scale-98"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-3 scale-98"
    >
      <div
        v-if="isOpen"
        class="absolute top-full left-0 right-0 mt-px bg-[rgba(255,255,255,0.92)] dark:bg-[rgba(29,29,31,0.92)] backdrop-blur-2xl border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] overflow-hidden"
      >
        <nav class="flex flex-col py-2">
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            class="px-6 py-3.5 text-[15px] font-normal text-label-primary dark:text-label-primary-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-150 border-b border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.04)] last:border-0"
            @click="handleLinkClick"
          >
            {{ link.label }}
          </a>
          <div class="px-6 py-3">
            <a
              href="#contact"
              class="flex items-center justify-center w-full py-2.5 text-[15px] font-normal bg-apple-blue text-white rounded-full hover:bg-apple-blue-hover transition-colors duration-200"
              @click="handleLinkClick"
            >
              Contact
            </a>
          </div>
        </nav>
      </div>
    </Transition>

  </div>
</template>
