<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import { useRouter } from "vue-router";

// Initialize color mode
const mode = useColorMode();
const router = useRouter();

function toggleMode() {
  mode.value = mode.value === "dark" ? "light" : "dark";
}

function navigateTo(path: string) {
  router.push(path);
}
</script>

<template>
  <div class="min-h-svh">
    <div
      class="container relative min-h-svh flex flex-col items-center justify-center px-4 md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
    >
      <!-- Theme Toggle Button -->
      <button
        @click="toggleMode"
        class="fixed right-4 top-4 z-50 rounded-lg p-2 hover:bg-muted"
        aria-label="Toggle theme"
      >
        <svg
          v-if="mode === 'dark'"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-6 w-6 text-yellow-300"
        >
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2"></path>
          <path d="M12 20v2"></path>
          <path d="m4.93 4.93 1.41 1.41"></path>
          <path d="m17.66 17.66 1.41 1.41"></path>
          <path d="M2 12h2"></path>
          <path d="M20 12h2"></path>
          <path d="m6.34 17.66-1.41 1.41"></path>
          <path d="m19.07 4.93-1.41 1.41"></path>
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-6 w-6 text-slate-700"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        </svg>
      </button>

      <!-- Left: Logo & Image -->
      <div
        class="relative hidden h-full flex-col bg-white p-10 text-white lg:flex"
      >
        <div class="absolute inset-0 bg-white">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="NGO Management System"
            class="h-full w-full object-cover opacity-40"
          />
        </div>
        <div class="relative z-20 flex items-center text-lg font-medium">
          <!-- src="https://www.dpim.org.my/wp-content/uploads/2024/02/Logo-DPIM.png" -->

          <img
            src="@/assets/logo/dpim-logo-1.png"
            alt="logo"
            class="h-16"
          />
        </div>
        <div class="relative z-20 mt-auto">
          <div class="space-y-2">
            <h1
              class="text-3xl md:text-4xl font-bold tracking-tight text-green-700 italic"
            >
              MyNGO
            </h1>
            <p class="text-green-900">Empowering NGOs for a Better Tomorrow</p>
          </div>
        </div>
      </div>

      <!-- Right: Auth Content -->
      <div class="py-6 lg:p-8">
        <div
          class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
        >
          <slot />

          <!-- Footer with links -->
          <div class="mt-8 text-center text-sm text-muted-foreground">
            <!-- <div class="flex justify-center space-x-4">
              <button
                @click="navigateTo('/about')"
                class="hover:text-primary transition-colors"
              >
                About Us
              </button>
              <span class="text-muted-foreground/50">|</span>
              <button
                @click="navigateTo('/privacy-policy')"
                class="hover:text-primary transition-colors"
              >
                Privacy
              </button>
              <span class="text-muted-foreground/50">|</span>
              <button
                @click="navigateTo('/terms-of-service')"
                class="hover:text-primary transition-colors"
              >
                Terms
              </button>
            </div> -->

            <!-- Footer wording -->
            <div class="mt-2 text-xs cursor-default select-none">
              <!-- Easter egg removed -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Remove all easter egg related styles */
</style>
