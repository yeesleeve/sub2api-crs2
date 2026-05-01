<template>
  <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
    <div class="text-xs text-slate-500 dark:text-slate-400">{{ label }}</div>
    <div
      :class="[
        'mt-2 break-all text-sm font-semibold',
        mono ? 'font-mono' : '',
        highlight ? 'text-emerald-600 dark:text-emerald-300' : 'text-slate-950 dark:text-white'
      ]"
    >
      {{ value }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string
  mono?: boolean
  highlight?: boolean
}>()
</script>
