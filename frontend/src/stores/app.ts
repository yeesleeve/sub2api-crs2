/**
 * Application State Store
 * Manages global UI state including sidebar, loading indicators, and toast notifications
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Toast, ToastType, PublicSettings } from '@/types'
import { i18n } from '@/i18n'
import {
  checkUpdates as checkUpdatesAPI,
  type VersionInfo,
  type ReleaseInfo
} from '@/api/admin/system'
import { getPublicSettings as fetchPublicSettingsAPI } from '@/api/auth'

export const useAppStore = defineStore('app', () => {
  // ==================== State ====================

  const sidebarCollapsed = ref<boolean>(false)
  const mobileOpen = ref<boolean>(false)
  const loading = ref<boolean>(false)
  const toasts = ref<Toast[]>([])

  // Public settings cache state
  const publicSettingsLoaded = ref<boolean>(false)
  const publicSettingsLoading = ref<boolean>(false)
  const siteName = ref<string>('Sub2API')
  const siteLogo = ref<string>('')
  const siteVersion = ref<string>('')
  const contactInfo = ref<string>('')
  const apiBaseUrl = ref<string>('')
  const docUrl = ref<string>('')
  const cachedPublicSettings = ref<PublicSettings | null>(null)

  // Version cache state
  const versionLoaded = ref<boolean>(false)
  const versionLoading = ref<boolean>(false)
  const currentVersion = ref<string>('')
  const latestVersion = ref<string>('')
  const hasUpdate = ref<boolean>(false)
  const buildType = ref<string>('source')
  const releaseInfo = ref<ReleaseInfo | null>(null)

  // Auto-incrementing ID for toasts
  let toastIdCounter = 0

  // ==================== Computed ====================

  const hasActiveToasts = computed(() => toasts.value.length > 0)
  const backendModeEnabled = computed(() => cachedPublicSettings.value?.backend_mode_enabled ?? false)

  const loadingCount = ref<number>(0)

  // ==================== Actions ====================

  /**
   * Toggle sidebar collapsed state
   */
  function toggleSidebar(): void {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  /**
   * Set sidebar collapsed state explicitly
   * @param collapsed - Whether sidebar should be collapsed
   */
  function setSidebarCollapsed(collapsed: boolean): void {
    sidebarCollapsed.value = collapsed
  }

  /**
   * Toggle mobile sidebar open state
   */
  function toggleMobileSidebar(): void {
    mobileOpen.value = !mobileOpen.value
  }

  /**
   * Set mobile sidebar open state explicitly
   * @param open - Whether mobile sidebar should be open
   */
  function setMobileOpen(open: boolean): void {
    mobileOpen.value = open
  }

  /**
   * Set global loading state
   * @param isLoading - Whether app is in loading state
   */
  function setLoading(isLoading: boolean): void {
    if (isLoading) {
      loadingCount.value++
    } else {
      loadingCount.value = Math.max(0, loadingCount.value - 1)
    }
    loading.value = loadingCount.value > 0
  }

  /**
   * Show a toast notification
   * @param type - Type of toast (success, error, info, warning)
   * @param message - Toast message content
   * @param duration - Auto-dismiss duration in ms (undefined = no auto-dismiss)
   * @returns Toast ID for manual dismissal
   */
  function showToast(type: ToastType, message: string, duration?: number): string {
    const id = `toast-${++toastIdCounter}`
    const enhanced = enhanceToastMessage(type, message)
    const toast: Toast = {
      id,
      type,
      message: enhanced.message,
      title: enhanced.title,
      duration,
      startTime: duration !== undefined ? Date.now() : undefined
    }

    toasts.value.push(toast)

    // Auto-dismiss if duration is specified
    if (duration !== undefined) {
      setTimeout(() => {
        hideToast(id)
      }, duration)
    }

    return id
  }

  /**
   * Show a success toast
   * @param message - Success message
   * @param duration - Auto-dismiss duration in ms (default: 3000)
   */
  function showSuccess(message: string, duration: number = 3000): string {
    return showToast('success', message, duration)
  }

  /**
   * Show an error toast
   * @param message - Error message
   * @param duration - Auto-dismiss duration in ms (default: 5000)
   */
  function showError(message: string, duration: number = 5000): string {
    return showToast('error', message, duration)
  }

  /**
   * Show an info toast
   * @param message - Info message
   * @param duration - Auto-dismiss duration in ms (default: 3000)
   */
  function showInfo(message: string, duration: number = 3000): string {
    return showToast('info', message, duration)
  }

  /**
   * Show a warning toast
   * @param message - Warning message
   * @param duration - Auto-dismiss duration in ms (default: 4000)
   */
  function showWarning(message: string, duration: number = 4000): string {
    return showToast('warning', message, duration)
  }

  function enhanceToastMessage(type: ToastType, message: string): { title?: string; message: string } {
    const raw = String(message || '').trim()
    const lower = raw.toLowerCase()
    if (type === 'error') {
      if (raw.includes('余额') || lower.includes('insufficient') || lower.includes('balance')) {
        return { title: '余额不足', message: '当前余额不足以完成本次操作，请先充值或降低调用额度后重试。' }
      }
      if (raw.includes('密钥') || lower.includes('api key') || lower.includes('token') || lower.includes('unauthorized')) {
        return { title: '密钥无效', message: '请检查 API Key 是否复制完整、是否已启用，并确认当前账号有对应分组权限。' }
      }
      if (raw.includes('兑换') || lower.includes('redeem') || lower.includes('coupon')) {
        return { title: '兑换失败', message: raw || '兑换码可能已使用、已过期或不适用于当前账号，请核对后重试。' }
      }
      if (raw.includes('支付') || raw.includes('订单') || lower.includes('payment') || lower.includes('order')) {
        return { title: '支付处理失败', message: raw || '支付通道暂时不可用，请稍后重试；已扣款时请保留订单号联系管理员。' }
      }
      return { title: '操作失败', message: raw || '请求没有成功，请稍后重试或联系管理员。' }
    }
    if (type === 'success') return { title: '操作成功', message: raw }
    if (type === 'warning') return { title: '需要注意', message: raw }
    return { message: raw }
  }

  /**
   * Hide a specific toast by ID
   * @param id - Toast ID to hide
   */
  function hideToast(id: string): void {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  /**
   * Clear all toasts
   */
  function clearAllToasts(): void {
    toasts.value = []
  }

  /**
   * Execute an async operation with loading state
   * Automatically manages loading indicator
   * @param operation - Async operation to execute
   * @returns Promise resolving to operation result
   */
  async function withLoading<T>(operation: () => Promise<T>): Promise<T> {
    setLoading(true)
    try {
      return await operation()
    } finally {
      setLoading(false)
    }
  }

  /**
   * Execute an async operation with loading and error handling
   * Shows error toast on failure
   * @param operation - Async operation to execute
   * @param errorMessage - Custom error message (optional)
   * @returns Promise resolving to operation result or null on error
   */
  async function withLoadingAndError<T>(
    operation: () => Promise<T>,
    errorMessage?: string
  ): Promise<T | null> {
    setLoading(true)
    try {
      return await operation()
    } catch (error) {
      const message =
        errorMessage ||
        (error as { message?: string }).message ||
        i18n.global.t('common.unknownError')
      showError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  /**
   * Reset app state to defaults
   * Useful for cleanup or testing
   */
  function reset(): void {
    sidebarCollapsed.value = false
    loading.value = false
    loadingCount.value = 0
    toasts.value = []
  }

  // ==================== Version Management ====================

  /**
   * Fetch version info (uses cache unless force=true)
   * @param force - Force refresh from API
   */
  async function fetchVersion(force = false): Promise<VersionInfo | null> {
    // Return cached data if available and not forcing refresh
    if (versionLoaded.value && !force) {
      return {
        current_version: currentVersion.value,
        latest_version: latestVersion.value,
        has_update: hasUpdate.value,
        build_type: buildType.value,
        release_info: releaseInfo.value || undefined,
        cached: true
      }
    }

    // Prevent duplicate requests
    if (versionLoading.value) {
      return null
    }

    versionLoading.value = true
    try {
      const data = await checkUpdatesAPI(force)
      currentVersion.value = data.current_version
      latestVersion.value = data.latest_version
      hasUpdate.value = data.has_update
      buildType.value = data.build_type || 'source'
      releaseInfo.value = data.release_info || null
      versionLoaded.value = true
      return data
    } catch (error) {
      console.error('Failed to fetch version:', error)
      return null
    } finally {
      versionLoading.value = false
    }
  }

  /**
   * Clear version cache (e.g., after update)
   */
  function clearVersionCache(): void {
    versionLoaded.value = false
    hasUpdate.value = false
  }

  // ==================== Public Settings Management ====================

  /**
   * Apply settings to store state (internal helper to avoid code duplication)
   */
  function applySettings(config: PublicSettings): void {
    if (typeof window !== 'undefined') {
      window.__APP_CONFIG__ = { ...config }
    }
    cachedPublicSettings.value = config
    siteName.value = config.site_name || 'Sub2API'
    siteLogo.value = config.site_logo || ''
    siteVersion.value = config.version || ''
    contactInfo.value = config.contact_info || ''
    apiBaseUrl.value = config.api_base_url || ''
    docUrl.value = config.doc_url || ''
    publicSettingsLoaded.value = true
  }

  /**
   * Fetch public settings (uses cache unless force=true)
   * @param force - Force refresh from API
   */
  async function fetchPublicSettings(force = false): Promise<PublicSettings | null> {
    // Check for injected config from server (eliminates flash)
    if (!publicSettingsLoaded.value && !force && window.__APP_CONFIG__) {
      applySettings(window.__APP_CONFIG__)
      return window.__APP_CONFIG__
    }

    // Return cached data if available and not forcing refresh
    if (publicSettingsLoaded.value && !force) {
      if (cachedPublicSettings.value) {
        return { ...cachedPublicSettings.value }
      }
      return {
        registration_enabled: false,
        email_verify_enabled: false,
        force_email_on_third_party_signup: false,
        registration_email_suffix_whitelist: [],
        promo_code_enabled: true,
        password_reset_enabled: false,
        invitation_code_enabled: false,
        turnstile_enabled: false,
        turnstile_site_key: '',
        site_name: siteName.value,
        site_logo: siteLogo.value,
        site_subtitle: '',
        api_base_url: apiBaseUrl.value,
        contact_info: contactInfo.value,
        doc_url: docUrl.value,
        home_content: '',
        hide_ccs_import_button: false,
        payment_enabled: false,
        table_default_page_size: 20,
        table_page_size_options: [10, 20, 50, 100],
        custom_menu_items: [],
        custom_endpoints: [],
        linuxdo_oauth_enabled: false,
        wechat_oauth_enabled: false,
        wechat_oauth_open_enabled: false,
        wechat_oauth_mp_enabled: false,
        wechat_oauth_mobile_enabled: false,
        oidc_oauth_enabled: false,
        oidc_oauth_provider_name: 'OIDC',
        backend_mode_enabled: false,
        version: siteVersion.value,
        balance_low_notify_enabled: false,
        account_quota_notify_enabled: false,
        balance_low_notify_threshold: 0,
        channel_monitor_enabled: true,
        channel_monitor_default_interval_seconds: 60,
        available_channels_enabled: false,
        affiliate_enabled: false,
      }
    }

    // Prevent duplicate requests
    if (publicSettingsLoading.value) {
      return null
    }

    publicSettingsLoading.value = true
    try {
      const data = await fetchPublicSettingsAPI()
      applySettings(data)
      return data
    } catch (error) {
      console.error('Failed to fetch public settings:', error)
      return null
    } finally {
      publicSettingsLoading.value = false
    }
  }

  /**
   * Clear public settings cache
   */
  function clearPublicSettingsCache(): void {
    publicSettingsLoaded.value = false
    cachedPublicSettings.value = null
  }

  /**
   * Initialize settings from injected config (window.__APP_CONFIG__)
   * This is called synchronously before Vue app mounts to prevent flash
   * @returns true if config was found and applied, false otherwise
   */
  function initFromInjectedConfig(): boolean {
    if (window.__APP_CONFIG__) {
      applySettings(window.__APP_CONFIG__)
      return true
    }
    return false
  }

  // ==================== Return Store API ====================

  return {
    // State
    sidebarCollapsed,
    mobileOpen,
    loading,
    toasts,

    // Public settings state
    publicSettingsLoaded,
    siteName,
    siteLogo,
    siteVersion,
    contactInfo,
    apiBaseUrl,
    docUrl,
    cachedPublicSettings,

    // Version state
    versionLoaded,
    versionLoading,
    currentVersion,
    latestVersion,
    hasUpdate,
    buildType,
    releaseInfo,

    // Computed
    hasActiveToasts,
    backendModeEnabled,

    // Actions
    toggleSidebar,
    setSidebarCollapsed,
    toggleMobileSidebar,
    setMobileOpen,
    setLoading,
    showToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    hideToast,
    clearAllToasts,
    withLoading,
    withLoadingAndError,
    reset,

    // Version actions
    fetchVersion,
    clearVersionCache,

    // Public settings actions
    fetchPublicSettings,
    clearPublicSettingsCache,
    initFromInjectedConfig
  }
})
