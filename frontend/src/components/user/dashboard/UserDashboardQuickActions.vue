<template>
  <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-950/5 dark:border-white/10 dark:bg-[#0b0d10]">
    <div class="border-b border-slate-100 bg-slate-50/70 px-6 py-4 dark:border-white/10 dark:bg-white/[0.03]">
      <h2 class="text-lg font-semibold text-slate-950 dark:text-white">{{ t('dashboard.quickActions') }}</h2>
      <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">常用操作集中入口</p>
    </div>
    <div class="space-y-3 p-4">
      <button @click="router.push('/keys')" class="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]">
        <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-105 dark:bg-blue-400/10 dark:text-blue-400">
          <Icon name="key" size="lg" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-slate-950 dark:text-white">{{ t('dashboard.createApiKey') }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ t('dashboard.generateNewKey') }}</p>
        </div>
        <Icon
          name="chevronRight"
          size="md"
          class="text-slate-400 transition-colors group-hover:text-blue-500 dark:text-slate-500"
        />
      </button>

      <button @click="router.push('/usage')" class="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]">
        <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-transform group-hover:scale-105 dark:bg-indigo-400/10 dark:text-indigo-400">
          <Icon name="chart" size="lg" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-slate-950 dark:text-white">{{ t('dashboard.viewUsage') }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ t('dashboard.checkDetailedLogs') }}</p>
        </div>
        <Icon
          name="chevronRight"
          size="md"
          class="text-slate-400 transition-colors group-hover:text-indigo-500 dark:text-slate-500"
        />
      </button>

      <button @click="router.push('/redeem')" class="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]">
        <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-transform group-hover:scale-105 dark:bg-amber-400/10 dark:text-amber-400">
          <Icon name="gift" size="lg" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-slate-950 dark:text-white">{{ t('dashboard.redeemCode') }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ t('dashboard.addBalanceWithCode') }}</p>
        </div>
        <Icon
          name="chevronRight"
          size="md"
          class="text-slate-400 transition-colors group-hover:text-amber-500 dark:text-slate-500"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Icon from '@/components/icons/Icon.vue'
const router = useRouter()
const { t } = useI18n()
</script>
