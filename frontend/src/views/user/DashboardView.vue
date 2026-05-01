<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5 dark:border-white/10 dark:bg-[#0b0d10]">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div class="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300">
              <span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
              账户运行概览
            </div>
            <h2 class="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
              欢迎回来，{{ displayName }}
            </h2>
            <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              这里汇总你的余额、API Key、调用量、Token 消耗和模型分布，方便快速判断今天的使用状态。
            </p>
          </div>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:w-[440px]">
            <router-link
              to="/keys"
              class="rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
            >
              <Icon name="key" size="sm" class="text-blue-600 dark:text-blue-400" />
              <div class="mt-3 text-sm font-semibold text-slate-950 dark:text-white">API Key</div>
              <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">创建与管理</div>
            </router-link>
            <router-link
              to="/usage"
              class="rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
            >
              <Icon name="chart" size="sm" class="text-indigo-600 dark:text-indigo-400" />
              <div class="mt-3 text-sm font-semibold text-slate-950 dark:text-white">用量明细</div>
              <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">请求与成本</div>
            </router-link>
            <router-link
              to="/monitor"
              class="rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
            >
              <Icon name="shield" size="sm" class="text-violet-600 dark:text-violet-400" />
              <div class="mt-3 text-sm font-semibold text-slate-950 dark:text-white">通道状态</div>
              <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">健康监控</div>
            </router-link>
          </div>
        </div>
      </div>

      <div class="grid gap-4 lg:grid-cols-3">
        <div
          v-for="panel in insightPanels"
          :key="panel.title"
          class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5 dark:border-white/10 dark:bg-[#0b0d10]"
        >
          <div class="mb-4 flex items-center justify-between">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl" :class="panel.iconClass">
              <Icon :name="panel.icon" size="md" />
            </div>
            <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500 dark:bg-white/10 dark:text-slate-400">
              {{ panel.badge }}
            </span>
          </div>
          <h3 class="text-sm font-semibold text-slate-950 dark:text-white">{{ panel.title }}</h3>
          <p class="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{{ panel.description }}</p>
        </div>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-12"><LoadingSpinner /></div>
      <template v-else-if="stats">
        <UserDashboardStats :stats="stats" :balance="user?.balance || 0" :is-simple="authStore.isSimpleMode" />
        <UserDashboardCharts v-model:startDate="startDate" v-model:endDate="endDate" v-model:granularity="granularity" :loading="loadingCharts" :trend="trendData" :models="modelStats" @dateRangeChange="loadCharts" @granularityChange="loadCharts" @refresh="refreshAll" />
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div class="lg:col-span-2"><UserDashboardRecentUsage :data="recentUsage" :loading="loadingUsage" /></div>
          <div class="lg:col-span-1"><UserDashboardQuickActions /></div>
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'; import { useAuthStore } from '@/stores/auth'; import { usageAPI, type UserDashboardStats as UserStatsType } from '@/api/usage'
import AppLayout from '@/components/layout/AppLayout.vue'; import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import UserDashboardStats from '@/components/user/dashboard/UserDashboardStats.vue'; import UserDashboardCharts from '@/components/user/dashboard/UserDashboardCharts.vue'
import UserDashboardRecentUsage from '@/components/user/dashboard/UserDashboardRecentUsage.vue'; import UserDashboardQuickActions from '@/components/user/dashboard/UserDashboardQuickActions.vue'
import Icon from '@/components/icons/Icon.vue'
import type { UsageLog, TrendDataPoint, ModelStat } from '@/types'

const authStore = useAuthStore(); const user = computed(() => authStore.user)
const displayName = computed(() => user.value?.username || user.value?.email?.split('@')[0] || '用户')
const stats = ref<UserStatsType | null>(null); const loading = ref(false); const loadingUsage = ref(false); const loadingCharts = ref(false)
const trendData = ref<TrendDataPoint[]>([]); const modelStats = ref<ModelStat[]>([]); const recentUsage = ref<UsageLog[]>([])
const insightPanels = [
  {
    title: '调用入口建议',
    description: '优先使用独立 API Key 区分项目，后续排查成本、模型和调用异常会更清晰。',
    badge: 'Keys',
    icon: 'key',
    iconClass: 'bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400'
  },
  {
    title: '成本观察',
    description: '定期查看模型分布和 Token 趋势，及时发现异常请求或高成本模型。',
    badge: 'Cost',
    icon: 'calculator',
    iconClass: 'bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400'
  },
  {
    title: '通道选择',
    description: '在可用通道页查看模型能力矩阵，根据任务类型选择更合适的模型池。',
    badge: 'Models',
    icon: 'cpu',
    iconClass: 'bg-violet-50 text-violet-600 dark:bg-violet-400/10 dark:text-violet-400'
  }
] as const

const formatLD = (d: Date) => d.toISOString().split('T')[0]
const startDate = ref(formatLD(new Date(Date.now() - 6 * 86400000))); const endDate = ref(formatLD(new Date())); const granularity = ref('day')

const loadStats = async () => { loading.value = true; try { await authStore.refreshUser(); stats.value = await usageAPI.getDashboardStats() } catch (error) { console.error('Failed to load dashboard stats:', error) } finally { loading.value = false } }
const loadCharts = async () => { loadingCharts.value = true; try { const res = await Promise.all([usageAPI.getDashboardTrend({ start_date: startDate.value, end_date: endDate.value, granularity: granularity.value as any }), usageAPI.getDashboardModels({ start_date: startDate.value, end_date: endDate.value })]); trendData.value = res[0].trend || []; modelStats.value = res[1].models || [] } catch (error) { console.error('Failed to load charts:', error) } finally { loadingCharts.value = false } }
const loadRecent = async () => { loadingUsage.value = true; try { const res = await usageAPI.getByDateRange(startDate.value, endDate.value); recentUsage.value = res.items.slice(0, 5) } catch (error) { console.error('Failed to load recent usage:', error) } finally { loadingUsage.value = false } }
const refreshAll = () => { loadStats(); loadCharts(); loadRecent() }

onMounted(() => { refreshAll() })
</script>
