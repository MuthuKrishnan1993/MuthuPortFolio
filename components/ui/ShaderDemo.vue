<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = withDefaults(defineProps<{
  activeEffect?: 'mesh' | 'dots' | 'combined'
  speed?: number
  intensity?: number
}>(), {
  activeEffect: 'mesh',
  speed: 1.0,
  intensity: 1.5,
})

const meshCanvasRef = ref<HTMLCanvasElement>()
const dotCanvasRef = ref<HTMLCanvasElement>()

let meshGradient: InstanceType<typeof import('@paper-design/shaders').MeshGradient> | null = null
let dotOrbit: InstanceType<typeof import('@paper-design/shaders').DotOrbit> | null = null
let Shaders: typeof import('@paper-design/shaders') | null = null

async function initShaders() {
  try {
    Shaders = await import('@paper-design/shaders')
  } catch {
    console.warn('[ShaderDemo] @paper-design/shaders not installed — falling back to CSS effects')
    return
  }

  if (
    (props.activeEffect === 'mesh' || props.activeEffect === 'combined') &&
    meshCanvasRef.value &&
    Shaders.MeshGradient
  ) {
    meshGradient = new Shaders.MeshGradient(meshCanvasRef.value, {
      colors: ['#000000', '#1a1a1a', '#333333', '#ffffff'],
      speed: props.activeEffect === 'combined' ? props.speed * 0.5 : props.speed,
      backgroundColor: '#000000',
    })
  }

  if (
    (props.activeEffect === 'dots' || props.activeEffect === 'combined') &&
    dotCanvasRef.value &&
    Shaders.DotOrbit
  ) {
    dotOrbit = new Shaders.DotOrbit(dotCanvasRef.value, {
      dotColor: '#333333',
      orbitColor: '#1a1a1a',
      speed: props.activeEffect === 'combined' ? props.speed * 1.5 : props.speed,
      intensity: props.activeEffect === 'combined' ? props.intensity * 0.8 : props.intensity,
    })
  }
}

watch(() => [props.activeEffect, props.speed, props.intensity], () => {
  // Destroy and reinitialize on prop changes
  meshGradient?.destroy?.()
  dotOrbit?.destroy?.()
  meshGradient = null
  dotOrbit = null
  nextTick(() => initShaders())
})

onMounted(() => {
  initShaders()
})

onBeforeUnmount(() => {
  meshGradient?.destroy?.()
  dotOrbit?.destroy?.()
})
</script>

<template>
  <div class="w-full h-full bg-black relative overflow-hidden">
    <!-- Mesh gradient canvas -->
    <canvas
      v-if="activeEffect === 'mesh' || activeEffect === 'combined'"
      ref="meshCanvasRef"
      class="w-full h-full absolute inset-0"
    />

    <!-- Dot orbit canvas -->
    <canvas
      v-if="activeEffect === 'dots' || activeEffect === 'combined'"
      ref="dotCanvasRef"
      class="w-full h-full absolute inset-0"
      :class="{ 'opacity-60': activeEffect === 'combined' }"
    />

    <!-- Lighting overlay effects -->
    <div class="absolute inset-0 pointer-events-none">
      <div
        class="absolute top-1/4 left-1/3 w-32 h-32 bg-gray-800/5 rounded-full blur-3xl animate-pulse"
        :style="{ animationDuration: `${3 / (props.speed || 1)}s` }"
      />
      <div
        class="absolute bottom-1/3 right-1/4 w-24 h-24 bg-white/2 rounded-full blur-2xl animate-pulse"
        :style="{ animationDuration: `${2 / (props.speed || 1)}s`, animationDelay: '1s' }"
      />
      <div
        class="absolute top-1/2 right-1/3 w-20 h-20 bg-gray-900/3 rounded-full blur-xl animate-pulse"
        :style="{ animationDuration: `${4 / (props.speed || 1)}s`, animationDelay: '0.5s' }"
      />
    </div>
  </div>
</template>
