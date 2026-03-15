<script setup lang="ts">
defineProps<{
  isScrolled: boolean
  navLinks: { label: string; href: string }[]
  logoText?: string
}>()
</script>

<template>
  <!-- Apple nav is 44px tall, centered links, minimal -->
  <div class="hidden md:flex items-center justify-between h-[44px]">

    <!-- Logo placeholder — replace with actual logo later -->
    <NuxtLink
      to="/"
      class="flex items-center hover:opacity-70 transition-opacity duration-200"
      aria-label="Home"
    >
      <div class="w-8 h-8 rounded-lg bg-label-primary dark:bg-label-primary-dark flex items-center justify-center">
        <span class="text-white dark:text-dark text-[13px] font-semibold leading-none">{{ logoText ?? 'MK' }}</span>
      </div>
    </NuxtLink>

    <!-- Nav Links — Apple centers these -->
    <nav class="flex items-center gap-1">
      <a
        v-for="link in navLinks"
        :key="link.href"
        :href="link.href"
        class="nav-link px-3 py-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-150"
      >
        {{ link.label }}
      </a>
    </nav>

    <!-- Right actions -->
    <div class="flex items-center gap-1">
      <!-- Dark mode toggle -->
      <UiThemeToggle />

      <!-- CTA — Apple blue pill -->
      <a href="#contact" class="btn-primary text-[14px] !py-[6px] !px-[14px]">
        Contact
      </a>
    </div>

  </div>
</template>
