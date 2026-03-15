<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement | null>(null)
const headingRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const activeProject = ref<number | null>(null)

// ── Projects content shape ──────────────────────────────────────────────────
interface ProjectItem {
  name: string; url: string; role: string; description: string
  tech: string[]; color: string; year: string; logo: string; category: string
}
interface ProjectStat { value: string; label: string }
interface ProjectsSettings {
  badge?: string
  heading1?: string
  heading2?: string
  subtitle?: string
  projects?: ProjectItem[]
  stats?: ProjectStat[]
  ctaLabel?: string
  ctaHref?: string
}

const content = ref<ProjectsSettings | null>(null)

const badge = computed(() => content.value?.badge ?? 'Selected Work')
const heading1 = computed(() => content.value?.heading1 ?? 'Brands I\'ve helped')
const heading2 = computed(() => content.value?.heading2 ?? 'ship to millions.')
const subtitle = computed(() => content.value?.subtitle ?? 'Large-scale e-commerce platforms built with Vue, Nuxt, and TypeScript — serving global audiences with performance-first frontends.')

const projects = computed<ProjectItem[]>(() => content.value?.projects ?? [
  { name: 'The North Face', url: 'https://www.thenorthface.com/en-us', role: 'Senior Frontend Developer', description: 'Built and maintained the global e-commerce platform for The North Face US. Developed high-performance product listing pages, dynamic filtering systems, and immersive brand storytelling experiences that handle millions of monthly visitors.', tech: ['Nuxt 3', 'Vue 3', 'TypeScript', 'SCSS', 'REST API', 'LaunchDarkly'], color: '#000000', year: '2024', logo: 'TNF', category: 'E-Commerce · Global Retail' },
  { name: 'Vans', url: 'https://www.vans.com/en-us', role: 'Senior Frontend Developer', description: 'Contributed to the Vans US digital storefront — a high-traffic e-commerce platform. Implemented responsive product galleries, AI-powered search integration, and scroll-driven editorial layouts for seasonal campaigns.', tech: ['Nuxt 3', 'Vue 3', 'TypeScript', 'Optimizely', 'CaaS', 'A/B Testing'], color: '#c4161c', year: '2023', logo: 'VANS', category: 'E-Commerce · Lifestyle Brand' },
  { name: 'Timberland', url: 'https://www.timberland.com/en-us', role: 'Frontend Developer', description: 'Developed key frontend modules for Timberland\'s US e-commerce experience. Focused on collection grid layouts, image-heavy hero components with lazy-loading, and a seamless cart/checkout flow optimized for conversion.', tech: ['Nuxt 3', 'Vue 3', 'TypeScript', 'GTM', 'Optimizely', 'REST API'], color: '#d2982a', year: '2022', logo: 'TBL', category: 'E-Commerce · Outdoor Footwear' },
  { name: 'Planet Sports Asia', url: 'https://www.planetsports.asia', role: 'Frontend Developer', description: 'Built the frontend for Southeast Asia\'s leading multi-brand sports retailer. Developed the product discovery experience, mega-menu navigation, promotional banner systems, and localized checkout flow for the Indonesian market.', tech: ['Vue.js', 'Nuxt', 'JavaScript', 'SCSS', 'REST API', 'i18n'], color: '#e63946', year: '2021', logo: 'PS', category: 'E-Commerce · Multi-Brand Retail' },
])

const stats = computed<ProjectStat[]>(() => content.value?.stats ?? [
  { value: '4', label: 'Global Brands' },
  { value: '50M+', label: 'Monthly Visitors' },
  { value: '3+', label: 'Years Shipping' },
])

const ctaLabel = computed(() => content.value?.ctaLabel ?? 'Let\'s work together')
const ctaHref = computed(() => content.value?.ctaHref ?? '#contact')

onMounted(async () => {
  try {
    content.value = await $fetch<ProjectsSettings>('/api/admin/content/projects')
  } catch { /* falls back to computed defaults */ }

  await nextTick()

  gsap.context(() => {
    gsap.fromTo(headingRef.value,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out', scrollTrigger: { trigger: headingRef.value, start: 'top 85%', once: true } }
    )

    gsap.fromTo('.project-card',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power4.out', stagger: 0.15, scrollTrigger: { trigger: gridRef.value, start: 'top 82%', once: true } }
    )
  }, sectionRef.value ?? undefined)
})
</script>

<template>
  <section
    ref="sectionRef"
    id="projects"
    class="relative w-full py-32 md:py-40 overflow-hidden bg-[#f5f5f7] dark:bg-[#0a0a0a] transition-colors duration-500"
  >
    <!-- Gradient orbs -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute w-[600px] h-[600px] rounded-full opacity-15 dark:opacity-[0.04] blur-[130px]"
           style="background: radial-gradient(circle, #bf5af2 0%, transparent 70%); top: -5%; right: -10%;" />
      <div class="absolute w-[450px] h-[450px] rounded-full opacity-20 dark:opacity-[0.05] blur-[110px]"
           style="background: radial-gradient(circle, #0071e3 0%, transparent 70%); bottom: 10%; left: -8%;" />
    </div>

    <!-- Noise texture -->
    <div class="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"
         style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E'); background-repeat: repeat; background-size: 256px 256px;" />

    <div class="relative z-10 max-w-[1120px] mx-auto px-8 md:px-16 lg:px-24">

      <!-- ── Section heading ─────────────────────────────────── -->
      <div ref="headingRef" class="mb-20 opacity-0">
        <div class="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full
                    border border-[#d2d2d7] dark:border-[#2d2d2f]
                    bg-white/60 dark:bg-[#1d1d1f]/60 backdrop-blur-sm">
          <span class="w-1.5 h-1.5 rounded-full bg-[#bf5af2]" />
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

      <!-- ── Project cards ───────────────────────────────────── -->
      <div ref="gridRef" class="flex flex-col gap-6">
        <a
          v-for="(project, i) in projects"
          :key="i"
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          class="project-card group relative opacity-0 rounded-[22px] overflow-hidden
                 bg-[#ffffff] dark:bg-[#1d1d1f]
                 border border-[#e8e8ed] dark:border-[#2d2d2f]
                 hover:border-[#0071e3]/30 dark:hover:border-[#0071e3]/30
                 transition-all duration-400 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-black/30
                 cursor-pointer"
          data-cursor-hover
          @mouseenter="activeProject = i"
          @mouseleave="activeProject = null"
        >
          <div class="flex flex-col md:flex-row">
            <!-- Left: brand identity panel -->
            <div
              class="relative w-full md:w-[280px] shrink-0 flex flex-col items-center justify-center py-12 md:py-0
                     overflow-hidden transition-colors duration-500"
              :style="{ background: activeProject === i ? `linear-gradient(135deg, ${project.color}18 0%, ${project.color}08 100%)` : undefined }"
            >
              <div class="absolute top-0 left-0 w-full h-[3px] transition-all duration-500"
                   :class="activeProject === i ? 'opacity-100' : 'opacity-0'"
                   :style="{ background: `linear-gradient(90deg, ${project.color}, transparent)` }" />
              <div class="w-20 h-20 rounded-[18px] flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                   :style="{ background: `linear-gradient(135deg, ${project.color}20, ${project.color}08)`, border: `1px solid ${project.color}25` }">
                <span class="text-[22px] font-bold tracking-tight" :style="{ color: project.color }">{{ project.logo }}</span>
              </div>
              <span class="mt-4 text-[12px] font-medium tracking-[0.1em] uppercase text-[#ababab] dark:text-[#6e6e73]">{{ project.year }}</span>
            </div>

            <!-- Right: project details -->
            <div class="flex-1 p-8 md:p-10 flex flex-col gap-5">
              <div class="flex items-start justify-between gap-4">
                <div class="flex flex-col gap-1.5">
                  <div class="flex items-center gap-3">
                    <h3 class="text-[24px] font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7]">{{ project.name }}</h3>
                    <span class="text-[#ababab] dark:text-[#6e6e73] group-hover:text-[#0071e3] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200">
                      <span class="i-lucide-arrow-up-right w-5 h-5" />
                    </span>
                  </div>
                  <span class="text-[13px] font-medium text-[#6e6e73] dark:text-[#86868b]">{{ project.category }}</span>
                </div>
                <span class="hidden sm:inline-flex shrink-0 px-3 py-1 rounded-full text-[11px] font-medium tracking-[0.05em]
                             bg-[#f5f5f7] dark:bg-[#2d2d2f] text-[#6e6e73] dark:text-[#a1a1a6]
                             border border-[#e8e8ed] dark:border-[#3a3a3c]">
                  {{ project.role }}
                </span>
              </div>
              <p class="text-[15px] leading-[1.65] text-[#6e6e73] dark:text-[#a1a1a6] max-w-2xl">{{ project.description }}</p>
              <div class="flex flex-wrap gap-2 mt-1">
                <span v-for="(tech, j) in project.tech" :key="j"
                      class="px-3 py-1.5 rounded-full text-[12px] font-medium
                             bg-[#f5f5f7] dark:bg-[#2d2d2f] text-[#1d1d1f] dark:text-[#f5f5f7]
                             border border-[#e8e8ed] dark:border-[#3a3a3c]
                             group-hover:border-[#0071e3]/20 dark:group-hover:border-[#0071e3]/20
                             transition-colors duration-300">
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
        </a>
      </div>

      <!-- ── Bottom stats bar ────────────────────────────────── -->
      <div class="mt-16 pt-10 border-t border-[#e8e8ed] dark:border-[#2d2d2f] flex flex-wrap items-center justify-between gap-8">
        <div class="flex items-center gap-10">
          <template v-for="(stat, i) in stats" :key="i">
            <div class="flex flex-col gap-0.5">
              <span class="text-[28px] font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">{{ stat.value }}</span>
              <span class="text-[12px] font-medium uppercase tracking-[0.1em] text-[#6e6e73] dark:text-[#86868b]">{{ stat.label }}</span>
            </div>
            <div v-if="i < stats.length - 1" class="w-px h-10 bg-[#e8e8ed] dark:bg-[#2d2d2f]" />
          </template>
        </div>
        <a :href="ctaHref"
           class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium text-[#0071e3]
                  border border-[#0071e3]/30 hover:bg-[#0071e3] hover:text-white transition-all duration-200">
          {{ ctaLabel }}
          <span class="i-lucide-arrow-right w-4 h-4" />
        </a>
      </div>
    </div>
  </section>
</template>
