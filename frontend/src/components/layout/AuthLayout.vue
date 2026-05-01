<template>
  <div class="min-h-screen overflow-x-hidden bg-white text-slate-950 transition-colors duration-300 dark:bg-[#050607] dark:text-white">
    <header class="fixed inset-x-0 top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#050607]/85">
      <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <router-link to="/home" class="flex min-w-0 items-center gap-3">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-50 text-sm font-bold text-emerald-700 shadow-sm dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300">
            <img
              v-if="siteLogo"
              :src="siteLogo"
              alt="Logo"
              class="h-full w-full rounded-lg object-contain"
            />
            <span v-else>CR</span>
          </div>
          <div class="min-w-0">
            <div class="truncate text-sm font-semibold tracking-tight text-slate-950 dark:text-white">
              {{ displayName }}
            </div>
            <div class="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
              AI API Gateway
            </div>
          </div>
        </router-link>

        <div class="flex items-center gap-2">
          <LocaleSwitcher class="hidden sm:block" />
          <router-link
            to="/home"
            class="hidden h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 sm:inline-flex"
          >
            首页
          </router-link>
          <button
            type="button"
            @click="toggleTheme"
            class="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            :aria-label="isDark ? '切换到白色模式' : '切换到黑色模式'"
          >
            <Icon :name="isDark ? 'sun' : 'moon'" size="sm" />
            <span class="hidden sm:inline">{{ isDark ? '白色' : '黑色' }}</span>
          </button>
        </div>
      </nav>
    </header>

    <main class="relative min-h-screen pt-16">
      <div
        class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:64px_64px] opacity-45 dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] dark:opacity-60"
      ></div>
      <div class="absolute inset-x-0 top-0 -z-10 h-80 bg-gradient-to-b from-emerald-50 via-white to-transparent dark:from-emerald-950/25 dark:via-[#050607] dark:to-transparent"></div>

      <div class="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <section class="hidden min-w-0 flex-col justify-center lg:flex">
          <div class="max-w-xl">
            <div class="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              正式运营中的 AI 中转服务
            </div>
            <h1 class="text-5xl font-semibold leading-[1.08] tracking-tight text-slate-950 dark:text-white">
              一个账号入口，
              <span class="block text-emerald-600 dark:text-emerald-400">管理你的 AI 调用。</span>
            </h1>
            <p class="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300">
              {{ heroSubtitle }}
            </p>
          </div>

          <div class="mt-10 grid max-w-xl grid-cols-3 gap-3">
            <div
              v-for="metric in metrics"
              :key="metric.label"
              class="rounded-lg border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03]"
            >
              <div class="text-2xl font-semibold text-slate-950 dark:text-white">{{ metric.value }}</div>
              <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ metric.label }}</div>
            </div>
          </div>

          <div class="mt-6 max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-950/10 dark:border-white/10 dark:bg-[#0b0d10] dark:shadow-black/40">
            <div class="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
              <div class="flex items-center gap-2">
                <span class="h-3 w-3 rounded-full bg-red-400"></span>
                <span class="h-3 w-3 rounded-full bg-amber-400"></span>
                <span class="h-3 w-3 rounded-full bg-emerald-400"></span>
              </div>
              <span class="text-xs text-slate-500 dark:text-slate-400">auth.sub2api.local</span>
            </div>
            <div class="p-5">
              <div class="mb-4 flex items-center justify-between">
                <div>
                  <div class="text-sm font-semibold text-slate-950 dark:text-white">账号安全状态</div>
                  <div class="text-xs text-slate-500 dark:text-slate-400">密钥、额度与订阅统一管理</div>
                </div>
                <div class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                  正常
                </div>
              </div>
              <div class="space-y-3">
                <div
                  v-for="item in securityItems"
                  :key="item.title"
                  class="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-black/20"
                >
                  <div class="flex items-center gap-3">
                    <Icon :name="item.icon" size="sm" class="text-emerald-600 dark:text-emerald-400" />
                    <span class="text-sm font-medium text-slate-800 dark:text-slate-200">{{ item.title }}</span>
                  </div>
                  <span class="text-xs text-slate-500 dark:text-slate-400">{{ item.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="flex min-w-0 items-center justify-center">
          <div :class="['w-full', isRegisterPage ? 'max-w-2xl' : 'max-w-md']">
            <div class="mb-6 text-center lg:hidden">
              <div class="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-50 text-sm font-bold text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300">
                CR
              </div>
              <h1 class="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{{ displayName }}</h1>
              <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ heroSubtitle }}</p>
            </div>

            <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/10 dark:border-white/10 dark:bg-[#0b0d10] dark:shadow-black/40 sm:p-8">
              <slot />
            </div>

            <div class="mt-6 text-center text-sm">
              <slot name="footer" />
            </div>

            <div class="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
              &copy; {{ currentYear }} {{ displayName }}. All rights reserved.
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores'
import { sanitizeUrl } from '@/utils/url'
import Icon from '@/components/icons/Icon.vue'
import LocaleSwitcher from '@/components/common/LocaleSwitcher.vue'

const route = useRoute()
const appStore = useAppStore()

const siteName = computed(() => appStore.siteName || 'Sub2API')
const displayName = computed(() => siteName.value === 'Sub2API' ? 'CRS2 AI 中转站' : siteName.value)
const siteLogo = computed(() => sanitizeUrl(appStore.siteLogo || '', { allowRelative: true, allowDataUrl: true }))
const siteSubtitle = computed(() => appStore.cachedPublicSettings?.site_subtitle || '')
const heroSubtitle = computed(() =>
  siteSubtitle.value || '统一接入 Claude、OpenAI、Gemini 等主流 AI 能力，集中管理订阅、额度、密钥与调用统计。'
)
const currentYear = computed(() => new Date().getFullYear())
const isRegisterPage = computed(() => route.path === '/register')
const isDark = ref(false)

const metrics = [
  { value: '1 API', label: '统一入口' },
  { value: '4+', label: '主流平台' },
  { value: '24/7', label: '持续运行' }
]

const securityItems = [
  { title: '账号访问', value: '受控', icon: 'lock' },
  { title: '额度管理', value: '实时', icon: 'chart' },
  { title: '通道状态', value: '监控中', icon: 'shield' }
] as const

function toggleTheme(): void {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

function initTheme(): void {
  const savedTheme = localStorage.getItem('theme')
  const shouldUseDark =
    savedTheme === 'dark' ||
    (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  isDark.value = shouldUseDark
  document.documentElement.classList.toggle('dark', shouldUseDark)
}

onMounted(() => {
  initTheme()
  appStore.fetchPublicSettings()
})
</script>
