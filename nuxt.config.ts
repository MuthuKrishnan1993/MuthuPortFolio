// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@unocss/nuxt',
    '@nuxtjs/color-mode',
    '@vueuse/motion/nuxt',
  ],

  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light',
  },

  css: [
    '@unocss/reset/tailwind.css',
    '~/assets/css/theme.css',
  ],

  nitro: {
    serverAssets: [
      {
        baseName: 'settings',
        dir: '../../content/settings',
      },
    ],
  },
})
