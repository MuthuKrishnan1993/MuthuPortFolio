<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)
const headingRef = ref<HTMLElement | null>(null)
const featuredRef = ref<HTMLElement | null>(null)
const articlesRef = ref<HTMLElement | null>(null)

// ── Blog content shape ──────────────────────────────────────────────────────
interface Article {
  title: string; excerpt: string; date: string; readTime: string
  tags: string[]; slug: string; featured: boolean
}
interface BlogSettings {
  badge?: string
  heading1?: string
  heading2?: string
  subtitle?: string
  articles?: Article[]
}

const content = ref<BlogSettings | null>(null)

const badge = computed(() => content.value?.badge ?? 'Blog & Writing')
const heading1 = computed(() => content.value?.heading1 ?? 'Thoughts on craft,')
const heading2 = computed(() => content.value?.heading2 ?? 'code & creativity.')
const subtitle = computed(() => content.value?.subtitle ?? 'Technical deep-dives, lessons learned, and perspectives on building for the modern web.')

const allArticles = computed<Article[]>(() => content.value?.articles ?? [
  { title: 'Building a Neural Network Particle System with Three.js', excerpt: 'A deep dive into creating an interactive WebGL particle visualization with dynamic connections, mouse-reactive camera parallax, and color-mode awareness — all running at 60fps.', date: '2025-12-15', readTime: '8 min read', tags: ['Three.js', 'WebGL', 'Animation'], slug: 'threejs-neural-network-particles', featured: true },
  { title: 'Micro-Frontend Architecture at Scale with Nuxt 3', excerpt: 'How we decomposed a monolithic Vue app into independently deployable micro-frontends, maintained shared state, and achieved sub-second page loads across 4 global brands.', date: '2025-09-20', readTime: '12 min read', tags: ['Nuxt 3', 'Architecture', 'Performance'], slug: 'micro-frontend-nuxt3', featured: true },
  { title: 'Advanced GSAP Timelines: Beyond Simple Tweens', excerpt: 'Master complex animation orchestration — nested timelines, ScrollTrigger scrub, character-by-character reveals, and spring-physics easing for production UI.', date: '2025-06-10', readTime: '10 min read', tags: ['GSAP', 'Animation', 'UX'], slug: 'advanced-gsap-timelines', featured: false },
  { title: 'Design Systems That Actually Scale', excerpt: 'Lessons from building component libraries that serve multiple brands — token architecture, theming strategy, and the art of useful abstractions.', date: '2025-03-05', readTime: '7 min read', tags: ['Design Systems', 'Vue 3', 'UnoCSS'], slug: 'scalable-design-systems', featured: false },
  { title: 'TypeScript Patterns for Vue 3 Composables', excerpt: 'Practical type-safe patterns for building reusable composables — generic refs, conditional return types, and how to type provide/inject.', date: '2024-11-18', readTime: '9 min read', tags: ['TypeScript', 'Vue 3', 'Patterns'], slug: 'typescript-vue3-composables', featured: false },
  { title: 'Performance Auditing E-Commerce Frontends', excerpt: 'A framework for identifying and fixing performance bottlenecks in large Vue/Nuxt e-commerce sites — from LCP optimization to bundle surgery.', date: '2024-08-22', readTime: '11 min read', tags: ['Performance', 'E-Commerce', 'Web Vitals'], slug: 'ecommerce-performance-audit', featured: false },
])

const featuredArticles = computed(() => allArticles.value.filter(a => a.featured))
const regularArticles = computed(() => allArticles.value.filter(a => !a.featured))

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(async () => {
  try {
    content.value = await $fetch<BlogSettings>('/api/admin/content/blog')
  } catch { /* falls back to computed defaults */ }

  await nextTick()

  gsap.context(() => {
    gsap.fromTo(headingRef.value,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out', scrollTrigger: { trigger: headingRef.value, start: 'top 85%', once: true } }
    )

    gsap.fromTo('.blog-featured-card',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power4.out', stagger: 0.15, scrollTrigger: { trigger: featuredRef.value, start: 'top 82%', once: true } }
    )

    gsap.fromTo('.blog-article-card',
      { opacity: 0, y: 30, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power4.out', stagger: 0.1, scrollTrigger: { trigger: articlesRef.value, start: 'top 82%', once: true } }
    )
  }, sectionRef.value ?? undefined)
})
</script>

<template>
  <section
    ref="sectionRef"
    id="blog"
    class="relative w-full py-32 md:py-40 overflow-hidden bg-[#ffffff] dark:bg-[#000000] transition-colors duration-500"
  >
    <!-- Gradient orbs -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute w-[500px] h-[500px] rounded-full opacity-20 dark:opacity-[0.05] blur-[120px]"
           style="background: radial-gradient(circle, #30d158 0%, transparent 70%); top: -5%; left: 15%;" />
      <div class="absolute w-[400px] h-[400px] rounded-full opacity-15 dark:opacity-[0.04] blur-[100px]"
           style="background: radial-gradient(circle, #0071e3 0%, transparent 70%); bottom: 10%; right: -5%;" />
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
          <span class="w-1.5 h-1.5 rounded-full bg-[#30d158]" />
          <span class="text-[11px] font-medium tracking-[0.12em] uppercase text-[#1d1d1f] dark:text-[#f5f5f7]">
            {{ badge }}
          </span>
        </div>
        <h2 class="font-sans font-bold tracking-[-0.03em] text-[#1d1d1f] dark:text-[#f5f5f7] leading-tight"
            style="font-size: clamp(36px, 5vw, 56px)">
          {{ heading1 }}<br />
          <span class="text-[#0071e3]">{{ heading2 }}</span>
        </h2>
        <p class="mt-5 text-[17px] leading-[1.6] text-[#6e6e73] dark:text-[#a1a1a6] max-w-xl">
          {{ subtitle }}
        </p>
      </div>

      <!-- ── Featured articles (large cards) ─────────────────── -->
      <div v-if="featuredArticles.length" ref="featuredRef" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <a
          v-for="(article, i) in featuredArticles"
          :key="i"
          :href="`/blog/${article.slug}`"
          class="blog-featured-card group flex flex-col opacity-0 p-8 rounded-[22px]
                 bg-[#f5f5f7] dark:bg-[#1d1d1f]
                 border border-[#e8e8ed] dark:border-[#2d2d2f]
                 hover:border-[#0071e3]/30 dark:hover:border-[#0071e3]/30
                 transition-all duration-300 hover:shadow-xl hover:shadow-[#0071e3]/5"
          data-cursor-hover
        >
          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mb-5">
            <span class="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.05em]
                         bg-[#0071e3]/10 text-[#0071e3]">
              Featured
            </span>
            <span v-for="(tag, ti) in article.tags" :key="ti"
                  class="px-2.5 py-1 rounded-full text-[11px] font-medium
                         bg-[#e8e8ed] dark:bg-[#2d2d2f] text-[#6e6e73] dark:text-[#a1a1a6]">
              {{ tag }}
            </span>
          </div>

          <!-- Title -->
          <h3 class="text-[22px] font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7] mb-3
                     group-hover:text-[#0071e3] transition-colors duration-200 leading-tight">
            {{ article.title }}
          </h3>

          <!-- Excerpt -->
          <p class="text-[15px] leading-[1.6] text-[#6e6e73] dark:text-[#a1a1a6] mb-6 flex-1">
            {{ article.excerpt }}
          </p>

          <!-- Meta -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 text-[12px] text-[#ababab] dark:text-[#6e6e73]">
              <span>{{ formatDate(article.date) }}</span>
              <span class="w-1 h-1 rounded-full bg-[#d2d2d7] dark:bg-[#3a3a3c]" />
              <span>{{ article.readTime }}</span>
            </div>
            <span class="text-[#ababab] dark:text-[#6e6e73] group-hover:text-[#0071e3]
                         group-hover:translate-x-0.5 group-hover:-translate-y-0.5
                         transition-all duration-200">
              <span class="i-lucide-arrow-up-right w-5 h-5" />
            </span>
          </div>
        </a>
      </div>

      <!-- ── Regular articles grid ───────────────────────────── -->
      <div v-if="regularArticles.length" ref="articlesRef" class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <a
          v-for="(article, i) in regularArticles"
          :key="i"
          :href="`/blog/${article.slug}`"
          class="blog-article-card group flex flex-col opacity-0 p-6 rounded-[18px]
                 bg-[#f5f5f7] dark:bg-[#1d1d1f]
                 border border-[#e8e8ed] dark:border-[#2d2d2f]
                 hover:border-[#0071e3]/30 dark:hover:border-[#0071e3]/30
                 transition-all duration-300 hover:shadow-lg hover:shadow-[#0071e3]/5"
          data-cursor-hover
        >
          <!-- Tags -->
          <div class="flex flex-wrap gap-1.5 mb-4">
            <span v-for="(tag, ti) in article.tags" :key="ti"
                  class="px-2 py-0.5 rounded-full text-[10px] font-medium
                         bg-[#e8e8ed] dark:bg-[#2d2d2f] text-[#6e6e73] dark:text-[#a1a1a6]">
              {{ tag }}
            </span>
          </div>

          <!-- Title -->
          <h3 class="text-[17px] font-semibold tracking-[-0.01em] text-[#1d1d1f] dark:text-[#f5f5f7] mb-2.5
                     group-hover:text-[#0071e3] transition-colors duration-200 leading-snug">
            {{ article.title }}
          </h3>

          <!-- Excerpt -->
          <p class="text-[13px] leading-[1.55] text-[#6e6e73] dark:text-[#a1a1a6] mb-5 flex-1 line-clamp-3">
            {{ article.excerpt }}
          </p>

          <!-- Meta -->
          <div class="flex items-center justify-between mt-auto">
            <div class="flex items-center gap-2 text-[11px] text-[#ababab] dark:text-[#6e6e73]">
              <span>{{ formatDate(article.date) }}</span>
              <span class="w-1 h-1 rounded-full bg-[#d2d2d7] dark:bg-[#3a3a3c]" />
              <span>{{ article.readTime }}</span>
            </div>
            <span class="text-[#ababab] dark:text-[#6e6e73] group-hover:text-[#0071e3]
                         group-hover:translate-x-0.5 group-hover:-translate-y-0.5
                         transition-all duration-200">
              <span class="i-lucide-arrow-up-right w-4 h-4" />
            </span>
          </div>
        </a>
      </div>

    </div>
  </section>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
