<template>
  <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-950/5 dark:border-white/10 dark:bg-[#0b0d10]">
    <div class="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4 dark:border-white/10 dark:bg-white/[0.03]">
      <div>
        <h2 class="text-lg font-semibold text-slate-950 dark:text-white">{{ t('dashboard.recentUsage') }}</h2>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">最近模型请求、Token 和成本记录</p>
      </div>
      <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">{{ t('dashboard.last7Days') }}</span>
    </div>
    <div class="p-6">
      <div v-if="loading" class="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
      <div v-else-if="data.length === 0" class="py-8">
        <EmptyState :title="t('dashboard.noUsageRecords')" :description="t('dashboard.startUsingApi')" />
      </div>
      <div v-else class="space-y-3">
        <div v-for="log in data" :key="log.id" class="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-white hover:shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]">
          <div class="flex items-center gap-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-sm dark:bg-blue-400/10 dark:text-blue-400">
              <Icon name="beaker" size="md" />
            </div>
            <div>
              <p class="text-sm font-semibold text-slate-950 dark:text-white">{{ log.model }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ formatDateTime(log.created_at) }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-semibold">
              <span class="text-blue-600 dark:text-blue-400" :title="t('dashboard.actual')">${{ formatCost(log.actual_cost) }}</span>
              <span class="font-normal text-gray-400 dark:text-gray-500" :title="t('dashboard.standard')"> / ${{ formatCost(log.total_cost) }}</span>
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ (log.input_tokens + log.output_tokens).toLocaleString() }} tokens</p>
          </div>
        </div>

        <router-link to="/usage" class="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-400/10 dark:hover:text-blue-300">
          {{ t('dashboard.viewAllUsage') }}
          <Icon name="arrowRight" size="sm" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import Icon from '@/components/icons/Icon.vue'
import { formatDateTime } from '@/utils/format'
import type { UsageLog } from '@/types'

defineProps<{
  data: UsageLog[]
  loading: boolean
}>()
const { t } = useI18n()
const formatCost = (c: number) => c.toFixed(4)
</script>
