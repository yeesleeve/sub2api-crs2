<template>
  <AppLayout>
    <div class="space-y-6">
      <div v-if="loading" class="flex justify-center py-12">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
      </div>

      <template v-else-if="detail">
        <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0b0d10] lg:p-6">
          <div class="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div class="min-w-0">
              <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                邀请返利
              </div>
              <h1 class="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-3xl">
                把你的邀请链接变成稳定收益
              </h1>
              <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                分享专属注册链接，被邀请用户消费后返利会进入邀请收益池，可随时转入账户余额继续使用。
              </p>

              <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div
                  v-for="card in summaryCards"
                  :key="card.label"
                  class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <div class="flex items-center justify-between gap-3">
                    <p class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ card.label }}</p>
                    <Icon :name="card.icon" size="sm" :class="card.iconClass" />
                  </div>
                  <p class="mt-3 truncate text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    {{ card.value }}
                  </p>
                  <p v-if="card.hint" class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ card.hint }}</p>
                </div>
              </div>
            </div>

            <div class="rounded-xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm dark:border-white/10 dark:bg-white">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-medium uppercase tracking-wide text-white/50 dark:text-slate-500">推广资产</p>
                  <p class="mt-2 text-3xl font-semibold tracking-tight dark:text-slate-950">
                    {{ formatCurrency(detail.aff_quota) }}
                  </p>
                  <p class="mt-2 text-sm text-white/60 dark:text-slate-500">
                    可转入余额的返利额度
                  </p>
                </div>
                <button
                  class="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800"
                  :disabled="transferring || detail.aff_quota <= 0"
                  @click="transferQuota"
                >
                  <Icon v-if="transferring" name="refresh" size="sm" class="animate-spin" />
                  <Icon v-else name="dollar" size="sm" />
                  {{ transferring ? t('affiliate.transfer.transferring') : t('affiliate.transfer.button') }}
                </button>
              </div>

              <div class="mt-6 grid grid-cols-2 gap-3">
                <div class="rounded-lg border border-white/10 bg-white/5 p-4 dark:border-slate-200 dark:bg-slate-50">
                  <p class="text-xs text-white/50 dark:text-slate-500">累计收益</p>
                  <p class="mt-2 text-lg font-semibold dark:text-slate-950">{{ formatCurrency(detail.aff_history_quota) }}</p>
                </div>
                <div class="rounded-lg border border-white/10 bg-white/5 p-4 dark:border-slate-200 dark:bg-slate-50">
                  <p class="text-xs text-white/50 dark:text-slate-500">冻结额度</p>
                  <p class="mt-2 text-lg font-semibold dark:text-slate-950">{{ formatCurrency(detail.aff_frozen_quota) }}</p>
                </div>
              </div>

              <p v-if="detail.aff_quota <= 0" class="mt-4 text-sm text-amber-200 dark:text-amber-600">
                {{ t('affiliate.transfer.empty') }}
              </p>
            </div>
          </div>
        </section>

        <section class="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0b0d10]">
            <div class="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 class="text-base font-semibold text-slate-950 dark:text-white">专属推广信息</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">复制邀请码或链接，发给你的用户。</p>
              </div>
              <Icon name="link" size="lg" class="text-emerald-600 dark:text-emerald-400" />
            </div>

            <div class="space-y-4">
              <div>
                <p class="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">{{ t('affiliate.yourCode') }}</p>
                <div class="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-white/10 dark:bg-white/[0.03]">
                  <code class="min-w-0 flex-1 truncate text-sm font-semibold text-slate-950 dark:text-white">{{ detail.aff_code }}</code>
                  <button class="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200 dark:hover:bg-white/[0.08]" @click="copyCode">
                    <Icon name="copy" size="sm" />
                    {{ t('affiliate.copyCode') }}
                  </button>
                </div>
              </div>

              <div>
                <p class="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">{{ t('affiliate.inviteLink') }}</p>
                <div class="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-white/10 dark:bg-white/[0.03]">
                  <code class="min-w-0 flex-1 truncate text-sm text-slate-600 dark:text-slate-300">{{ inviteLink }}</code>
                  <button class="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200 dark:hover:bg-white/[0.08]" @click="copyInviteLink">
                    <Icon name="copy" size="sm" />
                    {{ t('affiliate.copyLink') }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0b0d10]">
            <div class="mb-5">
              <h2 class="text-base font-semibold text-slate-950 dark:text-white">返利流程</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">完整路径更清楚，用户转化后收益也更容易追踪。</p>
            </div>
            <div class="grid gap-3 md:grid-cols-3">
              <div
                v-for="step in inviteSteps"
                :key="step.title"
                class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]"
              >
                <div class="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-semibold text-slate-950 shadow-sm dark:bg-white/10 dark:text-white">
                  {{ step.index }}
                </div>
                <p class="text-sm font-semibold text-slate-950 dark:text-white">{{ step.title }}</p>
                <p class="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{{ step.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0b0d10]">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="text-base font-semibold text-slate-950 dark:text-white">{{ t('affiliate.invitees.title') }}</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                已邀请 {{ formatCount(detail.invitees.length) }} 位用户，按贡献返利排序查看更方便。
              </p>
            </div>
            <div class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
              {{ formattedRebateRate }}% 返利比例
            </div>
          </div>

          <div v-if="detail.invitees.length === 0" class="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
            {{ t('affiliate.invitees.empty') }}
          </div>
          <div v-else class="mt-5 overflow-x-auto">
            <table class="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr class="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-white/10 dark:text-slate-400">
                  <th class="px-3 py-3 font-medium">{{ t('affiliate.invitees.columns.email') }}</th>
                  <th class="px-3 py-3 font-medium">{{ t('affiliate.invitees.columns.username') }}</th>
                  <th class="px-3 py-3 font-medium text-right">{{ t('affiliate.invitees.columns.rebate') }}</th>
                  <th class="px-3 py-3 font-medium">{{ t('affiliate.invitees.columns.joinedAt') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in detail.invitees"
                  :key="item.user_id"
                  class="border-b border-slate-100 last:border-b-0 dark:border-white/10"
                >
                  <td class="px-3 py-4 font-medium text-slate-950 dark:text-white">{{ item.email || '-' }}</td>
                  <td class="px-3 py-4 text-slate-600 dark:text-slate-300">{{ item.username || '-' }}</td>
                  <td class="px-3 py-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                    {{ formatCurrency(item.total_rebate) }}
                  </td>
                  <td class="px-3 py-4 text-slate-600 dark:text-slate-300">{{ formatDateTime(item.created_at) || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/layout/AppLayout.vue'
import Icon from '@/components/icons/Icon.vue'
import userAPI from '@/api/user'
import type { UserAffiliateDetail } from '@/types'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { useClipboard } from '@/composables/useClipboard'
import { formatCurrency, formatDateTime } from '@/utils/format'
import { extractApiErrorMessage } from '@/utils/apiError'

const { t } = useI18n()
const appStore = useAppStore()
const authStore = useAuthStore()
const { copyToClipboard } = useClipboard()

const loading = ref(true)
const transferring = ref(false)
const detail = ref<UserAffiliateDetail | null>(null)

const inviteLink = computed(() => {
  if (!detail.value) return ''
  if (typeof window === 'undefined') return `/register?aff=${encodeURIComponent(detail.value.aff_code)}`
  return `${window.location.origin}/register?aff=${encodeURIComponent(detail.value.aff_code)}`
})

const formattedRebateRate = computed(() => {
  const value = detail.value?.effective_rebate_rate_percent ?? 0
  const rounded = Math.round(value * 100) / 100
  return Number.isInteger(rounded) ? String(rounded) : rounded.toString()
})

const summaryCards = computed(() => {
  const data = detail.value
  if (!data) return []
  return [
    {
      label: '返利比例',
      value: `${formattedRebateRate.value}%`,
      hint: t('affiliate.stats.rebateRateHint'),
      icon: 'dollar' as const,
      iconClass: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      label: '邀请用户',
      value: formatCount(data.aff_count),
      hint: '累计注册人数',
      icon: 'users' as const,
      iconClass: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: '可用额度',
      value: formatCurrency(data.aff_quota),
      hint: '可立即转入余额',
      icon: 'creditCard' as const,
      iconClass: 'text-violet-600 dark:text-violet-400'
    },
    {
      label: '累计额度',
      value: formatCurrency(data.aff_history_quota),
      hint: data.aff_frozen_quota > 0 ? `冻结 ${formatCurrency(data.aff_frozen_quota)}` : '历史返利总额',
      icon: 'chart' as const,
      iconClass: 'text-amber-600 dark:text-amber-400'
    }
  ]
})

const inviteSteps = [
  { index: '01', title: '复制链接', description: '将你的邀请码或注册链接分享给用户，链接会自动带上邀请参数。' },
  { index: '02', title: '用户消费', description: '被邀请用户完成注册并产生付费或额度消耗后，系统记录返利。' },
  { index: '03', title: '转入余额', description: '可用返利额度可以转入账户余额，用于继续调用 AI 服务。' }
]

function formatCount(value: number): string {
  return value.toLocaleString()
}

async function loadAffiliateDetail(silent = false): Promise<void> {
  if (!silent) {
    loading.value = true
  }
  try {
    detail.value = await userAPI.getAffiliateDetail()
  } catch (error) {
    appStore.showError(extractApiErrorMessage(error, t('affiliate.loadFailed')))
  } finally {
    if (!silent) {
      loading.value = false
    }
  }
}

async function copyCode(): Promise<void> {
  if (!detail.value?.aff_code) return
  await copyToClipboard(detail.value.aff_code, t('affiliate.codeCopied'))
}

async function copyInviteLink(): Promise<void> {
  if (!inviteLink.value) return
  await copyToClipboard(inviteLink.value, t('affiliate.linkCopied'))
}

async function transferQuota(): Promise<void> {
  if (!detail.value || detail.value.aff_quota <= 0 || transferring.value) return
  transferring.value = true
  try {
    const resp = await userAPI.transferAffiliateQuota()
    appStore.showSuccess(t('affiliate.transfer.success', { amount: formatCurrency(resp.transferred_quota) }))
    await Promise.all([
      loadAffiliateDetail(true),
      authStore.refreshUser().catch(() => undefined),
    ])
  } catch (error) {
    appStore.showError(extractApiErrorMessage(error, t('affiliate.transferFailed')))
  } finally {
    transferring.value = false
  }
}

onMounted(() => {
  void loadAffiliateDetail()
})
</script>
