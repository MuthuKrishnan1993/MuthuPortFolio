<script setup lang="ts">
import { gsap } from 'gsap'

const props = withDefaults(defineProps<{
  badge?: string
  title1?: string
  title2?: string
}>(), {
  badge: 'Design Collective',
  title1: 'Elevate Your Digital Vision',
  title2: 'Crafting Exceptional Websites',
})

interface ShapeConfig {
  delay: number
  width: number
  height: number
  rotate: number
  gradient: string
  className: string
}

const shapes: ShapeConfig[] = [
  {
    delay: 0.3,
    width: 600,
    height: 140,
    rotate: 12,
    gradient: 'from-indigo-500/15',
    className: 'left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]',
  },
  {
    delay: 0.5,
    width: 500,
    height: 120,
    rotate: -15,
    gradient: 'from-rose-500/15',
    className: 'right-[-5%] md:right-[0%] top-[70%] md:top-[75%]',
  },
  {
    delay: 0.4,
    width: 300,
    height: 80,
    rotate: -8,
    gradient: 'from-violet-500/15',
    className: 'left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]',
  },
  {
    delay: 0.6,
    width: 200,
    height: 60,
    rotate: 20,
    gradient: 'from-amber-500/15',
    className: 'right-[15%] md:right-[20%] top-[10%] md:top-[15%]',
  },
  {
    delay: 0.7,
    width: 150,
    height: 40,
    rotate: -25,
    gradient: 'from-cyan-500/15',
    className: 'left-[20%] md:left-[25%] top-[5%] md:top-[10%]',
  },
]

const containerRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  await nextTick()

  const ctx = gsap.context(() => {
    // Animate each shape in
    shapes.forEach((shape, i) => {
      gsap.fromTo(`.elegant-shape-${i}`,
        { opacity: 0, y: -150, rotation: shape.rotate - 15 },
        {
          opacity: 1,
          y: 0,
          rotation: shape.rotate,
          duration: 2.4,
          delay: shape.delay,
          ease: 'power4.out',
        }
      )
    })

    // Badge fade up
    gsap.fromTo('.hero-geo-badge',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power3.out' }
    )

    // Title fade up
    gsap.fromTo('.hero-geo-title',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.7, ease: 'power3.out' }
    )

    // Description fade up
    gsap.fromTo('.hero-geo-desc',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.9, ease: 'power3.out' }
    )
  }, containerRef.value ?? undefined)

  return () => ctx.revert()
})
</script>

<template>
  <div
    ref="containerRef"
    class="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]"
  >
    <!-- Gradient background -->
    <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-rose-500/5 blur-3xl" />

    <!-- Floating geometric shapes -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        v-for="(shape, i) in shapes"
        :key="i"
        :class="['elegant-shape absolute opacity-0', `elegant-shape-${i}`, shape.className]"
      >
        <div
          class="shape-float relative"
          :style="{ width: `${shape.width}px`, height: `${shape.height}px` }"
        >
          <div
            :class="[
              'absolute inset-0 rounded-full',
              'bg-gradient-to-r to-transparent',
              shape.gradient,
              'backdrop-blur-[2px] border-2 border-white/15',
              'shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]',
            ]"
          >
            <!-- Radial glow inner -->
            <div class="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="relative z-10 max-w-[980px] mx-auto px-4 md:px-6">
      <div class="max-w-3xl mx-auto text-center">
        <!-- Badge -->
        <div class="hero-geo-badge opacity-0 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/3 border border-white/8 mb-8 md:mb-12">
          <div class="i-lucide-circle h-2 w-2 text-rose-500/80" />
          <span class="text-sm text-white/60 tracking-wide">
            {{ badge }}
          </span>
        </div>

        <!-- Title -->
        <div class="hero-geo-title opacity-0">
          <h1 class="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
            <span class="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
              {{ title1 }}
            </span>
            <br />
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
              {{ title2 }}
            </span>
          </h1>
        </div>

        <!-- Description -->
        <div class="hero-geo-desc opacity-0">
          <p class="text-base sm:text-lg md:text-xl text-white/40 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
            Crafting exceptional digital experiences through
            innovative design and cutting-edge technology.
          </p>
        </div>
      </div>
    </div>

    <!-- Top & bottom gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
  </div>
</template>

<style scoped>
/* Infinite floating animation for shapes */
.shape-float {
  animation: shape-float 12s ease-in-out infinite;
}

@keyframes shape-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(15px); }
}
</style>
