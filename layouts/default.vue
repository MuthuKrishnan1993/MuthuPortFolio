<template>
  <div class="min-h-screen bg-white dark:bg-dark text-label-primary dark:text-label-primary-dark transition-colors duration-300 cursor-none">
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
