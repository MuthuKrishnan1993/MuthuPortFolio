<template>
  <div class="min-h-screen bg-white text-label-primary transition-colors duration-300 cursor-none">
    <UiCustomCursor />
    <LayoutNavbar />
    <slot />
  </div>
</template>

<style>
/* Hide default cursor globally */
*, *::before, *::after {
  cursor: none !important;
}
</style>
