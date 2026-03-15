<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)
const headingRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)
const socialsRef = ref<HTMLElement | null>(null)
const barRef = ref<HTMLElement | null>(null)

// ── Footer content shape ────────────────────────────────────────────────────
interface FooterSettings {
  heading?: string
  subheading?: string
  email?: string
  socialLinks?: { label: string; href: string; icon: string }[]
  navLinks?: { label: string; href: string }[]
  copyright?: string
  tagline?: string
}

const content = ref<FooterSettings | null>(null)

const heading = computed(() => content.value?.heading ?? 'Let\'s build something great together.')
const subheading = computed(() => content.value?.subheading ?? 'Currently open to senior frontend roles, freelance projects, and interesting collaborations.')
const email = computed(() => content.value?.email ?? 'hello@muthukrishnan.dev')

const socialLinks = computed(() => content.value?.socialLinks ?? [
  { label: 'GitHub', href: 'https://github.com', icon: 'i-lucide-github' },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'i-lucide-linkedin' },
  { label: 'Twitter', href: 'https://twitter.com', icon: 'i-lucide-twitter' },
])

const navLinks = computed(() => content.value?.navLinks ?? [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
])

const copyright = computed(() => content.value?.copyright ?? 'Muthukrishnan')
const tagline = computed(() => content.value?.tagline ?? 'Crafted with Vue 3, Nuxt 3, and attention to detail.')
const currentYear = new Date().getFullYear()

onMounted(async () => {
  try {
    content.value = await $fetch<FooterSettings>('/api/admin/content/footer')
  } catch { /* falls back to computed defaults */ }

  await nextTick()

  gsap.context(() => {
    gsap.fromTo(headingRef.value,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out', scrollTrigger: { trigger: headingRef.value, start: 'top 85%', once: true } }
    )

    gsap.fromTo(ctaRef.value,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power4.out', scrollTrigger: { trigger: ctaRef.value, start: 'top 88%', once: true } }
    )

    gsap.fromTo('.footer-social-icon',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'power4.out', stagger: 0.08, scrollTrigger: { trigger: socialsRef.value, start: 'top 90%', once: true } }
    )

    gsap.fromTo(barRef.value,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: 'power4.out', scrollTrigger: { trigger: barRef.value, start: 'top 95%', once: true } }
    )
  }, sectionRef.value ?? undefined)
})
</script>

<template>
  <section
    ref="sectionRef"
    id="contact"
    class="relative w-full overflow-hidden bg-[#f5f5f7] dark:bg-[#0a0a0a] transition-colors duration-500"
  >
    <!-- Noise texture -->
    <div class="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"
         style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E'); background-repeat: repeat; background-size: 256px 256px;" />

    <!-- ── Contact CTA area ──────────────────────────────────── -->
    <div class="relative z-10 max-w-[1120px] mx-auto px-8 md:px-16 lg:px-24 pt-32 pb-20">
      <div class="flex flex-col items-center text-center">

        <!-- Heading -->
        <div ref="headingRef" class="mb-8 opacity-0">
          <h2 class="font-sans font-bold tracking-[-0.03em] text-[#1d1d1f] dark:text-[#f5f5f7] leading-tight mb-5"
              style="font-size: clamp(32px, 4.5vw, 48px)">
            {{ heading }}
          </h2>
          <p class="text-[17px] leading-[1.6] text-[#6e6e73] dark:text-[#a1a1a6] max-w-lg mx-auto">
            {{ subheading }}
          </p>
        </div>

        <!-- Email + CTA -->
        <div ref="ctaRef" class="flex flex-col items-center gap-6 mb-12 opacity-0">
          <a :href="`mailto:${email}`"
             class="text-[20px] md:text-[24px] font-medium text-[#0071e3] hover:underline underline-offset-4
                    transition-colors duration-200"
             data-cursor-hover>
            {{ email }}
          </a>
          <a :href="`mailto:${email}`"
             class="inline-flex items-center gap-2.5 px-8 py-4 rounded-full
                    bg-[#0071e3] hover:bg-[#0077ed] text-white text-[16px] font-medium
                    transition-all duration-200 hover:shadow-lg hover:shadow-[#0071e3]/25"
             data-cursor-hover>
            Get in Touch
            <span class="i-lucide-arrow-right w-5 h-5" />
          </a>
        </div>

        <!-- Social icons -->
        <div ref="socialsRef" class="flex items-center gap-4">
          <a v-for="(link, i) in socialLinks"
             :key="i"
             :href="link.href"
             target="_blank"
             rel="noopener noreferrer"
             :aria-label="link.label"
             class="footer-social-icon w-11 h-11 rounded-full flex items-center justify-center opacity-0
                    border border-[#e8e8ed] dark:border-[#2d2d2f]
                    bg-[#ffffff] dark:bg-[#1d1d1f]
                    hover:border-[#0071e3] hover:text-[#0071e3]
                    text-[#6e6e73] dark:text-[#86868b]
                    transition-all duration-200 hover:shadow-md"
             data-cursor-hover>
            <span :class="link.icon" class="w-5 h-5" />
          </a>
        </div>

      </div>
    </div>

    <!-- ── Footer bar ────────────────────────────────────────── -->
    <div ref="barRef" class="relative z-10 border-t border-[#e8e8ed] dark:border-[#2d2d2f] opacity-0">
      <div class="max-w-[1120px] mx-auto px-8 md:px-16 lg:px-24 py-8
                  flex flex-col md:flex-row items-center justify-between gap-6">

        <!-- Copyright -->
        <span class="text-[12px] text-[#ababab] dark:text-[#6e6e73]">
          &copy; {{ currentYear }} {{ copyright }}. All rights reserved.
        </span>

        <!-- Nav links -->
        <div class="flex items-center gap-6">
          <a v-for="(link, i) in navLinks"
             :key="i"
             :href="link.href"
             class="text-[12px] font-medium uppercase tracking-[0.15em] text-[#6e6e73] dark:text-[#86868b]
                    hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors duration-200">
            {{ link.label }}
          </a>
        </div>

        <!-- Tagline -->
        <span class="text-[12px] text-[#ababab] dark:text-[#6e6e73]">
          {{ tagline }}
        </span>

      </div>
    </div>
  </section>
</template>
