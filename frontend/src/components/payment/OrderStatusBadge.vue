<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold"
    :class="statusClass"
  >
    <span class="h-1.5 w-1.5 rounded-full" :class="dotClass"></span>
    {{ statusLabel }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { OrderStatus } from '@/types/payment'

const props = defineProps<{
  status: OrderStatus
}>()

const { t } = useI18n()

const statusMap: Record<OrderStatus, { key: string; class: string; dot: string }> = {
  PENDING: { key: 'payment.status.pending', class: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300', dot: 'bg-amber-500' },
  PAID: { key: 'payment.status.paid', class: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300', dot: 'bg-blue-500' },
  RECHARGING: { key: 'payment.status.recharging', class: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300', dot: 'bg-blue-500' },
  COMPLETED: { key: 'payment.status.completed', class: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300', dot: 'bg-emerald-500' },
  EXPIRED: { key: 'payment.status.expired', class: 'border-slate-200 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300', dot: 'bg-slate-400' },
  CANCELLED: { key: 'payment.status.cancelled', class: 'border-slate-200 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300', dot: 'bg-slate-400' },
  FAILED: { key: 'payment.status.failed', class: 'border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300', dot: 'bg-red-500' },
  REFUND_REQUESTED: { key: 'payment.status.refund_requested', class: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-400/20 dark:bg-orange-400/10 dark:text-orange-300', dot: 'bg-orange-500' },
  REFUNDING: { key: 'payment.status.refunding', class: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-400/20 dark:bg-orange-400/10 dark:text-orange-300', dot: 'bg-orange-500' },
  REFUNDED: { key: 'payment.status.refunded', class: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-300', dot: 'bg-violet-500' },
  PARTIALLY_REFUNDED: { key: 'payment.status.partially_refunded', class: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-300', dot: 'bg-violet-500' },
  REFUND_FAILED: { key: 'payment.status.refund_failed', class: 'border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300', dot: 'bg-red-500' },
}

const statusLabel = computed(() => {
  const entry = statusMap[props.status]
  return entry ? t(entry.key) : props.status
})

const statusClass = computed(() => {
  const entry = statusMap[props.status]
  return entry?.class ?? 'border-slate-200 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300'
})

const dotClass = computed(() => {
  const entry = statusMap[props.status]
  return entry?.dot ?? 'bg-slate-400'
})
</script>
