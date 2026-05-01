<template>
  <div v-if="homeContent" class="min-h-screen">
    <iframe
      v-if="isHomeContentUrl"
      :src="homeContent.trim()"
      class="h-screen w-full border-0"
      allowfullscreen
    ></iframe>
    <div v-else v-html="homeContent"></div>
  </div>

  <div
    v-else
    class="min-h-screen overflow-x-hidden bg-white text-slate-950 transition-colors duration-300 dark:bg-[#050607] dark:text-white"
  >
    <header
      class="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#050607]/85"
    >
      <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <router-link to="/home" class="flex min-w-0 items-center gap-3">
          <div
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-50 text-sm font-bold text-emerald-700 shadow-sm dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300"
          >
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
              {{ brandName }}
            </div>
            <div class="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
              AI API Gateway
            </div>
          </div>
        </router-link>

        <div class="hidden items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
          <a href="#platforms" class="transition hover:text-slate-950 dark:hover:text-white">模型接入</a>
          <a href="#features" class="transition hover:text-slate-950 dark:hover:text-white">产品能力</a>
          <a href="#developers" class="transition hover:text-slate-950 dark:hover:text-white">开发接入</a>
          <a href="#security" class="transition hover:text-slate-950 dark:hover:text-white">安全运营</a>
        </div>

        <div class="flex items-center gap-2">
          <LocaleSwitcher class="hidden sm:block" />

          <a
            v-if="docUrl"
            :href="docUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 sm:flex"
            title="查看文档"
          >
            <Icon name="book" size="sm" />
          </a>

          <button
            type="button"
            @click="toggleTheme"
            class="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            :aria-label="isDark ? '切换到白色模式' : '切换到黑色模式'"
          >
            <Icon :name="isDark ? 'sun' : 'moon'" size="sm" />
            <span class="hidden sm:inline">{{ isDark ? '白色' : '黑色' }}</span>
          </button>

          <router-link
            :to="isAuthenticated ? dashboardPath : '/login'"
            class="inline-flex h-9 items-center gap-2 rounded-lg bg-slate-950 px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            <span>{{ isAuthenticated ? '控制台' : '登录' }}</span>
            <Icon name="arrowRight" size="sm" />
          </router-link>
        </div>
      </nav>
    </header>

    <main>
      <section class="relative border-b border-slate-200/70 dark:border-white/10">
        <div
          class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:64px_64px] opacity-45 dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] dark:opacity-60"
        ></div>
        <div
          class="absolute inset-x-0 top-0 -z-10 h-80 bg-[linear-gradient(135deg,#ecfdf5_0%,#eff6ff_42%,#fff7ed_100%)] dark:bg-[linear-gradient(135deg,rgba(16,185,129,0.18)_0%,rgba(59,130,246,0.12)_45%,rgba(245,158,11,0.10)_100%)]"
        ></div>
        <div
          class="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#050607] dark:via-[#050607]/85 dark:to-transparent"
        ></div>

        <div class="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-24">
          <div class="min-w-0 max-w-full flex flex-col justify-center">
            <div
              class="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              面向个人、团队与工作室的 AI 订阅中转服务
            </div>

            <h1 class="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
              一个入口，
              <span class="block text-emerald-600 dark:text-emerald-400">统一管理 AI。</span>
            </h1>

            <p class="mt-6 hidden max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:block sm:text-lg">
              {{ heroSubtitle }}
            </p>
            <p class="mt-6 text-base leading-8 text-slate-600 dark:text-slate-300 sm:hidden">
              统一接入主流 AI，集中管理订阅、额度与密钥。
            </p>

            <div class="mt-8 flex max-w-full flex-col gap-3 sm:flex-row">
              <router-link
                :to="isAuthenticated ? dashboardPath : '/login'"
                class="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                {{ isAuthenticated ? '进入控制台' : '立即开始使用' }}
                <Icon name="arrowRight" size="sm" />
              </router-link>
              <a
                href="#developers"
                class="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                查看接入方式
                <Icon name="terminal" size="sm" />
              </a>
            </div>

            <div class="mt-10 grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              <div v-for="metric in metrics" :key="metric.label" class="rounded-lg border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
                <div class="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                  {{ metric.value }}
                </div>
                <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {{ metric.label }}
                </div>
              </div>
            </div>

            <div class="mt-6 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              <div
                v-for="signal in heroSignals"
                :key="signal.label"
                class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/75 px-3 py-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04]"
              >
                <span class="h-2.5 w-2.5 rounded-full" :class="signal.dot"></span>
                <div class="min-w-0">
                  <div class="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">{{ signal.label }}</div>
                  <div class="truncate text-[11px] text-slate-500 dark:text-slate-400">{{ signal.value }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="relative min-w-0 max-w-full overflow-hidden">
            <div
              class="w-full max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/10 dark:border-white/10 dark:bg-[#0b0d10] dark:shadow-black/40"
            >
              <div class="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
                <div class="flex items-center gap-2">
                  <span class="h-3 w-3 rounded-full bg-red-400"></span>
                  <span class="h-3 w-3 rounded-full bg-amber-400"></span>
                  <span class="h-3 w-3 rounded-full bg-emerald-400"></span>
                </div>
                <div class="rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-500 shadow-sm dark:bg-white/10 dark:text-slate-300">
                  crs2.ai/dashboard
                </div>
              </div>

              <div class="p-4 sm:p-5">
                <div class="mb-5 flex items-center justify-between">
                  <div>
                    <div class="text-sm font-semibold text-slate-950 dark:text-white">网关运行概览</div>
                    <div class="text-xs text-slate-500 dark:text-slate-400">实时转发、订阅池与额度状态</div>
                  </div>
                  <div class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                    全部正常
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div v-for="stat in dashboardStats" :key="stat.label" class="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
                    <div class="text-xs text-slate-500 dark:text-slate-400">{{ stat.label }}</div>
                    <div class="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{{ stat.value }}</div>
                    <div class="mt-2 text-xs text-emerald-600 dark:text-emerald-400">{{ stat.trend }}</div>
                  </div>
                </div>

                <div class="mt-3 grid gap-3 sm:grid-cols-3">
                  <div
                    v-for="route in routeSignals"
                    :key="route.label"
                    class="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.03]"
                  >
                    <div class="mb-3 flex items-center justify-between">
                      <span class="text-xs font-medium text-slate-600 dark:text-slate-300">{{ route.label }}</span>
                      <span class="h-2 w-2 rounded-full" :class="route.dot"></span>
                    </div>
                    <div class="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                      <div class="h-full rounded-full" :class="route.bar" :style="{ width: route.value }"></div>
                    </div>
                  </div>
                </div>

                <div class="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/20">
                  <div class="mb-3 flex items-center justify-between">
                    <span class="text-xs font-semibold text-slate-700 dark:text-slate-200">通道状态</span>
                    <span class="text-xs text-slate-500 dark:text-slate-400">智能调度中</span>
                  </div>
                  <div class="space-y-3">
                    <div v-for="provider in providers" :key="provider.name" class="flex items-center gap-3">
                      <div class="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white" :class="provider.color">
                        {{ provider.short }}
                      </div>
                      <div class="min-w-0 flex-1 overflow-hidden">
                        <div class="flex items-center justify-between text-xs">
                          <span class="truncate font-medium text-slate-700 dark:text-slate-200">{{ provider.name }}</span>
                          <span class="text-slate-500 dark:text-slate-400">{{ provider.latency }}</span>
                        </div>
                        <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                          <div class="h-full rounded-full bg-emerald-500" :style="{ width: provider.health }"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="platforms" class="border-b border-slate-200 bg-slate-50/70 py-12 dark:border-white/10 dark:bg-white/[0.02]">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mb-8 grid gap-3 md:grid-cols-3">
            <div
              v-for="item in operationsHighlights"
              :key="item.title"
              class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0b0d10]"
            >
              <div class="mb-4 h-1.5 rounded-full" :class="item.bar"></div>
              <div class="text-sm font-semibold text-slate-950 dark:text-white">{{ item.title }}</div>
              <p class="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{{ item.description }}</p>
            </div>
          </div>

          <div class="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Unified providers</p>
              <h2 class="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">统一接入主流 AI 订阅能力</h2>
            </div>
            <p class="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              用一个 API 网关管理多平台账号、密钥、额度和调用记录，减少重复配置与人工维护。
            </p>
          </div>

          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div v-for="provider in providers" :key="provider.name" class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-[#0b0d10]">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white" :class="provider.color">
                  {{ provider.short }}
                </div>
                <div>
                  <div class="font-semibold text-slate-950 dark:text-white">{{ provider.name }}</div>
                  <div class="text-xs text-slate-500 dark:text-slate-400">{{ provider.mode }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" class="py-16 sm:py-20">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="max-w-3xl">
            <p class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Product capabilities</p>
            <h2 class="mt-2 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">为正式运营准备的中转站能力</h2>
            <p class="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
              首页先把产品气质立住，后续控制台也会沿用同一套白/黑主题，让付费用户看到的是稳定、清晰、可信的服务。
            </p>
          </div>

          <div class="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <article v-for="feature in features" :key="feature.title" class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-[#0b0d10]">
              <div class="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
                <Icon :name="feature.icon" size="md" />
              </div>
              <h3 class="text-lg font-semibold text-slate-950 dark:text-white">{{ feature.title }}</h3>
              <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{{ feature.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="developers" class="border-y border-slate-200 bg-slate-950 py-16 text-white dark:border-white/10 dark:bg-black sm:py-20">
        <div class="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div class="flex flex-col justify-center">
            <p class="text-sm font-semibold text-emerald-400">Developer experience</p>
            <h2 class="mt-2 text-4xl font-semibold tracking-tight">像接入一个普通 OpenAI 端点一样简单</h2>
            <p class="mt-4 text-base leading-7 text-slate-300">
              保持开发者熟悉的请求方式，把账号池、额度控制、统计报表和通道调度放到平台内部处理。
            </p>
            <div class="mt-8 flex flex-wrap gap-2">
              <span v-for="tag in devTags" :key="tag" class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                {{ tag }}
              </span>
            </div>
          </div>

          <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-2xl shadow-black/40">
            <div class="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
              <div class="flex items-center gap-2">
                <span class="h-3 w-3 rounded-full bg-red-400"></span>
                <span class="h-3 w-3 rounded-full bg-amber-400"></span>
                <span class="h-3 w-3 rounded-full bg-emerald-400"></span>
              </div>
              <span class="text-xs text-slate-400">api-example.ts</span>
            </div>
            <pre class="overflow-x-auto text-sm leading-7 text-slate-200"><code>const response = await fetch('https://your-domain.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-crs2_xxx',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-5',
    messages: [
      { role: 'user', content: '帮我分析这份运营数据' }
    ]
  })
})</code></pre>
          </div>
        </div>
      </section>

      <section id="security" class="py-16 sm:py-20">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="grid gap-4 lg:grid-cols-3">
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-8 dark:border-white/10 dark:bg-white/[0.03] lg:col-span-1">
              <p class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Operations</p>
              <h2 class="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">面向 7x24 运营</h2>
              <p class="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                从首页开始建立“稳定服务”的感知，后续接入域名、SSL、支付与计费后可继续扩展成完整商业站。
              </p>
            </div>
            <div v-for="item in securityItems" :key="item.title" class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-[#0b0d10]">
              <Icon :name="item.icon" size="lg" class="text-emerald-600 dark:text-emerald-400" />
              <h3 class="mt-5 text-lg font-semibold text-slate-950 dark:text-white">{{ item.title }}</h3>
              <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div class="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-slate-950 p-8 text-white shadow-xl shadow-slate-950/10 dark:border-white/10 dark:bg-white dark:text-slate-950 sm:p-10">
          <div class="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <h2 class="text-3xl font-semibold tracking-tight">准备好开始统一管理你的 AI 订阅了吗？</h2>
              <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-300 dark:text-slate-600">
                先进入控制台完成基础配置，后续我会继续把登录页、控制台和运营文案统一到这套视觉系统。
              </p>
            </div>
            <router-link
              :to="isAuthenticated ? dashboardPath : '/login'"
              class="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800"
            >
              {{ isAuthenticated ? '进入控制台' : '登录控制台' }}
              <Icon name="arrowRight" size="sm" />
            </router-link>
          </div>
        </div>
      </section>
    </main>

    <footer class="border-t border-slate-200 py-8 dark:border-white/10">
      <div class="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <p>&copy; {{ currentYear }} {{ brandName }}. All rights reserved.</p>
        <div class="flex items-center gap-5">
          <a v-if="docUrl" :href="docUrl" target="_blank" rel="noopener noreferrer" class="transition hover:text-slate-950 dark:hover:text-white">文档</a>
          <a :href="githubUrl" target="_blank" rel="noopener noreferrer" class="transition hover:text-slate-950 dark:hover:text-white">GitHub</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore, useAppStore } from '@/stores'
import LocaleSwitcher from '@/components/common/LocaleSwitcher.vue'
import Icon from '@/components/icons/Icon.vue'

type IconName = InstanceType<typeof Icon>['$props']['name']

const authStore = useAuthStore()
const appStore = useAppStore()

const siteName = computed(() => appStore.cachedPublicSettings?.site_name || appStore.siteName || 'CRS2 AI 中转站')
const siteLogo = computed(() => appStore.cachedPublicSettings?.site_logo || appStore.siteLogo || '')
const siteSubtitle = computed(() => appStore.cachedPublicSettings?.site_subtitle || '')
const docUrl = computed(() => appStore.cachedPublicSettings?.doc_url || appStore.docUrl || '')
const homeContent = computed(() => appStore.cachedPublicSettings?.home_content || '')
const brandName = computed(() => siteName.value === 'Sub2API' ? 'CRS2 AI 中转站' : siteName.value)
const heroSubtitle = computed(() => siteSubtitle.value || '统一接入 Claude、OpenAI、Gemini、Antigravity 等主流 AI 能力，集中管理订阅、额度、密钥与调用统计。')

const isHomeContentUrl = computed(() => {
  const content = homeContent.value.trim()
  return content.startsWith('http://') || content.startsWith('https://')
})

const isDark = ref(document.documentElement.classList.contains('dark'))
const githubUrl = 'https://github.com/yeesleeve/sub2api-crs2'
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const dashboardPath = computed(() => (isAdmin.value ? '/admin/dashboard' : '/dashboard'))
const currentYear = computed(() => new Date().getFullYear())

const metrics = [
  { value: '4+', label: '主流平台' },
  { value: '99.9%', label: '运营目标' },
  { value: '1 API', label: '统一入口' }
]

const heroSignals = [
  { label: '路由状态', value: '自动选择可用通道', dot: 'bg-emerald-500' },
  { label: '成本控制', value: '额度与消耗可追踪', dot: 'bg-blue-500' },
  { label: '安全策略', value: '密钥隔离与权限管理', dot: 'bg-amber-500' }
]

const dashboardStats = [
  { label: '今日请求', value: '128K', trend: '+18.4% 稳定增长' },
  { label: '平均延迟', value: '386ms', trend: '智能路由优化' },
  { label: '可用通道', value: '24', trend: '账号池在线' },
  { label: '额度利用', value: '71%', trend: '自动分配中' }
]

const routeSignals = [
  { label: 'Claude', value: '86%', dot: 'bg-orange-500', bar: 'bg-orange-500' },
  { label: 'OpenAI', value: '74%', dot: 'bg-emerald-500', bar: 'bg-emerald-500' },
  { label: 'Gemini', value: '68%', dot: 'bg-blue-500', bar: 'bg-blue-500' }
]

const operationsHighlights = [
  {
    title: '多通道容灾',
    description: '用不同颜色区分模型与通道状态，让首页不再只有黑白两层。',
    bar: 'bg-gradient-to-r from-emerald-400 to-blue-500'
  },
  {
    title: '余额与计费',
    description: '强化金额、消耗、订阅这些付费用户最关心的信息层级。',
    bar: 'bg-gradient-to-r from-blue-500 to-violet-500'
  },
  {
    title: '运营可信感',
    description: '保留白色主视觉，同时加入轻量色彩和状态元素，显得更专业。',
    bar: 'bg-gradient-to-r from-amber-400 to-rose-500'
  }
]

const providers = [
  { name: 'Claude', short: 'C', mode: 'Messages API', latency: '312ms', health: '96%', color: 'bg-orange-500' },
  { name: 'OpenAI', short: 'O', mode: 'Chat Completions', latency: '348ms', health: '92%', color: 'bg-emerald-600' },
  { name: 'Gemini', short: 'G', mode: 'OAuth / API', latency: '421ms', health: '88%', color: 'bg-blue-600' },
  { name: 'Antigravity', short: 'A', mode: '订阅转发', latency: '406ms', health: '90%', color: 'bg-rose-600' }
]

const features: Array<{ title: string; description: string; icon: IconName }> = [
  { title: '统一 API 网关', description: '把多个 AI 订阅和账号池收敛到一个稳定入口，前端、脚本和团队应用只需要维护一套接入配置。', icon: 'server' },
  { title: '订阅池与额度管理', description: '按账号、分组和用户管理余额、额度、并发与有效期，适合长期付费运营和团队共享。', icon: 'database' },
  { title: '实时调用统计', description: '追踪请求量、模型消耗、用户维度和通道表现，帮助你快速发现异常成本与高频需求。', icon: 'chart' },
  { title: '密钥与权限控制', description: '为不同用户分配独立 Key，统一控制可用模型、额度边界、访问权限和调用记录。', icon: 'key' },
  { title: '通道监控与调度', description: '持续观察通道健康、延迟与失败率，为后续自动切换、降级和告警预留运营基础。', icon: 'shield' },
  { title: '支付计费预留', description: '页面结构已经按正式商业站规划，后续可继续接入套餐、支付、订单和发票等运营模块。', icon: 'creditCard' }
]

const devTags = ['OpenAI-compatible', 'Claude Messages', 'Usage analytics', 'Team quotas', 'Channel monitor']

const securityItems: Array<{ title: string; description: string; icon: IconName }> = [
  { title: '密钥不外泄', description: '真实密钥、JWT、数据库密码只保存在服务器环境变量，不写进前端代码和 Git 仓库。', icon: 'lock' },
  { title: '服务可维护', description: 'Docker Compose 管理应用、PostgreSQL 与 Redis，配合宝塔 Nginx 反向代理，便于更新、备份和迁移。', icon: 'cube' }
]

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme')
  const shouldUseDark =
    savedTheme === 'dark' ||
    (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  isDark.value = shouldUseDark
  document.documentElement.classList.toggle('dark', shouldUseDark)
}

onMounted(() => {
  initTheme()
  authStore.checkAuth()
  if (!appStore.publicSettingsLoaded) {
    appStore.fetchPublicSettings()
  }
})
</script>

<style scoped>
main,
section {
  max-width: 100%;
}

main * {
  box-sizing: border-box;
  min-width: 0;
}

p,
h1,
h2,
h3,
a,
span,
div {
  overflow-wrap: anywhere;
}
</style>
