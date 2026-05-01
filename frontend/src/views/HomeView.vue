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
      <nav class="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-4 sm:px-6 lg:px-8">
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
          <a href="#developers" class="transition hover:text-slate-950 dark:hover:text-white">常见问题</a>
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

        <div class="mx-auto grid max-w-[1180px] gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-16">
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

      <section id="platforms" class="border-b border-slate-200 bg-slate-50/70 py-12 dark:border-white/10 dark:bg-white/[0.02] sm:py-14">
        <div class="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div class="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Model access</p>
              <h2 class="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">把主流模型能力收进一个入口</h2>
            </div>
            <p class="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              首页只保留付费用户最关心的内容：能接哪些模型、是否稳定、如何计费、适合什么场景。
            </p>
          </div>

          <div class="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <div class="grid gap-3 sm:grid-cols-2">
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
                <div class="mt-4 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs dark:bg-white/[0.04]">
                  <span class="text-slate-500 dark:text-slate-400">运行延迟</span>
                  <span class="font-semibold text-slate-800 dark:text-slate-100">{{ provider.latency }}</span>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white shadow-xl shadow-slate-950/10 dark:border-white/10 dark:bg-black sm:p-6">
              <div class="mb-5 flex items-center justify-between">
                <div>
                  <p class="text-sm font-semibold text-emerald-300">Capability matrix</p>
                  <h3 class="mt-1 text-2xl font-semibold tracking-tight">模型能力矩阵</h3>
                </div>
                <span class="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-slate-200">持续维护</span>
              </div>

              <div class="space-y-3">
                <div v-for="model in modelCapabilities" :key="model.name" class="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                  <div class="mb-3 flex items-center justify-between gap-3">
                    <div class="min-w-0">
                      <h4 class="truncate text-sm font-semibold">{{ model.name }}</h4>
                      <p class="mt-1 text-xs text-slate-400">{{ model.scene }}</p>
                    </div>
                    <span class="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-slate-200">{{ model.badge }}</span>
                  </div>
                  <div class="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div class="h-full rounded-full" :class="model.bar" :style="{ width: model.value }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" class="py-12 sm:py-14">
        <div class="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div class="grid gap-4 lg:grid-cols-3">
            <article v-for="card in commercialCards" :key="card.title" class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0b0d10]">
              <div class="mb-5 flex h-10 w-10 items-center justify-center rounded-lg" :class="card.iconBg">
                <Icon :name="card.icon" size="md" :class="card.iconColor" />
              </div>
              <h3 class="text-lg font-semibold text-slate-950 dark:text-white">{{ card.title }}</h3>
              <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{{ card.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="developers" class="border-y border-slate-200 bg-slate-950 py-12 text-white dark:border-white/10 dark:bg-black sm:py-14">
        <div class="mx-auto grid max-w-[1180px] gap-6 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p class="text-sm font-semibold text-emerald-400">Developer experience</p>
            <h2 class="mt-2 text-3xl font-semibold tracking-tight">接入方式保持熟悉，运营能力交给平台</h2>
            <p class="mt-4 text-sm leading-7 text-slate-300">兼容 OpenAI 风格请求，把账号池、额度、统计和通道健康放在服务端统一处理。</p>
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            <div v-for="item in faqItems" :key="item.q" class="rounded-xl border border-white/10 bg-white/[0.06] p-4">
              <h3 class="text-sm font-semibold">{{ item.q }}</h3>
              <p class="mt-2 text-xs leading-5 text-slate-400">{{ item.a }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div class="mx-auto max-w-[1180px] rounded-2xl border border-slate-200 bg-slate-950 p-8 text-white shadow-xl shadow-slate-950/10 dark:border-white/10 dark:bg-white dark:text-slate-950 sm:p-10">
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
      <div class="mx-auto flex max-w-[1180px] flex-col justify-between gap-4 px-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:px-6 lg:px-8">
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

const modelCapabilities = [
  { name: 'Claude / Sonnet', scene: '长文本、代码、复杂推理', badge: '推荐', value: '92%', bar: 'bg-orange-500' },
  { name: 'OpenAI', scene: '通用问答、工具调用、结构化输出', badge: '稳定', value: '86%', bar: 'bg-emerald-500' },
  { name: 'Gemini', scene: '多模态、搜索增强、批量任务', badge: '高性价比', value: '78%', bar: 'bg-blue-500' },
  { name: 'Grok / 其他', scene: '备用线路、场景补充、运营扩展', badge: '扩展中', value: '68%', bar: 'bg-violet-500' }
] as const

const commercialCards: Array<{
  title: string
  description: string
  icon: IconName
  iconBg: string
  iconColor: string
}> = [
  {
    title: '稳定性说明',
    description: '多通道接入、状态可观测、异常可追踪，适合把 AI 调用作为长期服务使用。',
    icon: 'shield',
    iconBg: 'bg-emerald-50 dark:bg-emerald-400/10',
    iconColor: 'text-emerald-600 dark:text-emerald-400'
  },
  {
    title: '计费透明',
    description: '余额、套餐、请求成本和 Token 明细都集中展示，用户能清楚知道额度消耗在哪里。',
    icon: 'calculator',
    iconBg: 'bg-amber-50 dark:bg-amber-400/10',
    iconColor: 'text-amber-600 dark:text-amber-400'
  },
  {
    title: '适合场景',
    description: '个人创作、开发测试、团队工具、自动化脚本和多模型应用都可以用同一套入口管理。',
    icon: 'cpu',
    iconBg: 'bg-blue-50 dark:bg-blue-400/10',
    iconColor: 'text-blue-600 dark:text-blue-400'
  }
]

const faqItems = [
  { q: '是否需要改代码？', a: '多数 OpenAI 兼容应用只需要替换 Base URL 和 API Key。' },
  { q: '如何控制成本？', a: '通过余额、密钥额度、分组倍率和使用记录持续追踪消耗。' },
  { q: '模型不可用怎么办？', a: '可在通道状态与可用模型页查看线路状态，后续可继续扩展自动调度策略。' },
  { q: '适合商业运营吗？', a: '页面、充值、用户控制台和后台配置都按正式站点逐步打磨。' }
] as const

const providers = [
  { name: 'Claude', short: 'C', mode: 'Messages API', latency: '312ms', health: '96%', color: 'bg-orange-500' },
  { name: 'OpenAI', short: 'O', mode: 'Chat Completions', latency: '348ms', health: '92%', color: 'bg-emerald-600' },
  { name: 'Gemini', short: 'G', mode: 'OAuth / API', latency: '421ms', health: '88%', color: 'bg-blue-600' },
  { name: 'Antigravity', short: 'A', mode: '订阅转发', latency: '406ms', health: '90%', color: 'bg-rose-600' }
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
