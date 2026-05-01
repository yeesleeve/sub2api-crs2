<template>
  <div class="space-y-4">
    <!-- Row 1: Core Stats -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <!-- Balance -->
      <div v-if="!isSimple" class="metric-card">
        <div class="flex items-center gap-3">
          <div class="metric-icon bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
            <svg class="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
          </div>
          <div>
            <p class="metric-label">{{ t('dashboard.balance') }}</p>
            <p class="metric-value text-blue-600 dark:text-blue-400">${{ formatBalance(balance) }}</p>
            <p class="metric-hint">{{ t('common.available') }}</p>
          </div>
        </div>
      </div>

    <!-- API Keys -->
      <div class="metric-card">
      <div class="flex items-center gap-3">
        <div class="metric-icon bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
          <Icon name="key" size="md" class="text-blue-600 dark:text-blue-400" :stroke-width="2" />
        </div>
        <div>
          <p class="metric-label">{{ t('dashboard.apiKeys') }}</p>
          <p class="metric-value">{{ stats?.total_api_keys || 0 }}</p>
          <p class="metric-hint text-blue-600 dark:text-blue-400">{{ stats?.active_api_keys || 0 }} {{ t('common.active') }}</p>
        </div>
      </div>
    </div>

    <!-- Today Requests -->
      <div class="metric-card">
      <div class="flex items-center gap-3">
        <div class="metric-icon bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-400">
          <Icon name="chart" size="md" class="text-sky-600 dark:text-sky-400" :stroke-width="2" />
        </div>
        <div>
          <p class="metric-label">{{ t('dashboard.todayRequests') }}</p>
          <p class="metric-value">{{ stats?.today_requests || 0 }}</p>
          <p class="metric-hint">{{ t('common.total') }}: {{ formatNumber(stats?.total_requests || 0) }}</p>
        </div>
      </div>
    </div>

    <!-- Today Cost -->
      <div class="metric-card">
      <div class="flex items-center gap-3">
        <div class="metric-icon bg-violet-50 text-violet-600 dark:bg-violet-400/10 dark:text-violet-400">
          <Icon name="dollar" size="md" class="text-purple-600 dark:text-purple-400" :stroke-width="2" />
        </div>
        <div>
          <p class="metric-label">{{ t('dashboard.todayCost') }}</p>
          <p class="metric-value">
            <span class="text-purple-600 dark:text-purple-400" :title="t('dashboard.actual')">${{ formatCost(stats?.today_actual_cost || 0) }}</span>
            <span class="text-sm font-normal text-gray-400 dark:text-gray-500" :title="t('dashboard.standard')"> / ${{ formatCost(stats?.today_cost || 0) }}</span>
          </p>
          <p class="metric-hint">
            <span class="text-gray-500 dark:text-gray-400">{{ t('common.total') }}: </span>
            <span class="text-purple-600 dark:text-purple-400" :title="t('dashboard.actual')">${{ formatCost(stats?.total_actual_cost || 0) }}</span>
            <span class="text-gray-400 dark:text-gray-500" :title="t('dashboard.standard')"> / ${{ formatCost(stats?.total_cost || 0) }}</span>
          </p>
        </div>
      </div>
    </div>
    </div>

    <!-- Row 2: Token Stats -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <!-- Today Tokens -->
    <div class="metric-card">
      <div class="flex items-center gap-3">
        <div class="metric-icon bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400">
          <Icon name="cube" size="md" class="text-amber-600 dark:text-amber-400" :stroke-width="2" />
        </div>
        <div>
          <p class="metric-label">{{ t('dashboard.todayTokens') }}</p>
          <p class="metric-value">{{ formatTokens(stats?.today_tokens || 0) }}</p>
          <p class="metric-hint">{{ t('dashboard.input') }}: {{ formatTokens(stats?.today_input_tokens || 0) }} / {{ t('dashboard.output') }}: {{ formatTokens(stats?.today_output_tokens || 0) }}</p>
        </div>
      </div>
    </div>

    <!-- Total Tokens -->
    <div class="metric-card">
      <div class="flex items-center gap-3">
        <div class="metric-icon bg-indigo-50 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400">
          <Icon name="database" size="md" class="text-indigo-600 dark:text-indigo-400" :stroke-width="2" />
        </div>
        <div>
          <p class="metric-label">{{ t('dashboard.totalTokens') }}</p>
          <p class="metric-value">{{ formatTokens(stats?.total_tokens || 0) }}</p>
          <p class="metric-hint">{{ t('dashboard.input') }}: {{ formatTokens(stats?.total_input_tokens || 0) }} / {{ t('dashboard.output') }}: {{ formatTokens(stats?.total_output_tokens || 0) }}</p>
        </div>
      </div>
    </div>

    <!-- Performance (RPM/TPM) -->
    <div class="metric-card">
      <div class="flex items-center gap-3">
        <div class="metric-icon bg-violet-50 text-violet-600 dark:bg-violet-400/10 dark:text-violet-400">
          <Icon name="bolt" size="md" class="text-violet-600 dark:text-violet-400" :stroke-width="2" />
        </div>
        <div class="flex-1">
          <p class="metric-label">{{ t('dashboard.performance') }}</p>
          <div class="flex items-baseline gap-2">
            <p class="metric-value">{{ formatTokens(stats?.rpm || 0) }}</p>
            <span class="text-xs text-gray-500 dark:text-gray-400">RPM</span>
          </div>
          <div class="flex items-baseline gap-2">
            <p class="text-sm font-semibold text-violet-600 dark:text-violet-400">{{ formatTokens(stats?.tpm || 0) }}</p>
            <span class="text-xs text-gray-500 dark:text-gray-400">TPM</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Avg Response Time -->
    <div class="metric-card">
      <div class="flex items-center gap-3">
        <div class="metric-icon bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-400">
          <Icon name="clock" size="md" class="text-rose-600 dark:text-rose-400" :stroke-width="2" />
        </div>
        <div>
          <p class="metric-label">{{ t('dashboard.avgResponse') }}</p>
          <p class="metric-value">{{ formatDuration(stats?.average_duration_ms || 0) }}</p>
          <p class="metric-hint">{{ t('dashboard.averageTime') }}</p>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Icon from '@/components/icons/Icon.vue'
import type { UserDashboardStats as UserStatsType } from '@/api/usage'

defineProps<{
  stats: UserStatsType
  balance: number
  isSimple: boolean
}>()
const { t } = useI18n()

const formatBalance = (b: number) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(b)

const formatNumber = (n: number) => n.toLocaleString()
const formatCost = (c: number) => c.toFixed(4)
const formatTokens = (t: number) => {
  if (t >= 1_000_000) return `${(t / 1_000_000).toFixed(1)}M`
  if (t >= 1000) return `${(t / 1000).toFixed(1)}K`
  return t.toString()
}
const formatDuration = (ms: number) => ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${ms.toFixed(0)}ms`
</script>

<style scoped>
.metric-card {
  @apply rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-white/10 dark:bg-[#0b0d10] dark:shadow-black/20 dark:hover:border-white/20;
}

.metric-icon {
  @apply flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm;
}

.metric-label {
  @apply text-xs font-medium text-slate-500 dark:text-slate-400;
}

.metric-value {
  @apply mt-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white;
}

.metric-hint {
  @apply mt-1 text-xs text-slate-500 dark:text-slate-400;
}
</style>
