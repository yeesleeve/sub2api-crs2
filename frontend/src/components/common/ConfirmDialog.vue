<template>
  <BaseDialog :show="show" :title="title" width="narrow" @close="handleCancel">
    <div class="flex gap-4">
      <div :class="['flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl', toneClass.iconWrap]">
        <Icon :name="danger ? 'exclamationTriangle' : icon" size="lg" :class="toneClass.icon" />
      </div>
      <div class="min-w-0 space-y-3">
        <p class="text-sm leading-6 text-slate-600 dark:text-slate-300">{{ message }}</p>
        <div v-if="hint" :class="['rounded-xl border px-3 py-2 text-xs leading-5', toneClass.hint]">
          {{ hint }}
        </div>
      </div>
      <slot></slot>
    </div>

    <template #footer>
      <div class="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
        <button
          @click="handleCancel"
          type="button"
          class="btn btn-secondary"
        >
          {{ cancelText }}
        </button>
        <button
          @click="handleConfirm"
          type="button"
          :class="[
            'btn',
            danger
              ? 'btn-danger'
              : 'btn-primary'
          ]"
        >
          {{ confirmText }}
        </button>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseDialog from './BaseDialog.vue'
import Icon from '@/components/icons/Icon.vue'

const { t } = useI18n()
type IconName = InstanceType<typeof Icon>['$props']['name']

interface Props {
  show: boolean
  title: string
  message: string
  hint?: string
  icon?: IconName
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  danger: false,
  icon: 'questionCircle'
})

const confirmText = computed(() => props.confirmText || t('common.confirm'))
const cancelText = computed(() => props.cancelText || t('common.cancel'))
const toneClass = computed(() => {
  if (props.danger) {
    return {
      iconWrap: 'bg-red-50 text-red-600 dark:bg-red-500/10',
      icon: 'text-red-600 dark:text-red-400',
      hint: 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300'
    }
  }
  return {
    iconWrap: 'bg-slate-100 text-slate-700 dark:bg-white/[0.08]',
    icon: 'text-slate-700 dark:text-slate-200',
    hint: 'border-slate-200 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300'
  }
})

const emit = defineEmits<Emits>()

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>
