<script setup lang="ts">
import { gsap } from "gsap";

const dotRef = ref<HTMLElement | null>(null);
const ringRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const isHovering = ref(false);

let mouse = { x: 0, y: 0 };
let ringPos = { x: 0, y: 0 };
let rafId: number;

function onMouseMove(e: MouseEvent) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;

  if (!isVisible.value) {
    isVisible.value = true;
    // Snap ring to position on first move to avoid jump from 0,0
    ringPos.x = mouse.x;
    ringPos.y = mouse.y;
  }

  // Dot follows instantly
  gsap.set(dotRef.value, { x: mouse.x, y: mouse.y });
}

function onMouseEnterInteractive() {
  isHovering.value = true;
  gsap.to(ringRef.value, {
    scale: 2.2,
    opacity: 0.6,
    duration: 0.3,
    ease: "power2.out",
  });
  gsap.to(dotRef.value, { scale: 0, duration: 0.2 });
}

function onMouseLeaveInteractive() {
  isHovering.value = false;
  gsap.to(ringRef.value, {
    scale: 1,
    opacity: 1,
    duration: 0.3,
    ease: "power2.out",
  });
  gsap.to(dotRef.value, { scale: 1, duration: 0.2 });
}

function onMouseLeave() {
  isVisible.value = false;
}
function onMouseEnter() {
  isVisible.value = true;
}

function loop() {
  // Ring follows with lerp lag for magnetic feel
  ringPos.x += (mouse.x - ringPos.x) * 0.12;
  ringPos.y += (mouse.y - ringPos.y) * 0.12;
  gsap.set(ringRef.value, { x: ringPos.x, y: ringPos.y });
  rafId = requestAnimationFrame(loop);
}

onMounted(() => {
  window.addEventListener("mousemove", onMouseMove);
  document.documentElement.addEventListener("mouseleave", onMouseLeave);
  document.documentElement.addEventListener("mouseenter", onMouseEnter);

  // Delegate hover for all interactive elements
  document.addEventListener("mouseover", (e) => {
    if ((e.target as HTMLElement).closest("a, button, [data-cursor-hover]")) {
      onMouseEnterInteractive();
    }
  });
  document.addEventListener("mouseout", (e) => {
    if ((e.target as HTMLElement).closest("a, button, [data-cursor-hover]")) {
      onMouseLeaveInteractive();
    }
  });

  loop();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId);
  window.removeEventListener("mousemove", onMouseMove);
});
</script>

<template>
  <ClientOnly>
    <!-- Outer ring — lags behind -->
    <div
      ref="ringRef"
      class="fixed top-0 left-0 z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2 will-change-transform"
      :style="{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s' }"
    >
      <div
        class="w-9 h-9 rounded-full border border-[#1d1d1f]/50 dark:border-white/70"
      />
    </div>

    <!-- Inner dot — exact position -->
    <div
      ref="dotRef"
      class="fixed top-0 left-0 z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2 will-change-transform"
      :style="{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s' }"
    >
      <div class="w-1.5 h-1.5 rounded-full bg-[#1d1d1f] dark:bg-white" />
    </div>
  </ClientOnly>
</template>
