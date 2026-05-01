<template>
  <AppLayout>
    <div class="space-y-6">
      <div v-if="loading" class="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>

      <template v-else-if="stats">
        <section class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0b0d10]">
          <div class="grid gap-6 p-6 lg:grid-cols-[1.35fr_0.65fr] lg:p-7">
            <div class="min-w-0">
              <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                运营控制台
              </div>
              <h1 class="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-3xl">
                全站运行与商业数据总览
              </h1>
              <p class="mt-3 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                这里集中查看用户增长、API Key、服务账号健康、请求量、Token 成本和响应性能，方便快速判断平台是否处于可运营状态。
              </p>
              <div class="mt-6 flex flex-wrap gap-3">
                <router-link
                  to="/admin/accounts"
                  class="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  <Icon name="server" size="sm" />
                  账号通道
                </router-link>
                <router-link
                  to="/admin/usage"
                  class="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200 dark:hover:bg-white/[0.06]"
                >
                  <Icon name="chart" size="sm" />
                  用量审计
                </router-link>
                <button
                  type="button"
                  @click="loadDashboardStats"
                  :disabled="chartsLoading"
                  class="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200 dark:hover:bg-white/[0.06]"
                >
                  <Icon name="refresh" size="sm" :class="{ 'animate-spin': chartsLoading }" />
                  {{ t('common.refresh') }}
                </button>
              </div>
            </div>

            <div class="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    平台健康度
                  </p>
                  <p class="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    {{ platformHealthScore }}%
                  </p>
                </div>
                <div
                  class="flex h-12 w-12 items-center justify-center rounded-lg"
                  :class="platformHealthScore >= 90 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400'"
                >
                  <Icon :name="platformHealthScore >= 90 ? 'checkCircle' : 'exclamationTriangle'" size="lg" />
                </div>
              </div>
              <div class="mt-5 space-y-3">
                <div v-for="item in healthItems" :key="item.label">
                  <div class="mb-1 flex items-center justify-between text-xs">
                    <span class="font-medium text-slate-600 dark:text-slate-300">{{ item.label }}</span>
                    <span class="text-slate-500 dark:text-slate-400">{{ item.value }}</span>
                  </div>
                  <div class="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                    <div
                      class="h-full rounded-full"
                      :class="item.barClass"
                      :style="{ width: `${item.percent}%` }"
                    ></div>
                  </div>
                </div>
              </div>
              <p class="mt-4 text-xs text-slate-500 dark:text-slate-400">
                运行时间 {{ uptimeLabel }}，统计{{ stats.stats_stale ? '可能延迟' : '已同步' }}
              </p>
            </div>
          </div>
        </section>

        <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div
            v-for="metric in primaryMetrics"
            :key="metric.label"
            class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0b0d10]"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <p class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ metric.label }}</p>
                <p class="mt-2 truncate text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                  {{ metric.value }}
                </p>
                <p class="mt-2 text-xs" :class="metric.hintClass">{{ metric.hint }}</p>
              </div>
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" :class="metric.iconClass">
                <Icon :name="metric.icon" size="md" :stroke-width="2" />
              </div>
            </div>
          </div>
        </section>

        <section class="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0b0d10]">
            <div class="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 class="text-base font-semibold text-slate-950 dark:text-white">关键运营指标</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  用于判断今天的调用规模、成本压力和用户活跃情况。
                </p>
              </div>
              <div class="flex flex-wrap items-center gap-3">
                <DateRangePicker
                  v-model:start-date="startDate"
                  v-model:end-date="endDate"
                  @change="onDateRangeChange"
                />
                <div class="w-28">
                  <Select
                    v-model="granularity"
                    :options="granularityOptions"
                    @change="loadChartData"
                  />
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                v-for="metric in secondaryMetrics"
                :key="metric.label"
                class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]"
              >
                <div class="flex items-center gap-3">
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" :class="metric.iconClass">
                    <Icon :name="metric.icon" size="sm" :stroke-width="2" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ metric.label }}</p>
                    <p class="mt-1 truncate text-xl font-semibold text-slate-950 dark:text-white">
                      {{ metric.value }}
                    </p>
                  </div>
                </div>
                <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">{{ metric.hint }}</p>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0b0d10]">
            <div class="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 class="text-base font-semibold text-slate-950 dark:text-white">风险与待处理</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">优先关注会影响付费用户体验的事项。</p>
              </div>
              <Icon name="shield" size="lg" class="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div class="space-y-3">
              <div
                v-for="item in riskItems"
                :key="item.label"
                class="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]"
              >
                <div class="flex min-w-0 items-center gap-3">
                  <span class="h-2.5 w-2.5 shrink-0 rounded-full" :class="item.dotClass"></span>
                  <div class="min-w-0">
                    <p class="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{{ item.label }}</p>
                    <p class="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{{ item.hint }}</p>
                  </div>
                </div>
                <span class="text-sm font-semibold" :class="item.valueClass">{{ item.value }}</span>
              </div>
            </div>
          </div>
        </section>

        <section class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0b0d10]">
            <div class="mb-4 flex items-center justify-between gap-4">
              <h2 class="text-base font-semibold text-slate-950 dark:text-white">模型与成本分布</h2>
              <span class="text-xs text-slate-500 dark:text-slate-400">{{ startDate }} - {{ endDate }}</span>
            </div>
            <ModelDistributionChart
              :model-stats="modelStats"
              :enable-ranking-view="true"
              :ranking-items="rankingItems"
              :ranking-total-actual-cost="rankingTotalActualCost"
              :ranking-total-requests="rankingTotalRequests"
              :ranking-total-tokens="rankingTotalTokens"
              :loading="chartsLoading"
              :ranking-loading="rankingLoading"
              :ranking-error="rankingError"
              :start-date="startDate"
              :end-date="endDate"
              @ranking-click="goToUserUsage"
            />
          </div>

          <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0b0d10]">
            <div class="mb-4 flex items-center justify-between gap-4">
              <h2 class="text-base font-semibold text-slate-950 dark:text-white">Token 调用趋势</h2>
              <span class="text-xs text-slate-500 dark:text-slate-400">{{ granularity === 'hour' ? '按小时' : '按天' }}</span>
            </div>
            <TokenUsageTrend :trend-data="trendData" :loading="chartsLoading" />
          </div>
        </section>

        <section class="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0b0d10]">
            <div class="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 class="text-base font-semibold text-slate-950 dark:text-white">高消耗用户趋势</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Top 12 用户 Token 消耗变化。</p>
              </div>
            </div>
            <div class="h-64">
              <div v-if="userTrendLoading" class="flex h-full items-center justify-center">
                <LoadingSpinner size="md" />
              </div>
              <Line v-else-if="userTrendChartData" :data="userTrendChartData" :options="lineOptions" />
              <div
                v-else
                class="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-400"
              >
                {{ t('admin.dashboard.noDataAvailable') }}
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0b0d10]">
            <div class="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 class="text-base font-semibold text-slate-950 dark:text-white">快捷运营入口</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">常用管理动作集中处理。</p>
              </div>
            </div>
            <div class="space-y-3">
              <router-link
                v-for="item in quickLinks"
                :key="item.path"
                :to="item.path"
                class="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
              >
                <div class="flex min-w-0 items-center gap-3">
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" :class="item.iconClass">
                    <Icon :name="item.icon" size="sm" />
                  </div>
                  <div class="min-w-0">
                    <p class="truncate text-sm font-semibold text-slate-950 dark:text-white">{{ item.label }}</p>
                    <p class="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{{ item.hint }}</p>
                  </div>
                </div>
                <Icon name="arrowRight" size="sm" class="shrink-0 text-slate-400" />
              </router-link>
            </div>
          </div>
        </section>
      </template>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const { t } = useI18n()
import { adminAPI } from '@/api/admin'
import type {
  DashboardStats,
  TrendDataPoint,
  ModelStat,
  UserUsageTrendPoint,
  UserSpendingRankingItem
} from '@/types'
import AppLayout from '@/components/layout/AppLayout.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Icon from '@/components/icons/Icon.vue'
import DateRangePicker from '@/components/common/DateRangePicker.vue'
import Select from '@/components/common/Select.vue'
import ModelDistributionChart from '@/components/charts/ModelDistributionChart.vue'
import TokenUsageTrend from '@/components/charts/TokenUsageTrend.vue'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
)

const appStore = useAppStore()
const router = useRouter()
const stats = ref<DashboardStats | null>(null)
const loading = ref(false)
const chartsLoading = ref(false)
const userTrendLoading = ref(false)
const rankingLoading = ref(false)
const rankingError = ref(false)

// Chart data
const trendData = ref<TrendDataPoint[]>([])
const modelStats = ref<ModelStat[]>([])
const userTrend = ref<UserUsageTrendPoint[]>([])
const rankingItems = ref<UserSpendingRankingItem[]>([])
const rankingTotalActualCost = ref(0)
const rankingTotalRequests = ref(0)
const rankingTotalTokens = ref(0)
let chartLoadSeq = 0
let usersTrendLoadSeq = 0
let rankingLoadSeq = 0
const rankingLimit = 12

// Helper function to format date in local timezone
const formatLocalDate = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const getLast24HoursRangeDates = (): { start: string; end: string } => {
  const end = new Date()
  const start = new Date(end.getTime() - 24 * 60 * 60 * 1000)
  return {
    start: formatLocalDate(start),
    end: formatLocalDate(end)
  }
}

// Date range
const granularity = ref<'day' | 'hour'>('hour')
const defaultRange = getLast24HoursRangeDates()
const startDate = ref(defaultRange.start)
const endDate = ref(defaultRange.end)

// Granularity options for Select component
const granularityOptions = computed(() => [
  { value: 'day', label: t('admin.dashboard.day') },
  { value: 'hour', label: t('admin.dashboard.hour') }
])

const platformHealthScore = computed(() => {
  if (!stats.value) return 0
  const accountScore = stats.value.total_accounts > 0
    ? (stats.value.normal_accounts / stats.value.total_accounts) * 50
    : 50
  const latencyScore = stats.value.average_duration_ms <= 3000 ? 25 : Math.max(8, 25 - (stats.value.average_duration_ms - 3000) / 400)
  const errorPenalty = Math.min((stats.value.error_accounts + stats.value.ratelimit_accounts + stats.value.overload_accounts) * 6, 25)
  return Math.max(0, Math.min(100, Math.round(accountScore + latencyScore + 25 - errorPenalty)))
})

const accountHealthPercent = computed(() => {
  if (!stats.value?.total_accounts) return 100
  return Math.round((stats.value.normal_accounts / stats.value.total_accounts) * 100)
})

const keyActivePercent = computed(() => {
  if (!stats.value?.total_api_keys) return 100
  return Math.round((stats.value.active_api_keys / stats.value.total_api_keys) * 100)
})

const latencyHealthPercent = computed(() => {
  if (!stats.value) return 100
  return Math.max(8, Math.min(100, Math.round(100 - stats.value.average_duration_ms / 80)))
})

const healthItems = computed(() => [
  {
    label: '服务账号正常率',
    value: `${accountHealthPercent.value}%`,
    percent: accountHealthPercent.value,
    barClass: accountHealthPercent.value >= 90 ? 'bg-emerald-500' : 'bg-amber-500'
  },
  {
    label: 'API Key 可用率',
    value: `${keyActivePercent.value}%`,
    percent: keyActivePercent.value,
    barClass: keyActivePercent.value >= 90 ? 'bg-blue-500' : 'bg-amber-500'
  },
  {
    label: '响应性能',
    value: stats.value ? formatDuration(stats.value.average_duration_ms) : '0ms',
    percent: latencyHealthPercent.value,
    barClass: latencyHealthPercent.value >= 75 ? 'bg-violet-500' : 'bg-rose-500'
  }
])

const uptimeLabel = computed(() => stats.value ? formatUptime(stats.value.uptime) : '0m')

const primaryMetrics = computed(() => {
  if (!stats.value) return []
  return [
    {
      label: '今日请求',
      value: formatNumber(stats.value.today_requests),
      hint: `累计 ${formatNumber(stats.value.total_requests)} 次`,
      icon: 'chart' as const,
      iconClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400',
      hintClass: 'text-slate-500 dark:text-slate-400'
    },
    {
      label: '今日新增用户',
      value: `+${formatNumber(stats.value.today_new_users)}`,
      hint: `总用户 ${formatNumber(stats.value.total_users)} 人`,
      icon: 'userPlus' as const,
      iconClass: 'bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400',
      hintClass: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'API Key',
      value: formatNumber(stats.value.total_api_keys),
      hint: `${formatNumber(stats.value.active_api_keys)} 个可用`,
      icon: 'key' as const,
      iconClass: 'bg-violet-50 text-violet-600 dark:bg-violet-400/10 dark:text-violet-400',
      hintClass: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      label: '服务账号',
      value: formatNumber(stats.value.total_accounts),
      hint: `${formatNumber(stats.value.normal_accounts)} 正常 / ${formatNumber(stats.value.error_accounts)} 异常`,
      icon: 'server' as const,
      iconClass: 'bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400',
      hintClass: stats.value.error_accounts > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
    }
  ]
})

const secondaryMetrics = computed(() => {
  if (!stats.value) return []
  return [
    {
      label: '今日 Token',
      value: formatTokens(stats.value.today_tokens),
      hint: `输入 ${formatTokens(stats.value.today_input_tokens)} / 输出 ${formatTokens(stats.value.today_output_tokens)}`,
      icon: 'cube' as const,
      iconClass: 'bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400'
    },
    {
      label: '今日实际扣费',
      value: `$${formatCost(stats.value.today_actual_cost)}`,
      hint: `账号成本 $${formatCost(stats.value.today_account_cost)} / 标准 $${formatCost(stats.value.today_cost)}`,
      icon: 'dollar' as const,
      iconClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400'
    },
    {
      label: '吞吐性能',
      value: `${formatTokens(stats.value.rpm)} RPM`,
      hint: `${formatTokens(stats.value.tpm)} TPM，近 5 分钟平均`,
      icon: 'bolt' as const,
      iconClass: 'bg-violet-50 text-violet-600 dark:bg-violet-400/10 dark:text-violet-400'
    },
    {
      label: '平均响应',
      value: formatDuration(stats.value.average_duration_ms),
      hint: `${formatNumber(stats.value.active_users)} 个今日活跃用户`,
      icon: 'clock' as const,
      iconClass: 'bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-400'
    }
  ]
})

const riskItems = computed(() => {
  if (!stats.value) return []
  const hasAccountRisk = stats.value.error_accounts + stats.value.ratelimit_accounts + stats.value.overload_accounts > 0
  return [
    {
      label: '异常账号',
      hint: '需要检查授权、余额或上游状态',
      value: formatNumber(stats.value.error_accounts),
      dotClass: stats.value.error_accounts > 0 ? 'bg-rose-500' : 'bg-emerald-500',
      valueClass: stats.value.error_accounts > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
    },
    {
      label: '限流账号',
      hint: '可能影响高峰期请求分发',
      value: formatNumber(stats.value.ratelimit_accounts),
      dotClass: stats.value.ratelimit_accounts > 0 ? 'bg-amber-500' : 'bg-emerald-500',
      valueClass: stats.value.ratelimit_accounts > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
    },
    {
      label: '过载账号',
      hint: '建议补充账号或调整路由策略',
      value: formatNumber(stats.value.overload_accounts),
      dotClass: stats.value.overload_accounts > 0 ? 'bg-orange-500' : 'bg-emerald-500',
      valueClass: stats.value.overload_accounts > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-emerald-600 dark:text-emerald-400'
    },
    {
      label: '整体状态',
      hint: hasAccountRisk ? '存在需要处理的账号风险' : '当前核心服务状态良好',
      value: hasAccountRisk ? '关注' : '正常',
      dotClass: hasAccountRisk ? 'bg-amber-500' : 'bg-emerald-500',
      valueClass: hasAccountRisk ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
    }
  ]
})

const quickLinks = [
  {
    label: '用户管理',
    hint: '查看用户、余额与权限',
    path: '/admin/users',
    icon: 'users' as const,
    iconClass: 'bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400'
  },
  {
    label: '服务账号',
    hint: '维护上游账号与状态',
    path: '/admin/accounts',
    icon: 'server' as const,
    iconClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400'
  },
  {
    label: '兑换码',
    hint: '生成充值或订阅兑换码',
    path: '/admin/redeem',
    icon: 'gift' as const,
    iconClass: 'bg-violet-50 text-violet-600 dark:bg-violet-400/10 dark:text-violet-400'
  },
  {
    label: '系统设置',
    hint: '站点配置、注册与支付',
    path: '/admin/settings',
    icon: 'cog' as const,
    iconClass: 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300'
  }
]

// Dark mode detection
const isDarkMode = computed(() => {
  return document.documentElement.classList.contains('dark')
})

// Chart colors
const chartColors = computed(() => ({
  text: isDarkMode.value ? '#e5e7eb' : '#374151',
  grid: isDarkMode.value ? '#374151' : '#e5e7eb'
}))

// Line chart options (for user trend chart)
const lineOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index' as const
  },
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: chartColors.value.text,
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 15,
        font: {
          size: 11
        }
      }
    },
    tooltip: {
      itemSort: (a: any, b: any) => {
        const aValue = typeof a?.raw === 'number' ? a.raw : Number(a?.parsed?.y ?? 0)
        const bValue = typeof b?.raw === 'number' ? b.raw : Number(b?.parsed?.y ?? 0)
        return bValue - aValue
      },
      callbacks: {
        label: (context: any) => {
          return `${context.dataset.label}: ${formatTokens(context.raw)}`
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: chartColors.value.grid
      },
      ticks: {
        color: chartColors.value.text,
        font: {
          size: 10
        }
      }
    },
    y: {
      grid: {
        color: chartColors.value.grid
      },
      ticks: {
        color: chartColors.value.text,
        font: {
          size: 10
        },
        callback: (value: string | number) => formatTokens(Number(value))
      }
    }
  }
}))

// User trend chart data
const userTrendChartData = computed(() => {
  if (!userTrend.value?.length) return null

  const getDisplayName = (point: UserUsageTrendPoint): string => {
    const username = point.username?.trim()
    if (username) {
      return username
    }

    const email = point.email?.trim()
    if (email) {
      return email
    }

    return t('admin.redeem.userPrefix', { id: point.user_id })
  }

  // Group by user_id to avoid merging different users with the same display name
  const userGroups = new Map<number, { name: string; data: Map<string, number> }>()
  const allDates = new Set<string>()

  userTrend.value.forEach((point) => {
    allDates.add(point.date)
    const key = point.user_id
    if (!userGroups.has(key)) {
      userGroups.set(key, { name: getDisplayName(point), data: new Map() })
    }
    userGroups.get(key)!.data.set(point.date, point.tokens)
  })

  const sortedDates = Array.from(allDates).sort()
  const colors = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
    '#14b8a6',
    '#f97316',
    '#6366f1',
    '#84cc16',
    '#06b6d4',
    '#a855f7'
  ]

  const datasets = Array.from(userGroups.values()).map((group, idx) => ({
    label: group.name,
    data: sortedDates.map((date) => group.data.get(date) || 0),
    borderColor: colors[idx % colors.length],
    backgroundColor: `${colors[idx % colors.length]}20`,
    fill: false,
    tension: 0.3
  }))

  return {
    labels: sortedDates,
    datasets
  }
})

// Format helpers
const formatTokens = (value: number | undefined): string => {
  if (value === undefined || value === null) return '0'
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`
  }
  return value.toLocaleString()
}

const formatNumber = (value: number | undefined): string => {
  return (value ?? 0).toLocaleString()
}

const formatCost = (value: number | undefined): string => {
  const amount = value ?? 0
  if (amount >= 1000) {
    return (amount / 1000).toFixed(2) + 'K'
  } else if (amount >= 1) {
    return amount.toFixed(2)
  } else if (amount >= 0.01) {
    return amount.toFixed(3)
  }
  return amount.toFixed(4)
}

const formatDuration = (ms: number | undefined): string => {
  const duration = ms ?? 0
  if (duration >= 1000) {
    return `${(duration / 1000).toFixed(2)}s`
  }
  return `${Math.round(duration)}ms`
}

const formatUptime = (seconds: number | undefined): string => {
  const totalSeconds = seconds ?? 0
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

const goToUserUsage = (item: UserSpendingRankingItem) => {
  void router.push({
    path: '/admin/usage',
    query: {
      user_id: String(item.user_id),
      start_date: startDate.value,
      end_date: endDate.value
    }
  })
}

// Date range change handler
const onDateRangeChange = (range: {
  startDate: string
  endDate: string
  preset: string | null
}) => {
  // Auto-select granularity based on date range
  const start = new Date(range.startDate)
  const end = new Date(range.endDate)
  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

  // If range is 1 day, use hourly granularity
  if (daysDiff <= 1) {
    granularity.value = 'hour'
  } else {
    granularity.value = 'day'
  }

  loadChartData()
}

// Load data
const loadDashboardSnapshot = async (includeStats: boolean) => {
  const currentSeq = ++chartLoadSeq
  if (includeStats && !stats.value) {
    loading.value = true
  }
  chartsLoading.value = true
  try {
    const response = await adminAPI.dashboard.getSnapshotV2({
      start_date: startDate.value,
      end_date: endDate.value,
      granularity: granularity.value,
      include_stats: includeStats,
      include_trend: true,
      include_model_stats: true,
      include_group_stats: false,
      include_users_trend: false
    })
    if (currentSeq !== chartLoadSeq) return
    if (includeStats && response.stats) {
      stats.value = response.stats
    }
    trendData.value = response.trend || []
    modelStats.value = response.models || []
  } catch (error) {
    if (currentSeq !== chartLoadSeq) return
    appStore.showError(t('admin.dashboard.failedToLoad'))
    console.error('Error loading dashboard snapshot:', error)
  } finally {
    if (currentSeq === chartLoadSeq) {
      loading.value = false
      chartsLoading.value = false
    }
  }
}

const loadUsersTrend = async () => {
  const currentSeq = ++usersTrendLoadSeq
  userTrendLoading.value = true
  try {
    const response = await adminAPI.dashboard.getUserUsageTrend({
      start_date: startDate.value,
      end_date: endDate.value,
      granularity: granularity.value,
      limit: 12
    })
    if (currentSeq !== usersTrendLoadSeq) return
    userTrend.value = response.trend || []
  } catch (error) {
    if (currentSeq !== usersTrendLoadSeq) return
    console.error('Error loading users trend:', error)
    userTrend.value = []
  } finally {
    if (currentSeq === usersTrendLoadSeq) {
      userTrendLoading.value = false
    }
  }
}

const loadUserSpendingRanking = async () => {
  const currentSeq = ++rankingLoadSeq
  rankingLoading.value = true
  rankingError.value = false
  try {
    const response = await adminAPI.dashboard.getUserSpendingRanking({
      start_date: startDate.value,
      end_date: endDate.value,
      limit: rankingLimit
    })
    if (currentSeq !== rankingLoadSeq) return
    rankingItems.value = response.ranking || []
    rankingTotalActualCost.value = response.total_actual_cost || 0
    rankingTotalRequests.value = response.total_requests || 0
    rankingTotalTokens.value = response.total_tokens || 0
  } catch (error) {
    if (currentSeq !== rankingLoadSeq) return
    console.error('Error loading user spending ranking:', error)
    rankingItems.value = []
    rankingTotalActualCost.value = 0
    rankingTotalRequests.value = 0
    rankingTotalTokens.value = 0
    rankingError.value = true
  } finally {
    if (currentSeq === rankingLoadSeq) {
      rankingLoading.value = false
    }
  }
}

const loadDashboardStats = async () => {
  await Promise.all([
    loadDashboardSnapshot(true),
    loadUsersTrend(),
    loadUserSpendingRanking()
  ])
}

const loadChartData = async () => {
  await Promise.all([
    loadDashboardSnapshot(false),
    loadUsersTrend(),
    loadUserSpendingRanking()
  ])
}

onMounted(() => {
  loadDashboardStats()
})
</script>

<style scoped>
</style>
