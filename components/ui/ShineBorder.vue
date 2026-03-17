<script setup lang="ts">
interface Props {
  borderRadius?: number
  borderWidth?: number
  duration?: number
  color?: string | string[]
}

const props = withDefaults(defineProps<Props>(), {
  borderRadius: 8,
  borderWidth: 1,
  duration: 14,
  color: '#000000',
})

const colorValue = computed(() =>
  Array.isArray(props.color) ? props.color.join(',') : props.color,
)
</script>

<template>
  <div
    class="shine-border relative grid h-full w-full place-items-center p-3"
    :style="{ borderRadius: `${borderRadius}px`, '--border-radius': `${borderRadius}px` } as any"
  >
    <div
      class="shine-border__glow"
      :style="{
        '--border-width': `${borderWidth}px`,
        '--border-radius': `${borderRadius}px`,
        '--shine-pulse-duration': `${duration}s`,
        '--mask-linear-gradient': 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        '--background-radial-gradient': `radial-gradient(transparent, transparent, ${colorValue}, transparent, transparent)`,
      } as any"
    />
    <slot />
  </div>
</template>

<style scoped>
.shine-border__glow {
  position: absolute;
  inset: 0;
  aspect-ratio: 1;
  width: 100%;
  height: 100%;
  border-radius: var(--border-radius);
  padding: var(--border-width);
  will-change: background-position;
  background-image: var(--background-radial-gradient);
  background-size: 300% 300%;
  mask: var(--mask-linear-gradient);
  -webkit-mask: var(--mask-linear-gradient);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
  animation: shine-pulse var(--shine-pulse-duration) infinite linear;
}

@keyframes shine-pulse {
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
}
</style>
