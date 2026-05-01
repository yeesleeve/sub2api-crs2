<template>
  <div class="empty-state">
    <div
      class="empty-state-visual"
    >
      <slot name="icon">
        <Icon
          v-if="typeof icon === 'string'"
          :name="icon as IconName"
          size="xl"
          class="empty-state-icon"
          aria-hidden="true"
        />
        <component v-else-if="icon" :is="icon" class="empty-state-icon h-10 w-10" aria-hidden="true" />
        <svg
          v-else
          class="empty-state-icon h-10 w-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </slot>
    </div>

    <!-- Title -->
    <h3 class="empty-state-title">
      {{ displayTitle }}
    </h3>

    <p v-if="displayDescription" class="empty-state-description">
      {{ displayDescription }}
    </p>

    <div v-if="actionText || $slots.action" class="mt-6">
      <slot name="action">
        <component
          :is="actionTo ? 'RouterLink' : 'button'"
          v-if="actionText"
          :to="actionTo"
          @click="!actionTo && $emit('action')"
          class="btn btn-primary"
        >
          <Icon v-if="actionIcon" :name="actionIconName" size="md" class="mr-2" />
          {{ actionText }}
        </component>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Component } from 'vue'
import Icon from '@/components/icons/Icon.vue'

const { t } = useI18n()
type IconName = InstanceType<typeof Icon>['$props']['name']

interface Props {
  icon?: Component | IconName
  title?: string
  description?: string
  actionText?: string
  actionTo?: string | object
  actionIcon?: boolean
  actionIconName?: IconName
  message?: string
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  actionIcon: true,
  actionIconName: 'plus'
})

const displayTitle = computed(() => props.title || t('common.noData'))
const displayDescription = computed(() => props.description || props.message || '')

defineEmits(['action'])
</script>
