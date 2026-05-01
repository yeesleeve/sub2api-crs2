<template>
  <div>
    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ t('payment.paymentMethod') }}
    </label>
    <div class="grid grid-cols-2 gap-3 sm:flex">
      <button
        v-for="method in sortedMethods"
        :key="method.type"
        type="button"
        :disabled="!method.available"
        :class="[
          'relative flex h-[60px] flex-col items-center justify-center rounded-xl border px-3 transition-all sm:flex-1',
          !method.available
            ? 'cursor-not-allowed border-gray-200 bg-gray-50 opacity-50 dark:border-dark-700 dark:bg-dark-800/50'
            : selected === method.type
              ? methodSelectedClass(method.type)
              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200 dark:hover:bg-white/[0.06]',
        ]"
        @click="method.available && emit('select', method.type)"
      >
        <span class="flex items-center gap-2">
          <img :src="methodIcon(method.type)" :alt="t(`payment.methods.${method.type}`)" class="h-7 w-7" />
          <span class="flex flex-col items-start leading-none">
            <span class="text-base font-semibold">{{ t(`payment.methods.${method.type}`) }}</span>
            <span
              v-if="method.fee_rate > 0"
              class="text-[10px] tracking-wide text-gray-500 dark:text-dark-400"
            >
              {{ t('payment.fee') }} {{ method.fee_rate }}%
            </span>
          </span>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { METHOD_ORDER } from './providerConfig'
import alipayIcon from '@/assets/icons/alipay.svg'
import wxpayIcon from '@/assets/icons/wxpay.svg'
import stripeIcon from '@/assets/icons/stripe.svg'

export interface PaymentMethodOption {
  type: string
  fee_rate: number
  available: boolean
}

const props = defineProps<{
  methods: PaymentMethodOption[]
  selected: string
}>()

const emit = defineEmits<{
  select: [type: string]
}>()

const { t } = useI18n()

const METHOD_ICONS: Record<string, string> = {
  alipay: alipayIcon,
  wxpay: wxpayIcon,
  stripe: stripeIcon,
}

const sortedMethods = computed(() => {
  const order: readonly string[] = METHOD_ORDER
  return [...props.methods].sort((a, b) => {
    const ai = order.indexOf(a.type)
    const bi = order.indexOf(b.type)
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
  })
})

function methodIcon(type: string): string {
  if (type.includes('alipay')) return METHOD_ICONS.alipay
  if (type.includes('wxpay')) return METHOD_ICONS.wxpay
  return METHOD_ICONS[type] || alipayIcon
}

function methodSelectedClass(type: string): string {
  if (type.includes('alipay')) return 'border-blue-300 bg-blue-50 text-slate-950 shadow-sm dark:border-blue-400/40 dark:bg-blue-400/10 dark:text-white'
  if (type.includes('wxpay')) return 'border-slate-400 bg-slate-100 text-slate-950 shadow-sm dark:border-white/30 dark:bg-white/10 dark:text-white'
  if (type === 'stripe') return 'border-indigo-300 bg-indigo-50 text-slate-950 shadow-sm dark:border-indigo-400/40 dark:bg-indigo-400/10 dark:text-white'
  return 'border-slate-400 bg-slate-100 text-slate-950 shadow-sm dark:border-white/30 dark:bg-white/10 dark:text-white'
}
</script>
