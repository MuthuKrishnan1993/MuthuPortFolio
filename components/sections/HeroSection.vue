<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef  = ref<HTMLElement | null>(null)
const badgeRef    = ref<HTMLElement | null>(null)
const subRef      = ref<HTMLElement | null>(null)
const statsRef    = ref<HTMLElement | null>(null)
const ctaRef      = ref<HTMLElement | null>(null)
const scrollRef   = ref<HTMLElement | null>(null)

// ── Hero content shape ────────────────────────────────────────────────────────
interface HeroSettings {
  badge?: string
  name1?: string
  name2?: string
  availableForWork?: boolean
  subtitle?: string
  roles?: string[]
  stats?: { value: number; suffix: string; label: string }[]
  techPills?: { label: string; color: string }[]
  ctaPrimary?: { label: string; href: string }
  ctaSecondary?: { label: string; href: string }
  socialLinks?: { label: string; href: string }[]
}

// Fetch fresh from file on every mount — bypasses Nuxt Content cache
const heroContent = ref<HeroSettings | null>(null)

const name1 = computed(() => (heroContent.value?.name1 ?? 'Muthu').split(''))
const name2 = computed(() => (heroContent.value?.name2 ?? 'krishnan').split(''))

const stats = computed(() => heroContent.value?.stats ?? [
  { value: 5,  suffix: '+', label: 'Years Exp.' },
  { value: 50, suffix: '+', label: 'Projects' },
  { value: 20, suffix: '+', label: 'Technologies' },
])

const techPills = computed(() => heroContent.value?.techPills ?? [
  { label: 'Vue 3', color: '#818cf8' },
  { label: 'TypeScript', color: '#60a5fa' },
  { label: 'Nuxt 3', color: '#34d399' },
  { label: 'Three.js', color: '#a78bfa' },
  { label: 'GSAP', color: '#fbbf24' },
  { label: 'UnoCSS', color: '#c084fc' },
  { label: 'Node.js', color: '#4ade80' },
  { label: 'Postgres', color: '#38bdf8' },
])

const roles = computed(() => heroContent.value?.roles ?? [
  'Senior Frontend Developer',
  'Vue 3 Specialist',
  'UI / UX Engineer',
  'Nuxt & TypeScript',
])

// Role cycling
const roleIndex = ref(0)
const roleVisible = ref(true)
let roleTimer: ReturnType<typeof setInterval>

function cycleRole() {
  roleVisible.value = false
  setTimeout(() => {
    roleIndex.value = (roleIndex.value + 1) % roles.value.length
    roleVisible.value = true
  }, 400)
}

onMounted(async () => {
  // Always fetch fresh — admin changes reflect immediately on reload
  try {
    heroContent.value = await $fetch<HeroSettings>('/api/admin/content/hero')
  } catch { /* falls back to computed defaults */ }

  roleTimer = setInterval(cycleRole, 3000)

  // Wait for Vue to render content-driven DOM (chars, pills, etc.) before GSAP
  await nextTick()

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.15 })

    // Badge
    tl.fromTo(badgeRef.value,
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, duration: 0.7 }
    )

    // Name line 1 chars
    tl.fromTo('.n1-char',
      { yPercent: 115, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.038 },
      '-=0.3'
    )

    // Name line 2 chars
    tl.fromTo('.n2-char',
      { yPercent: 115, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.032 },
      '-=0.72'
    )

    // Sub & role
    tl.fromTo(subRef.value,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.75 },
      '-=0.4'
    )

    // Stats counter
    tl.fromTo(statsRef.value,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.65 },
      '-=0.45'
    )

    // Animate stat numbers
    stats.value.forEach((stat: { value: number; suffix: string; label: string }, i: number) => {
      gsap.fromTo(`.stat-num-${i}`,
        { textContent: 0 },
        {
          textContent: stat.value,
          duration: 1.8,
          delay: 0.8 + i * 0.15,
          ease: 'power2.out',
          snap: { textContent: 1 },
        }
      )
    })

    // CTA
    tl.fromTo(ctaRef.value,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.65 },
      '-=0.45'
    )

    // Tech pills stagger
    tl.fromTo('.tech-pill',
      { opacity: 0, scale: 0.8, y: 8 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.06 },
      '-=0.5'
    )

    // Scroll indicator
    tl.fromTo(scrollRef.value,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      '-=0.2'
    )

    // Scroll-out parallax
    gsap.to(['.hero-content'], {
      yPercent: -18,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: '55% top',
        scrub: 1,
      },
    })
  }, sectionRef.value ?? undefined)

  return () => ctx.revert()
})

onBeforeUnmount(() => {
  clearInterval(roleTimer)
})
</script>

<template>
  <section
    ref="sectionRef"
    class="relative w-full h-screen overflow-hidden"
  >
    <!-- ── Aurora background ──── -->
    <UiAuroraBackground class="!absolute inset-0" :show-radial-gradient="true" />

    <!-- Bottom fade -->
    <div class="absolute bottom-0 left-0 right-0 h-40 pointer-events-none bg-gradient-to-t from-[#030303] to-transparent z-1" />

    <!-- Top gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none z-1" />

    <!-- ── Main content ───────────────────────────────────────── -->
    <div class="hero-content relative z-10 h-full flex flex-col px-8 md:px-16 lg:px-24 xl:px-32">

      <!-- Center row -->
      <div class="flex-1 flex items-center justify-between gap-12 pt-20">

        <!-- Left: text content -->
        <div class="flex flex-col max-w-2xl">

          <!-- Status badge -->
          <div
            ref="badgeRef"
            class="inline-flex items-center gap-2 self-start mb-8 px-3.5 py-1.5 rounded-full
                   border border-white/8 bg-white/3 backdrop-blur-sm opacity-0"
          >
            <span
              class="w-1.5 h-1.5 rounded-full shrink-0"
              :class="heroContent?.availableForWork !== false ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'"
            />
            <span class="text-[11px] font-medium tracking-[0.12em] uppercase text-white/60">
              {{ heroContent?.badge ?? 'Open to opportunities · 2025' }}
            </span>
          </div>

          <!-- Name -->
          <div class="mb-6">
            <!-- Line 1 -->
            <div ref="line1Ref" class="overflow-hidden leading-none pl-0.5">
              <h1
                class="font-sans font-bold tracking-[-0.045em] text-white leading-none"
                style="font-size: clamp(68px, 11vw, 156px)"
              >
                <span
                  v-for="(ch, i) in name1"
                  :key="i"
                  class="n1-char inline-block will-change-transform opacity-0"
                >{{ ch }}</span>
              </h1>
            </div>

            <!-- Line 2 — accent color -->
            <div ref="line2Ref" class="overflow-hidden leading-none -mt-1 pl-0.5">
              <h1
                class="font-sans font-bold tracking-[-0.045em] leading-none text-indigo-400"
                style="font-size: clamp(68px, 11vw, 156px)"
              >
                <span
                  v-for="(ch, i) in name2"
                  :key="i"
                  class="n2-char inline-block will-change-transform opacity-0"
                >{{ ch }}</span>
                <span class="n2-char inline-block will-change-transform opacity-0">.</span>
              </h1>
            </div>
          </div>

          <!-- Role cycling — fixed height prevents layout shift -->
          <div ref="subRef" class="mb-10 opacity-0 relative h-[1.6em]" style="font-size: clamp(18px, 1.4vw, 20px)">
            <Transition name="role">
              <p
                v-if="roleVisible"
                :key="roleIndex"
                class="absolute inset-0 font-light text-white/40 tracking-[-0.01em] leading-[1.6]"
                style="font-size: inherit"
              >
                {{ roles[roleIndex] }}
              </p>
            </Transition>
          </div>

          <!-- Stats -->
          <div ref="statsRef" class="flex items-center gap-10 mb-10 opacity-0">
            <div
              v-for="(stat, i) in stats"
              :key="i"
              class="flex flex-col gap-0.5"
            >
              <span class="text-[32px] font-bold tracking-tight text-white leading-none">
                <span :class="`stat-num-${i}`">0</span>{{ stat.suffix }}
              </span>
              <span class="text-[12px] font-normal text-white/40 uppercase tracking-[0.1em]">
                {{ stat.label }}
              </span>
            </div>
          </div>

          <!-- CTAs -->
          <div ref="ctaRef" class="flex items-center gap-4 opacity-0">
            <a
              :href="heroContent?.ctaPrimary?.href ?? '#projects'"
              class="group inline-flex items-center gap-2 px-6 py-3 rounded-full
                     bg-indigo-500 hover:bg-indigo-400 text-white text-[15px] font-medium
                     transition-all duration-200 hover:gap-3"
            >
              {{ heroContent?.ctaPrimary?.label ?? 'View Projects' }}
              <span class="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </a>
            <a
              :href="heroContent?.ctaSecondary?.href ?? '/cv.pdf'"
              target="_blank"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-full
                     border border-white/15 text-white/80 text-[15px] font-medium
                     hover:border-indigo-400 hover:text-indigo-300
                     transition-all duration-200"
            >
              {{ heroContent?.ctaSecondary?.label ?? 'Download CV' }} ↓
            </a>
          </div>

        </div>

        <!-- Right: floating tech pills -->
        <div ref="techRef" class="hidden lg:flex flex-col items-end gap-3 shrink-0">
          <div
            v-for="(pill, i) in techPills"
            :key="i"
            class="tech-pill opacity-0 flex items-center gap-2.5 px-4 py-2.5 rounded-full
                   bg-white/5 backdrop-blur-md
                   border border-white/10
                   hover:scale-105 transition-transform duration-200 cursor-default"
            :style="{ animationDelay: `${i * 0.3}s` }"
          >
            <span
              class="w-2 h-2 rounded-full shrink-0"
              :style="{ backgroundColor: pill.color }"
            />
            <span class="text-[13px] font-medium text-white/70 whitespace-nowrap">
              {{ pill.label }}
            </span>
          </div>
        </div>

      </div>

      <!-- Bottom bar -->
      <div ref="scrollRef" class="flex items-center justify-between pb-10 opacity-0">

        <!-- Social links -->
        <div class="flex items-center gap-6">
          <a
            v-for="link in (heroContent?.socialLinks ?? [{ label: 'GitHub', href: '#' }, { label: 'LinkedIn', href: '#' }, { label: 'Twitter', href: '#' }])"
            :key="link.label"
            :href="link.href"
            class="text-[12px] font-medium uppercase tracking-[0.15em] text-white/30
                   hover:text-white/70 transition-colors duration-200"
          >
            {{ link.label }}
          </a>
        </div>

        <!-- Scroll indicator -->
        <div class="flex flex-col items-center gap-2">
          <div class="w-px h-10 relative overflow-hidden bg-white/15 rounded-full">
            <div class="absolute top-0 left-0 w-full h-1/2 bg-indigo-400 rounded-full animate-scroll-line" />
          </div>
          <span class="text-[10px] tracking-[0.2em] uppercase text-white/30">Scroll</span>
        </div>

      </div>
    </div>

  </section>
</template>

<style scoped>
/* Role text transition — pure crossfade, no movement to avoid layout shift */
.role-enter-active { transition: opacity 0.4s ease; }
.role-leave-active { transition: opacity 0.4s ease; }
.role-enter-from   { opacity: 0; }
.role-leave-to     { opacity: 0; }

/* Scroll line bounce */
@keyframes scroll-line {
  0%   { transform: translateY(-100%); }
  100% { transform: translateY(200%); }
}
.animate-scroll-line {
  animation: scroll-line 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

</style>
