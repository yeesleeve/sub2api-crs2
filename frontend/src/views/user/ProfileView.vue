<template>
  <AppLayout>
    <div data-testid="profile-shell" class="space-y-4 sm:space-y-6">
      <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0b0d10] sm:p-5 lg:p-6">
        <div class="grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:gap-6">
          <div class="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
            <div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-950 text-xl font-semibold text-white shadow-sm dark:bg-white dark:text-slate-950 sm:h-20 sm:w-20 sm:text-2xl">
              <img v-if="avatarUrl" :src="avatarUrl" :alt="displayName" class="h-full w-full object-cover" />
              <span v-else>{{ avatarInitial }}</span>
            </div>
            <div class="min-w-0">
              <div class="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                账户中心
              </div>
              <h1 class="truncate text-2xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-3xl">
                {{ displayName }}
              </h1>
              <p class="mt-2 truncate text-sm text-slate-500 dark:text-slate-400">
                {{ primaryEmailDisplay || '未绑定邮箱' }}
              </p>
              <div class="mt-3 flex flex-wrap gap-2">
                <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                  {{ user?.role === 'admin' ? t('profile.administrator') : t('profile.user') }}
                </span>
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="user?.status === 'active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300'"
                >
                  {{ user?.status === 'active' ? t('common.active') : t('common.disabled') }}
                </span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div
              v-for="metric in accountMetrics"
              :key="metric.label"
              class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]"
            >
              <p class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ metric.label }}</p>
              <p class="mt-2 truncate text-lg font-semibold text-slate-950 dark:text-white">{{ metric.value }}</p>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ metric.hint }}</p>
            </div>
          </div>
        </div>
      </section>

      <div class="grid gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
        <div class="space-y-4 sm:space-y-6">
          <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0b0d10] sm:p-5">
            <div class="mb-5">
              <h2 class="text-base font-semibold text-slate-950 dark:text-white">基础资料</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">更新头像、用户名和登录身份信息。</p>
            </div>
            <div class="grid gap-3 md:grid-cols-2 md:gap-4">
              <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                <ProfileAvatarCard :user="user" embedded />
              </div>
              <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                <ProfileEditForm :initial-username="user?.username || ''" embedded />
              </div>
            </div>
          </section>

          <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0b0d10] sm:p-5">
            <ProfileIdentityBindingsSection
              :user="user"
              :linuxdo-enabled="linuxdoOAuthEnabled"
              :oidc-enabled="oidcOAuthEnabled"
              :oidc-provider-name="oidcOAuthProviderName"
              :wechat-enabled="wechatOAuthEnabled"
              :wechat-open-enabled="wechatOAuthOpenEnabled"
              :wechat-mp-enabled="wechatOAuthMPEnabled"
              embedded
              compact
            />
          </section>
        </div>

        <div class="space-y-4 sm:space-y-6">
          <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0b0d10] sm:p-5">
            <div class="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 class="text-base font-semibold text-slate-950 dark:text-white">安全设置</h2>
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">密码和两步验证集中管理。</p>
              </div>
              <Icon name="shield" size="lg" class="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div class="space-y-4">
              <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                <ProfilePasswordForm embedded />
              </div>
              <ProfileTotpCard />
            </div>
          </section>

          <section
            v-if="contactInfo"
            class="rounded-xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm dark:border-emerald-400/20 dark:bg-emerald-400/10"
          >
            <div class="flex items-start gap-4">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm dark:bg-white/10 dark:text-emerald-300">
                <Icon name="chat" size="md" />
              </div>
              <div class="min-w-0">
                <h3 class="font-semibold text-emerald-900 dark:text-emerald-100">{{ t('common.contactSupport') }}</h3>
                <p class="mt-1 break-words text-sm font-medium text-emerald-800 dark:text-emerald-200">{{ contactInfo }}</p>
              </div>
            </div>
          </section>

          <ProfileBalanceNotifyCard
            v-if="user && balanceLowNotifyEnabled"
            :enabled="user.balance_notify_enabled ?? true"
            :threshold="user.balance_notify_threshold"
            :extra-emails="user.balance_notify_extra_emails ?? []"
            :system-default-threshold="systemDefaultThreshold"
            :user-email="user.email"
          />
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@/components/icons'
import AppLayout from '@/components/layout/AppLayout.vue'
import ProfileAvatarCard from '@/components/user/profile/ProfileAvatarCard.vue'
import ProfileBalanceNotifyCard from '@/components/user/profile/ProfileBalanceNotifyCard.vue'
import ProfileEditForm from '@/components/user/profile/ProfileEditForm.vue'
import ProfileIdentityBindingsSection from '@/components/user/profile/ProfileIdentityBindingsSection.vue'
import ProfilePasswordForm from '@/components/user/profile/ProfilePasswordForm.vue'
import ProfileTotpCard from '@/components/user/profile/ProfileTotpCard.vue'
import { isWeChatWebOAuthEnabled } from '@/api/auth'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const appStore = useAppStore()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

const contactInfo = ref('')
const balanceLowNotifyEnabled = ref(false)
const systemDefaultThreshold = ref(0)
const linuxdoOAuthEnabled = ref(false)
const wechatOAuthEnabled = ref(false)
const wechatOAuthOpenEnabled = ref<boolean | undefined>(undefined)
const wechatOAuthMPEnabled = ref<boolean | undefined>(undefined)
const oidcOAuthEnabled = ref(false)
const oidcOAuthProviderName = ref('OIDC')

const displayName = computed(() => user.value?.username?.trim() || user.value?.email?.trim() || t('profile.user'))
const avatarUrl = computed(() => user.value?.avatar_url?.trim() || '')
const avatarInitial = computed(() => displayName.value.charAt(0).toUpperCase() || 'U')
const primaryEmailDisplay = computed(() => user.value?.email?.trim() || '')
const memberSince = computed(() => {
  const raw = user.value?.created_at?.trim()
  if (!raw) return '-'
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short' }).format(date)
})

const accountMetrics = computed(() => [
  {
    label: '账户余额',
    value: `$${(user.value?.balance || 0).toFixed(2)}`,
    hint: '当前可用额度'
  },
  {
    label: '并发额度',
    value: String(user.value?.concurrency || 0),
    hint: '同时请求限制'
  },
  {
    label: '加入时间',
    value: memberSince.value,
    hint: '账户创建月份'
  }
])

onMounted(async () => {
  const profileRefresh = authStore.refreshUser().catch((error) => {
    console.error('Failed to refresh profile:', error)
  })

  const settingsLoad = appStore.fetchPublicSettings()
    .then((settings) => {
      if (!settings) {
        return
      }
      contactInfo.value = settings.contact_info || ''
      balanceLowNotifyEnabled.value = settings.balance_low_notify_enabled ?? false
      systemDefaultThreshold.value = settings.balance_low_notify_threshold ?? 0
      linuxdoOAuthEnabled.value = settings.linuxdo_oauth_enabled ?? false
      wechatOAuthEnabled.value = isWeChatWebOAuthEnabled(settings)
      wechatOAuthOpenEnabled.value = typeof settings.wechat_oauth_open_enabled === 'boolean'
        ? settings.wechat_oauth_open_enabled
        : undefined
      wechatOAuthMPEnabled.value = typeof settings.wechat_oauth_mp_enabled === 'boolean'
        ? settings.wechat_oauth_mp_enabled
        : undefined
      oidcOAuthEnabled.value = settings.oidc_oauth_enabled ?? false
      oidcOAuthProviderName.value = settings.oidc_oauth_provider_name || 'OIDC'
    })
    .catch((error) => {
      console.error('Failed to load settings:', error)
    })

  await Promise.all([profileRefresh, settingsLoad])
})
</script>
