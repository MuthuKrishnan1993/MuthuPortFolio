<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)
const headingRef = ref<HTMLElement | null>(null)
const bioRef = ref<HTMLElement | null>(null)
const philosophyRef = ref<HTMLElement | null>(null)
const timelineRef = ref<HTMLElement | null>(null)

// ── About content shape ─────────────────────────────────────────────────────
interface AboutSettings {
  badge?: string
  heading1?: string
  heading2?: string
  avatarText?: string
  introHeading?: string
  bio?: string[]
  quickFacts?: { label: string; value: string; highlight?: boolean }[]
  journey?: { period: string; role: string; company: string; description: string }[]
  philosophy?: { icon: string; title: string; text: string }[]
}

const content = ref<AboutSettings | null>(null)

const badge = computed(() => content.value?.badge ?? 'About Me')
const heading1 = computed(() => content.value?.heading1 ?? 'Building the web')
const heading2 = computed(() => content.value?.heading2 ?? 'one pixel at a time.')
const avatarText = computed(() => content.value?.avatarText ?? 'MK')
const introHeading = computed(() => content.value?.introHeading ?? 'Hi, I\'m Muthukrishnan — a senior frontend developer who believes the web should feel alive.')

const bio = computed(() => content.value?.bio ?? [
  'I\'ve spent the last 5+ years crafting interfaces that merge thoughtful design with engineering precision. My work lives at the intersection of performance and aesthetics — where sub-second load times meet fluid 60fps animations.',
  'I specialize in the Vue ecosystem — Vue 3, Nuxt 3, and TypeScript are my daily tools. But what truly excites me is pushing the boundaries of what\'s possible in the browser: WebGL visualizations, complex GSAP timelines, and design systems that scale from a single component to an entire product.',
  'When I\'m not writing code, you\'ll find me exploring new interaction patterns, contributing to open-source, or deep-diving into browser rendering internals. I believe great frontend development is equal parts engineering discipline and creative intuition.',
])

const quickFacts = computed(() => content.value?.quickFacts ?? [
  { label: 'Experience', value: '5+ years' },
  { label: 'Focus', value: 'Frontend & UI' },
  { label: 'Stack', value: 'Vue · Nuxt · TS', highlight: true },
  { label: 'Location', value: 'India' },
])

const journey = computed(() => content.value?.journey ?? [
  { period: '2019 — 2020', role: 'Frontend Developer', company: 'Started building with Vue & React', description: 'Fell in love with component-driven architecture and reactive state management. Built production SPAs from day one.' },
  { period: '2020 — 2022', role: 'Mid-Level Frontend Engineer', company: 'Scaled to complex applications', description: 'Led migration of legacy jQuery codebases to Vue 3 with TypeScript. Introduced design systems and automated testing pipelines.' },
  { period: '2022 — 2024', role: 'Senior Frontend Developer', company: 'Architecture & mentorship', description: 'Architected micro-frontend solutions, mentored junior developers, and drove adoption of SSR with Nuxt 3 for performance-critical projects.' },
  { period: '2024 — Present', role: 'Senior Frontend Developer', company: 'Pushing boundaries', description: 'Specializing in WebGL experiences, advanced animation systems, and building tools that bridge design and engineering.' },
])

const philosophy = computed(() => content.value?.philosophy ?? [
  { icon: 'i-lucide-layers', title: 'Craft over code', text: 'Every pixel, every transition, every interaction is a chance to create something that feels inevitable — not just functional.' },
  { icon: 'i-lucide-zap', title: 'Performance is UX', text: 'A beautiful interface that loads slowly is a broken interface. I obsess over bundle size, paint timing, and perceived speed.' },
  { icon: 'i-lucide-git-branch', title: 'Simplicity scales', text: 'The best architecture is the one you can explain in five minutes. I favour composition over configuration, and clarity over cleverness.' },
  { icon: 'i-lucide-heart', title: 'Empathy-driven', text: 'Code is for humans first, machines second. I write for the developer who maintains it at 2 AM and the user who just wants it to work.' },
])

// ── Scroll-triggered animations ─────────────────────────────────────────────
onMounted(async () => {
  try {
    content.value = await $fetch<AboutSettings>('/api/admin/content/about')
  } catch { /* falls back to computed defaults */ }

  await nextTick()

  gsap.context(() => {
    gsap.fromTo(headingRef.value,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out', scrollTrigger: { trigger: headingRef.value, start: 'top 85%', once: true } }
    )

    gsap.fromTo(bioRef.value,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power4.out', scrollTrigger: { trigger: bioRef.value, start: 'top 82%', once: true } }
    )

    gsap.fromTo('.about-timeline-item',
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.7, ease: 'power4.out', stagger: 0.15, scrollTrigger: { trigger: timelineRef.value, start: 'top 80%', once: true } }
    )

    gsap.fromTo('.about-philosophy-card',
      { opacity: 0, y: 30, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power4.out', stagger: 0.12, scrollTrigger: { trigger: philosophyRef.value, start: 'top 82%', once: true } }
    )
  }, sectionRef.value ?? undefined)
})
</script>

<template>
  <section
    ref="sectionRef"
    id="about"
    class="relative w-full py-32 md:py-40 overflow-hidden bg-[#ffffff] dark:bg-[#000000] transition-colors duration-500"
  >
    <!-- Subtle gradient orbs -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute w-[500px] h-[500px] rounded-full opacity-20 dark:opacity-[0.05] blur-[120px]"
           style="background: radial-gradient(circle, #0071e3 0%, transparent 70%); top: 10%; left: -10%;" />
      <div class="absolute w-[400px] h-[400px] rounded-full opacity-15 dark:opacity-[0.04] blur-[100px]"
           style="background: radial-gradient(circle, #5ac8fa 0%, transparent 70%); bottom: 15%; right: -5%;" />
    </div>

    <!-- Noise texture -->
    <div class="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"
         style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E'); background-repeat: repeat; background-size: 256px 256px;" />

    <div class="relative z-10 max-w-[1120px] mx-auto px-8 md:px-16 lg:px-24">

      <!-- ── Section heading ─────────────────────────────────── -->
      <div ref="headingRef" class="mb-20 opacity-0">
        <div class="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full
                    border border-[#e8e8ed] dark:border-[#2d2d2f]
                    bg-white/60 dark:bg-[#1d1d1f]/60 backdrop-blur-sm">
          <span class="w-1.5 h-1.5 rounded-full bg-[#0071e3]" />
          <span class="text-[11px] font-medium tracking-[0.12em] uppercase text-[#1d1d1f] dark:text-[#f5f5f7]">
            {{ badge }}
          </span>
        </div>
        <h2 class="font-sans font-bold tracking-[-0.03em] text-[#1d1d1f] dark:text-[#f5f5f7] leading-tight"
            style="font-size: clamp(36px, 5vw, 56px)">
          {{ heading1 }}<br />
          <span class="text-[#0071e3]">{{ heading2 }}</span>
        </h2>
      </div>

      <!-- ── Bio card ────────────────────────────────────────── -->
      <div ref="bioRef" class="relative mb-24 p-8 md:p-12 rounded-[24px]
                                bg-[#f5f5f7] dark:bg-[#1d1d1f]
                                border border-[#e8e8ed] dark:border-[#2d2d2f] opacity-0">
        <div class="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <!-- Left: portrait placeholder & quick facts -->
          <div class="flex flex-col items-center lg:items-start gap-6 shrink-0 lg:w-[260px]">
            <div class="w-32 h-32 rounded-[20px] overflow-hidden
                        border-2 border-[#e8e8ed] dark:border-[#3a3a3c]
                        bg-gradient-to-br from-[#0071e3] to-[#5ac8fa]
                        flex items-center justify-center">
              <span class="text-[48px] font-bold text-white/90 font-sans">{{ avatarText }}</span>
            </div>

            <div class="flex flex-col gap-3 w-full">
              <div
                v-for="(fact, i) in quickFacts"
                :key="i"
                class="flex items-center justify-between py-2.5"
                :class="i < quickFacts.length - 1 ? 'border-b border-[#e8e8ed] dark:border-[#2d2d2f]' : ''"
              >
                <span class="text-[12px] font-medium uppercase tracking-[0.1em] text-[#6e6e73] dark:text-[#86868b]">
                  {{ fact.label }}
                </span>
                <span
                  class="text-[14px] font-semibold"
                  :class="fact.highlight ? 'text-[#0071e3]' : 'text-[#1d1d1f] dark:text-[#f5f5f7]'"
                >
                  {{ fact.value }}
                </span>
              </div>
            </div>
          </div>

          <!-- Right: bio text -->
          <div class="flex-1 flex flex-col gap-6">
            <h3 class="font-sans font-semibold text-[24px] tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7]"
                v-html="introHeading.replace(/alive/, '<span class=\'text-[#0071e3]\'>alive</span>')" />
            <div class="flex flex-col gap-4 text-[16px] leading-[1.65] text-[#6e6e73] dark:text-[#a1a1a6]">
              <p v-for="(para, i) in bio" :key="i">{{ para }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Background timeline ─────────────────────────────── -->
      <div ref="timelineRef" class="mb-24">
        <h3 class="text-[12px] font-medium uppercase tracking-[0.15em] text-[#6e6e73] dark:text-[#86868b] mb-10">
          Background & Journey
        </h3>
        <div class="relative">
          <div class="absolute left-[7px] top-2 bottom-2 w-px bg-[#e8e8ed] dark:bg-[#2d2d2f]" />
          <div class="flex flex-col gap-10">
            <div v-for="(item, i) in journey" :key="i" class="about-timeline-item relative pl-10 opacity-0">
              <div class="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full
                          border-[3px] border-[#0071e3] bg-[#ffffff] dark:bg-[#000000]
                          transition-colors duration-300" />
              <div class="flex flex-col gap-1.5">
                <span class="text-[12px] font-medium tracking-[0.1em] uppercase text-[#0071e3]">{{ item.period }}</span>
                <h4 class="text-[20px] font-semibold tracking-[-0.01em] text-[#1d1d1f] dark:text-[#f5f5f7]">{{ item.role }}</h4>
                <span class="text-[14px] font-medium text-[#6e6e73] dark:text-[#86868b]">{{ item.company }}</span>
                <p class="mt-1 text-[15px] leading-[1.6] text-[#6e6e73] dark:text-[#a1a1a6] max-w-xl">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Philosophy grid ─────────────────────────────────── -->
      <div ref="philosophyRef">
        <h3 class="text-[12px] font-medium uppercase tracking-[0.15em] text-[#6e6e73] dark:text-[#86868b] mb-10">
          Philosophy & Approach
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div
            v-for="(item, i) in philosophy"
            :key="i"
            class="about-philosophy-card group p-7 rounded-[18px] opacity-0
                   bg-[#f5f5f7] dark:bg-[#1d1d1f]
                   border border-[#e8e8ed] dark:border-[#2d2d2f]
                   hover:border-[#0071e3]/30 dark:hover:border-[#0071e3]/30
                   transition-all duration-300 hover:shadow-lg hover:shadow-[#0071e3]/5"
          >
            <div class="w-10 h-10 rounded-[10px] mb-5 flex items-center justify-center
                        bg-[#0071e3]/10 dark:bg-[#0071e3]/15
                        group-hover:bg-[#0071e3]/15 dark:group-hover:bg-[#0071e3]/20
                        transition-colors duration-300">
              <span :class="item.icon" class="w-5 h-5 text-[#0071e3]" />
            </div>
            <h4 class="text-[17px] font-semibold tracking-[-0.01em] text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">{{ item.title }}</h4>
            <p class="text-[14px] leading-[1.6] text-[#6e6e73] dark:text-[#a1a1a6]">{{ item.text }}</p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
