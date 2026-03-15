<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()
const isScrolled = computed(() => y.value > 20)

interface NavSettings {
  logoText?: string
  links?: { label: string; href: string }[]
}

const navContent = ref<NavSettings | null>(null)

const navLinks = computed(() => navContent.value?.links ?? [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
])

const logoText = computed(() => navContent.value?.logoText ?? 'MK')

onMounted(async () => {
  try {
    navContent.value = await $fetch<NavSettings>('/api/admin/content/navbar')
  } catch { /* use fallback defaults */ }
})
</script>

<template>
  <header
    v-motion
    :initial="{ opacity: 0, y: -16 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 500, ease: 'easeOut' } }"
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[rgba(255,255,255,0.72)] dark:bg-[rgba(29,29,31,0.72)] backdrop-blur-2xl border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)]"
  >
    <div class="container-base relative">
      <LayoutNavbarDesktop :is-scrolled="isScrolled" :nav-links="navLinks" :logo-text="logoText" />
      <LayoutNavbarMobile :nav-links="navLinks" />
    </div>
  </header>
</template>
