<script setup lang="ts">
interface Props {
  showRadialGradient?: boolean
}

withDefaults(defineProps<Props>(), {
  showRadialGradient: true,
})
</script>

<template>
  <div class="aurora-wrapper relative flex flex-col h-screen items-center justify-center bg-[#030303] transition-colors">
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="aurora-layer pointer-events-none absolute -inset-[10px] opacity-50 will-change-transform"
        :class="{ 'aurora-masked': showRadialGradient }"
      />
    </div>
    <slot />
  </div>
</template>

<style scoped>
.aurora-layer {
  --white: #ffffff;
  --black: #030303;
  --transparent: transparent;
  --blue-500: #3b82f6;
  --indigo-300: #a5b4fc;
  --blue-300: #93c5fd;
  --violet-200: #ddd6fe;
  --blue-400: #60a5fa;

  --dark-gradient: repeating-linear-gradient(
    100deg,
    var(--black) 0%,
    var(--black) 7%,
    var(--transparent) 10%,
    var(--transparent) 12%,
    var(--black) 16%
  );
  --aurora: repeating-linear-gradient(
    100deg,
    var(--blue-500) 10%,
    var(--indigo-300) 15%,
    var(--blue-300) 20%,
    var(--violet-200) 25%,
    var(--blue-400) 30%
  );

  background-image: var(--dark-gradient), var(--aurora);
  background-size: 300% 200%;
  background-position: 50% 50%, 50% 50%;
  filter: blur(10px);
}

.aurora-layer::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: var(--dark-gradient), var(--aurora);
  background-size: 200% 100%;
  background-attachment: fixed;
  mix-blend-mode: difference;
  animation: aurora 60s linear infinite;
}

.aurora-masked {
  mask-image: radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%);
}

@keyframes aurora {
  from {
    background-position: 50% 50%, 50% 50%;
  }
  to {
    background-position: 350% 50%, 350% 50%;
  }
}
</style>
