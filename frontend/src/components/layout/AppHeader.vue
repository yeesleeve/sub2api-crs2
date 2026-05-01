<template>
  <header class="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#050607]/90">
    <div class="flex h-16 items-center justify-between px-4 md:px-6">
      <!-- Left: Mobile Menu Toggle + Page Title -->
      <div class="flex min-w-0 items-center gap-3 sm:gap-4">
        <button
          @click="toggleMobileSidebar"
          class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 lg:hidden"
          aria-label="Toggle Menu"
        >
          <Icon name="menu" size="md" />
        </button>

        <div class="min-w-0 lg:hidden">
          <h1 class="truncate text-sm font-semibold tracking-tight text-slate-950 dark:text-white">
            {{ pageTitle }}
          </h1>
          <p v-if="pageDescription" class="hidden truncate text-[11px] text-slate-500 dark:text-slate-400 sm:block">
            {{ pageDescription }}
          </p>
        </div>

        <div class="hidden lg:block">
          <h1 class="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
            {{ pageTitle }}
          </h1>
          <p v-if="pageDescription" class="text-xs text-slate-500 dark:text-slate-400">
            {{ pageDescription }}
          </p>
        </div>
      </div>

      <!-- Right: Announcements + Docs + Language + Subscriptions + Balance + User Dropdown -->
      <div class="flex shrink-0 items-center gap-2 sm:gap-2.5">
        <div class="hidden items-center gap-1 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-1 shadow-sm shadow-slate-950/5 dark:border-white/10 dark:bg-white/[0.04] sm:flex">
          <!-- Announcement Bell -->
          <div class="header-announcement">
            <AnnouncementBell v-if="user" />
          </div>

          <!-- Docs Link -->
          <a
            v-if="docUrl"
            :href="docUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="header-tool"
            title="查看文档"
          >
            <Icon name="book" size="sm" />
            <span class="hidden xl:inline">{{ t('nav.docs') }}</span>
          </a>

          <!-- Language Switcher -->
          <div class="header-locale">
            <LocaleSwitcher />
          </div>
        </div>

        <!-- Subscription Progress (for users with active subscriptions) -->
        <div class="hidden lg:block">
          <SubscriptionProgressMini v-if="user" />
        </div>

        <!-- Balance Display -->
        <div
          v-if="user"
          class="hidden h-11 items-center gap-3 rounded-xl border border-emerald-200/80 bg-[linear-gradient(135deg,#ecfdf5_0%,#ffffff_62%,#eff6ff_100%)] px-3.5 shadow-sm shadow-emerald-950/5 ring-1 ring-white/80 dark:border-emerald-400/20 dark:bg-[linear-gradient(135deg,rgba(16,185,129,0.16)_0%,rgba(255,255,255,0.04)_58%,rgba(59,130,246,0.10)_100%)] dark:ring-white/5 sm:flex"
        >
          <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-sm shadow-emerald-500/20">
            <Icon name="dollar" size="sm" />
          </span>
          <span class="leading-none">
            <span class="block text-[11px] font-medium text-emerald-700/80 dark:text-emerald-300/80">余额</span>
            <span class="mt-1 block text-[15px] font-bold tabular-nums text-emerald-700 dark:text-emerald-300">
              ${{ user.balance?.toFixed(2) || '0.00' }}
            </span>
          </span>
        </div>

        <!-- User Dropdown -->
        <div v-if="user" class="relative" ref="dropdownRef">
          <button
            @click="toggleDropdown"
            class="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 shadow-sm shadow-slate-950/5 ring-1 ring-white transition hover:border-slate-300 hover:shadow-md dark:border-white/10 dark:bg-white/[0.04] dark:ring-white/5 dark:shadow-black/20 dark:hover:bg-white/[0.07] sm:h-11 sm:px-2.5"
            aria-label="User Menu"
          >
            <div class="flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg bg-slate-950 text-xs font-semibold text-white shadow-sm ring-1 ring-slate-950/10 dark:bg-white dark:text-slate-950 dark:ring-white/10 sm:h-8 sm:w-8 sm:text-sm">
              <img
                v-if="avatarUrl"
                :src="avatarUrl"
                :alt="displayName"
                class="h-full w-full object-cover"
              >
              <span v-else>{{ userInitials }}</span>
            </div>
            <div class="hidden text-left md:block">
              <div class="max-w-28 truncate text-sm font-semibold text-slate-950 dark:text-white">
                {{ displayName }}
              </div>
              <div class="text-xs capitalize leading-4 text-slate-500 dark:text-slate-400">
                {{ user.role }}
              </div>
            </div>
            <Icon name="chevronDown" size="sm" class="hidden text-gray-400 md:block" />
          </button>

          <!-- Dropdown Menu -->
          <transition name="dropdown">
            <div v-if="dropdownOpen" class="account-dropdown right-0 mt-3 w-72">
              <!-- User Info -->
              <div class="p-3">
                <div class="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.04]">
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-slate-950 text-sm font-bold text-white shadow-sm dark:bg-white dark:text-slate-950">
                      <img
                        v-if="avatarUrl"
                        :src="avatarUrl"
                        :alt="displayName"
                        class="h-full w-full object-cover"
                      >
                      <span v-else>{{ userInitials }}</span>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="truncate text-sm font-semibold text-slate-950 dark:text-white">
                        {{ displayName }}
                      </div>
                      <div class="truncate text-xs text-slate-500 dark:text-slate-400">{{ user.email }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Balance (mobile only) -->
              <div class="px-3 pb-3 sm:hidden">
                <div class="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 dark:border-emerald-400/20 dark:bg-emerald-400/10">
                  <div class="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    <Icon name="dollar" size="sm" />
                    {{ t('common.balance') }}
                  </div>
                  <div class="text-sm font-bold tabular-nums text-emerald-700 dark:text-emerald-300">
                    ${{ user.balance?.toFixed(2) || '0.00' }}
                  </div>
                </div>
              </div>

              <div class="space-y-1 border-t border-slate-100 p-2 dark:border-white/10">
                <router-link to="/profile" @click="closeDropdown" class="account-menu-item">
                  <Icon name="user" size="sm" />
                  {{ t('nav.profile') }}
                </router-link>

                <router-link to="/keys" @click="closeDropdown" class="account-menu-item">
                  <Icon name="key" size="sm" />
                  {{ t('nav.apiKeys') }}
                </router-link>

                <a
                  v-if="authStore.isAdmin"
                  href="https://github.com/Wei-Shaw/sub2api"
                  target="_blank"
                  rel="noopener noreferrer"
                  @click="closeDropdown"
                  class="account-menu-item"
                >
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                    />
                  </svg>
                  {{ t('nav.github') }}
                </a>

              </div>

              <!-- Contact Support (only show if configured) -->
              <div
                v-if="contactInfo"
                class="border-t border-slate-100 px-4 py-3 dark:border-white/10"
              >
                <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <svg
                    class="h-3.5 w-3.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                    />
                  </svg>
                  <span>{{ t('common.contactSupport') }}:</span>
                  <span class="font-medium text-slate-700 dark:text-slate-300">{{
                    contactInfo
                  }}</span>
                </div>
              </div>

              <div v-if="showOnboardingButton" class="border-t border-slate-100 p-2 dark:border-white/10">
                <button @click="handleReplayGuide" class="account-menu-item w-full">
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 14a1 1 0 110 2 1 1 0 010-2zm1.07-7.75c0-.6-.49-1.25-1.32-1.25-.7 0-1.22.4-1.43 1.02a1 1 0 11-1.9-.62A3.41 3.41 0 0111.8 5c2.02 0 3.25 1.4 3.25 2.9 0 2-1.83 2.55-2.43 3.12-.43.4-.47.75-.47 1.23a1 1 0 01-2 0c0-1 .16-1.82 1.1-2.7.69-.64 1.82-1.05 1.82-2.06z"
                    />
                  </svg>
                  {{ $t('onboarding.restartTour') }}
                </button>
              </div>

              <div class="border-t border-slate-100 p-2 dark:border-white/10">
                <button
                  @click="handleLogout"
                  class="account-menu-item w-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  <svg
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                    />
                  </svg>
                  {{ t('nav.logout') }}
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore, useAuthStore, useOnboardingStore } from '@/stores'
import { useAdminSettingsStore } from '@/stores/adminSettings'
import LocaleSwitcher from '@/components/common/LocaleSwitcher.vue'
import SubscriptionProgressMini from '@/components/common/SubscriptionProgressMini.vue'
import AnnouncementBell from '@/components/common/AnnouncementBell.vue'
import Icon from '@/components/icons/Icon.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const appStore = useAppStore()
const authStore = useAuthStore()
const adminSettingsStore = useAdminSettingsStore()
const onboardingStore = useOnboardingStore()

const user = computed(() => authStore.user)
const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const contactInfo = computed(() => appStore.contactInfo)
const docUrl = computed(() => appStore.docUrl)
const avatarUrl = computed(() => user.value?.avatar_url?.trim() || '')

// 只在标准模式的管理员下显示新手引导按钮
const showOnboardingButton = computed(() => {
  return !authStore.isSimpleMode && user.value?.role === 'admin'
})

const userInitials = computed(() => {
  if (!user.value) return ''
  // Prefer username, fallback to email
  if (user.value.username) {
    return user.value.username.substring(0, 2).toUpperCase()
  }
  if (user.value.email) {
    // Get the part before @ and take first 2 chars
    const localPart = user.value.email.split('@')[0]
    return localPart.substring(0, 2).toUpperCase()
  }
  return ''
})

const displayName = computed(() => {
  if (!user.value) return ''
  return user.value.username || user.value.email?.split('@')[0] || ''
})

const pageTitle = computed(() => {
  // For custom pages, use the menu item's label instead of generic "自定义页面"
  if (route.name === 'CustomPage') {
    const id = route.params.id as string
    const publicItems = appStore.cachedPublicSettings?.custom_menu_items ?? []
    const menuItem = publicItems.find((item) => item.id === id)
      ?? (authStore.isAdmin ? adminSettingsStore.customMenuItems.find((item) => item.id === id) : undefined)
    if (menuItem?.label) return menuItem.label
  }
  const titleKey = route.meta.titleKey as string
  if (titleKey) {
    return t(titleKey)
  }
  return (route.meta.title as string) || ''
})

const pageDescription = computed(() => {
  const descKey = route.meta.descriptionKey as string
  if (descKey) {
    return t(descKey)
  }
  return (route.meta.description as string) || ''
})

function toggleMobileSidebar() {
  appStore.toggleMobileSidebar()
}

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

function closeDropdown() {
  dropdownOpen.value = false
}

async function handleLogout() {
  closeDropdown()
  try {
    await authStore.logout()
  } catch (error) {
    // Ignore logout errors - still redirect to login
    console.error('Logout error:', error)
  }
  await router.push('/login')
}

function handleReplayGuide() {
  closeDropdown()
  onboardingStore.replay()
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-4px);
}

.account-dropdown {
  @apply absolute z-50 origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-950/10 dark:border-white/10 dark:bg-[#0b0d10] dark:shadow-black/40;
}

.account-menu-item {
  @apply flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white;
}

.header-tool {
  @apply flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-950 hover:shadow-sm dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-white;
}

.header-announcement :deep(button) {
  @apply rounded-xl text-slate-600 hover:bg-white hover:text-slate-950 hover:shadow-sm dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-white;
}

.header-locale :deep(button),
.header-locale :deep(.locale-switcher),
.header-locale :deep([role='button']) {
  @apply rounded-xl;
}
</style>
