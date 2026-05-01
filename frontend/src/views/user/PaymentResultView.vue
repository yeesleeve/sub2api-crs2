<template>
  <div class="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 dark:bg-[#050607] dark:text-white sm:py-12">
    <div class="mx-auto w-full max-w-3xl">
      <button type="button" class="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white" @click="router.push('/home')">
        <Icon name="arrowLeft" size="sm" />
        返回首页
      </button>

      <div v-if="loading" class="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-white/10 dark:bg-[#0b0d10]">
        <div class="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-900 border-t-transparent dark:border-white dark:border-t-transparent"></div>
        <p class="mt-4 text-sm text-slate-500 dark:text-slate-400">正在核对支付结果，请稍候...</p>
      </div>
      <template v-else>
        <section class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-950/5 dark:border-white/10 dark:bg-[#0b0d10] dark:shadow-black/30">
          <div :class="['border-b px-6 py-7 text-center dark:border-white/10 sm:px-8', resultHeaderClass]">
            <div :class="['mx-auto flex h-20 w-20 items-center justify-center rounded-2xl shadow-sm', resultIconWrapClass]">
              <Icon v-if="isSuccess" name="checkCircle" size="xl" class="h-10 w-10" />
              <div v-else-if="isPending" class="h-10 w-10 animate-spin rounded-full border-4 border-current border-t-transparent"></div>
              <Icon v-else name="xCircle" size="xl" class="h-10 w-10" />
            </div>
            <h1 class="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
              {{ statusTitle }}
            </h1>
            <p class="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              {{ resultDescription }}
            </p>
          </div>

          <div class="p-5 sm:p-7">
            <div v-if="order" class="grid gap-3 sm:grid-cols-2">
              <InfoRow :label="t('payment.orders.orderId')" :value="'#' + order.id" />
              <InfoRow v-if="order.out_trade_no" :label="t('payment.orders.orderNo')" :value="order.out_trade_no" mono />
              <InfoRow :label="t('payment.orders.baseAmount')" :value="'¥' + baseAmount.toFixed(2)" />
              <InfoRow v-if="order.fee_rate > 0" :label="`${t('payment.orders.fee')} (${order.fee_rate}%)`" :value="'¥' + feeAmount.toFixed(2)" />
              <InfoRow :label="t('payment.orders.payAmount')" :value="'¥' + order.pay_amount.toFixed(2)" highlight />
              <InfoRow v-if="order.amount !== order.pay_amount" :label="t('payment.orders.creditedAmount')" :value="(order.order_type === 'balance' ? '$' : '¥') + order.amount.toFixed(2)" />
              <InfoRow :label="t('payment.orders.paymentMethod')" :value="t(paymentMethodI18nKey(order.payment_type), normalizedOrderPaymentType(order.payment_type))" />
              <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                <div class="text-xs text-slate-500 dark:text-slate-400">{{ t('payment.orders.status') }}</div>
                <div class="mt-2"><OrderStatusBadge :status="order.status" /></div>
              </div>
            </div>

            <div v-else-if="returnInfo" class="grid gap-3 sm:grid-cols-2">
              <InfoRow v-if="returnInfo.outTradeNo" :label="t('payment.orders.orderId')" :value="returnInfo.outTradeNo" mono />
              <InfoRow v-if="returnInfo.money" :label="t('payment.orders.payAmount')" :value="'¥' + returnInfo.money" highlight />
              <InfoRow v-if="returnInfo.type" :label="t('payment.orders.paymentMethod')" :value="t(paymentMethodI18nKey(returnInfo.type), normalizedOrderPaymentType(returnInfo.type))" />
            </div>

            <div v-if="!isSuccess" :class="['mt-5 rounded-2xl border px-4 py-3 text-sm leading-6', resultNoticeClass]">
              <strong class="font-semibold">{{ resultNoticeTitle }}</strong>
              <span class="ml-1">{{ resultNoticeText }}</span>
            </div>

            <div class="mt-6 flex flex-col gap-3 sm:flex-row">
              <button class="btn btn-secondary flex-1" @click="router.push('/purchase')">
                <Icon name="creditCard" size="md" />
                {{ t('payment.result.backToRecharge') }}
              </button>
              <button class="btn btn-primary flex-1" @click="router.push('/orders')">
                <Icon name="document" size="md" />
                {{ t('payment.result.viewOrders') }}
              </button>
            </div>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import OrderStatusBadge from '@/components/payment/OrderStatusBadge.vue'
import Icon from '@/components/icons/Icon.vue'
import InfoRow from '@/components/payment/PaymentResultInfoRow.vue'
import {
  PAYMENT_RECOVERY_STORAGE_KEY,
  clearPaymentRecoverySnapshot,
  readPaymentRecoverySnapshot,
} from '@/components/payment/paymentFlow'
import { usePaymentStore } from '@/stores/payment'
import { paymentAPI } from '@/api/payment'
import type { PaymentOrder } from '@/types/payment'
import { normalizePaymentMethodForDisplay, paymentMethodI18nKey } from './paymentUx'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const paymentStore = usePaymentStore()

const order = ref<PaymentOrder | null>(null)
const loading = ref(true)

interface ReturnInfo {
  outTradeNo: string
  money: string
  type: string
  tradeStatus: string
}
const returnInfo = ref<ReturnInfo | null>(null)

const SUCCESS_STATUSES = new Set(['COMPLETED', 'PAID', 'RECHARGING'])
const PENDING_STATUSES = new Set(['PENDING', 'CREATED', 'WAITING', 'PROCESSING'])
const STATUS_REFRESH_INTERVAL_MS = 2000
const STATUS_REFRESH_MAX_ATTEMPTS = 15

let statusRefreshTimer: ReturnType<typeof setTimeout> | null = null
const refreshAttempts = ref(0)

/** 充值金额 = pay_amount / (1 + fee_rate/100)，fee_rate=0 时等于 pay_amount */
const baseAmount = computed(() => {
  if (!order.value || order.value.fee_rate <= 0) return order.value?.pay_amount ?? 0
  return Math.round((order.value.pay_amount / (1 + order.value.fee_rate / 100)) * 100) / 100
})

/** 手续费 = pay_amount - baseAmount */
const feeAmount = computed(() => {
  if (!order.value || order.value.fee_rate <= 0) return 0
  return Math.round((order.value.pay_amount - baseAmount.value) * 100) / 100
})

const isSuccess = computed(() => {
  return isSuccessStatus(order.value?.status)
})

const isPending = computed(() => {
  return isPendingStatus(order.value?.status)
})

const statusTitle = computed(() => {
  if (isSuccess.value) {
    return t('payment.result.success')
  }
  if (isPending.value) {
    return t('payment.result.processing')
  }
  return t('payment.result.failed')
})

const resultDescription = computed(() => {
  if (isSuccess.value) return '支付已完成，系统会自动把额度或订阅权益同步到你的账户。'
  if (isPending.value) return t('payment.result.processingHint')
  return '支付未完成或同步失败，请先核对付款状态，再根据下方提示继续处理。'
})

const resultHeaderClass = computed(() => {
  if (isSuccess.value) return 'border-emerald-100 bg-emerald-50/80 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300'
  if (isPending.value) return 'border-amber-100 bg-amber-50/80 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300'
  return 'border-red-100 bg-red-50/80 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300'
})

const resultIconWrapClass = computed(() => {
  if (isSuccess.value) return 'bg-white text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300'
  if (isPending.value) return 'bg-white text-amber-600 dark:bg-amber-400/10 dark:text-amber-300'
  return 'bg-white text-red-600 dark:bg-red-400/10 dark:text-red-300'
})

const resultNoticeClass = computed(() => {
  if (isPending.value) return 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200'
  return 'border-red-200 bg-red-50 text-red-800 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200'
})

const resultNoticeTitle = computed(() => (isPending.value ? '正在同步：' : '处理建议：'))
const resultNoticeText = computed(() => {
  if (isPending.value) return '请不要重复支付同一订单。稍等 10-30 秒后刷新订单页，或等待系统自动完成。'
  return '如果你已经扣款但订单失败，请保存订单号并联系客服核对；如果未扣款，可返回充值页重新创建订单。'
})

function normalizedOrderPaymentType(paymentType: string): string {
  return normalizePaymentMethodForDisplay(paymentType) || paymentType
}

function normalizeOrderStatus(status: string | null | undefined): string {
  return String(status || '').trim().toUpperCase()
}

function isSuccessStatus(status: string | null | undefined): boolean {
  return SUCCESS_STATUSES.has(normalizeOrderStatus(status))
}

function isPendingStatus(status: string | null | undefined): boolean {
  return PENDING_STATUSES.has(normalizeOrderStatus(status))
}

function readRouteQueryString(key: string): string {
  const value = route.query[key]
  if (Array.isArray(value)) {
    return typeof value[0] === 'string' ? value[0] : ''
  }
  return typeof value === 'string' ? value : ''
}

function restoreRecoverySnapshot(context: {
  resumeToken: string
  routeOrderId: number
  routeOutTradeNo: string
}) {
  if (typeof window === 'undefined') {
    return null
  }

  const rawSnapshot = window.localStorage.getItem(PAYMENT_RECOVERY_STORAGE_KEY)
  if (!rawSnapshot) {
    return null
  }

  if (context.resumeToken) {
    return readPaymentRecoverySnapshot(rawSnapshot, {
      resumeToken: context.resumeToken,
    })
  }

  if (!context.routeOrderId && !context.routeOutTradeNo) {
    return null
  }

  const restored = readPaymentRecoverySnapshot(rawSnapshot)
  if (!restored) {
    return null
  }

  if (context.routeOrderId > 0 && restored.orderId !== context.routeOrderId) {
    return null
  }

  if (context.routeOutTradeNo && restored.outTradeNo !== context.routeOutTradeNo) {
    return null
  }

  return restored
}

async function resolveOrderFromResumeToken(resumeToken: string): Promise<PaymentOrder | null> {
  try {
    const result = await paymentAPI.resolveOrderPublicByResumeToken(resumeToken)
    return result.data
  } catch (_err: unknown) {
    return null
  }
}

async function resolveOrderFromOutTradeNo(outTradeNo: string): Promise<PaymentOrder | null> {
  try {
    const result = await paymentAPI.verifyOrderPublic(outTradeNo)
    return result.data
  } catch (_err: unknown) {
    return null
  }
}

function clearStatusRefreshTimer(): void {
  if (statusRefreshTimer !== null) {
    clearTimeout(statusRefreshTimer)
    statusRefreshTimer = null
  }
}

function clearRecoverySnapshot(): void {
  if (typeof window === 'undefined') return
  clearPaymentRecoverySnapshot(window.localStorage, PAYMENT_RECOVERY_STORAGE_KEY)
}

function clearRecoverySnapshotForTerminalStatus(status: string | null | undefined): void {
  if (!status) return
  if (!isPendingStatus(status)) {
    clearRecoverySnapshot()
  }
}

function scheduleStatusRefresh(refreshOrder: (() => Promise<PaymentOrder | null>) | null): void {
  clearStatusRefreshTimer()
  if (!refreshOrder || !isPending.value || refreshAttempts.value >= STATUS_REFRESH_MAX_ATTEMPTS) {
    return
  }

  statusRefreshTimer = setTimeout(async () => {
    refreshAttempts.value += 1
    const refreshedOrder = await refreshOrder()
    if (refreshedOrder) {
      order.value = refreshedOrder
      clearRecoverySnapshotForTerminalStatus(refreshedOrder.status)
    }

    if (isPendingStatus(order.value?.status)) {
      scheduleStatusRefresh(refreshOrder)
    }
  }, STATUS_REFRESH_INTERVAL_MS)
}

onMounted(async () => {
  const resumeToken = readRouteQueryString('resume_token')
  const routeOrderId = Number(readRouteQueryString('order_id')) || 0
  let outTradeNo = readRouteQueryString('out_trade_no')
  let orderId = 0
  let resumeTokenLookupFailed = false

  const restored = restoreRecoverySnapshot({
    resumeToken,
    routeOrderId,
    routeOutTradeNo: outTradeNo,
  })
  if (restored?.orderId) {
    orderId = restored.orderId
  }
  if (!outTradeNo && restored?.outTradeNo) {
    outTradeNo = restored.outTradeNo
  }

  if (resumeToken) {
    const resolvedOrder = await resolveOrderFromResumeToken(resumeToken)
    if (resolvedOrder) {
      order.value = resolvedOrder
      if (!orderId) {
        orderId = resolvedOrder.id
      }
    } else if (routeOrderId > 0) {
      resumeTokenLookupFailed = true
      orderId = routeOrderId
    } else {
      resumeTokenLookupFailed = true
    }
  } else if (routeOrderId > 0) {
    orderId = routeOrderId
  }

  const hasLegacyFallbackContext = readRouteQueryString('trade_status').trim() !== ''
  const shouldUsePublicOutTradeNo = outTradeNo !== '' && (hasLegacyFallbackContext || routeOrderId > 0 || orderId > 0)

  if (!order.value && orderId && (!resumeToken || routeOrderId > 0)) {
    try {
      order.value = await paymentStore.pollOrderStatus(orderId)
    } catch (_err: unknown) {
      // Order lookup failed, will try legacy fallback below when possible.
    }
  }

  if (!order.value && shouldUsePublicOutTradeNo && (!resumeToken || resumeTokenLookupFailed)) {
    const legacyOrder = await resolveOrderFromOutTradeNo(outTradeNo)
    if (legacyOrder) {
      order.value = legacyOrder
      if (!orderId) {
        orderId = legacyOrder.id
      }
    }
  }

  if (!order.value && !orderId && outTradeNo && hasLegacyFallbackContext) {
    returnInfo.value = {
      outTradeNo,
      money: String(route.query.money || ''),
      type: String(route.query.type || ''),
      tradeStatus: String(route.query.trade_status || ''),
    }
  }

  const refreshOrder = async (): Promise<PaymentOrder | null> => {
    if (resumeToken) {
      const resolvedOrder = await resolveOrderFromResumeToken(resumeToken)
      if (resolvedOrder) {
        return resolvedOrder
      }
    }

    if (orderId) {
      try {
        return await paymentStore.pollOrderStatus(orderId)
      } catch (_err: unknown) {
        // Fall through to legacy public verification when order polling is unavailable.
      }
    }

    if (shouldUsePublicOutTradeNo) {
      return await resolveOrderFromOutTradeNo(outTradeNo)
    }

    return null
  }

  if (isPendingStatus(order.value?.status)) {
    scheduleStatusRefresh(refreshOrder)
  } else if (order.value) {
    clearRecoverySnapshotForTerminalStatus(order.value.status)
  } else if (returnInfo.value) {
    clearRecoverySnapshot()
  }
  loading.value = false
})

onBeforeUnmount(() => {
  clearStatusRefreshTimer()
})
</script>
