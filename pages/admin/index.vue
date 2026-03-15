<script setup lang="ts">
definePageMeta({ layout: false })

const password = ref('')
const error = ref('')
const loading = ref(false)

async function login() {
  error.value = ''
  loading.value = true
  try {
    await $fetch('/api/admin/login', { method: 'POST', body: { password: password.value } })
    navigateTo('/admin/dashboard')
  } catch {
    error.value = 'Invalid password'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center"
    style="background: #0a0a0a; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;"
  >
    <div
      class="w-full max-w-[360px] mx-4 rounded-2xl p-8"
      style="background: #1a1a1a; border: 1px solid #2d2d2f;"
    >
      <!-- Lock icon -->
      <div class="flex justify-center mb-6">
        <div
          class="w-14 h-14 rounded-2xl flex items-center justify-center"
          style="background: #0071e3;"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
      </div>

      <!-- Heading -->
      <h1
        class="text-center text-[22px] font-semibold mb-1"
        style="color: #f5f5f7;"
      >
        Admin
      </h1>
      <p class="text-center text-[13px] mb-8" style="color: #6e6e73;">
        Sign in to manage your portfolio
      </p>

      <!-- Form -->
      <form @submit.prevent="login" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label
            for="password"
            class="text-[12px] font-medium uppercase tracking-wider"
            style="color: #86868b;"
          >
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter password"
            autocomplete="current-password"
            class="w-full rounded-lg px-3 py-2.5 text-[14px] outline-none transition-all duration-200"
            style="background: #262626; border: 1px solid #3a3a3c; color: #f5f5f7;"
            :style="error ? 'border-color: #ff453a;' : ''"
            @focus="(e) => ((e.target as HTMLInputElement).style.borderColor = '#0071e3')"
            @blur="(e) => ((e.target as HTMLInputElement).style.borderColor = error ? '#ff453a' : '#3a3a3c')"
          />
        </div>

        <!-- Error message -->
        <div
          v-if="error"
          class="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px]"
          style="background: rgba(255, 69, 58, 0.12); color: #ff453a; border: 1px solid rgba(255, 69, 58, 0.25);"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {{ error }}
        </div>

        <!-- Submit button -->
        <button
          type="submit"
          :disabled="loading || !password"
          class="w-full rounded-lg py-2.5 text-[15px] font-medium text-white transition-all duration-200"
          style="background: #0071e3;"
          :style="loading || !password ? 'opacity: 0.5; cursor: not-allowed;' : 'cursor: pointer;'"
          @mouseover="(e) => { if (!loading && password) (e.target as HTMLElement).style.background = '#0077ed' }"
          @mouseleave="(e) => ((e.target as HTMLElement).style.background = '#0071e3')"
        >
          <span v-if="loading" class="flex items-center justify-center gap-2">
            <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="32" stroke-dashoffset="12" />
            </svg>
            Signing in...
          </span>
          <span v-else>Sign In</span>
        </button>
      </form>
    </div>
  </div>
</template>
