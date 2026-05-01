<template>
  <AppLayout>
    <div class="space-y-5">
      <section class="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5 dark:border-white/10 dark:bg-[#0b0d10]">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(16,185,129,0.16),transparent_30%),radial-gradient(circle_at_88%_12%,rgba(59,130,246,0.14),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.95),rgba(248,250,252,0.75))] dark:bg-[radial-gradient(circle_at_12%_0%,rgba(16,185,129,0.16),transparent_30%),radial-gradient(circle_at_88%_12%,rgba(59,130,246,0.16),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]"></div>
        <div class="relative grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div class="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300">
              <span class="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
              模型能力矩阵
            </div>
            <h2 class="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
              一眼判断哪些模型、通道和价格适合当前任务
            </h2>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              聚合 OpenAI、Claude、Gemini、Grok 与其他模型能力，按可用状态、推荐用途、价格信号和访问分组展示，减少用户在表格中来回查找。
            </p>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div
              v-for="metric in pageMetrics"
              :key="metric.label"
              class="rounded-xl border border-white/70 bg-white/80 p-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.05]"
            >
              <div class="text-xl font-semibold text-slate-950 dark:text-white">{{ metric.value }}</div>
              <div class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{{ metric.label }}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-4 xl:grid-cols-5">
        <article
          v-for="item in providerMatrix"
          :key="item.key"
          class="group relative overflow-hidden rounded-2xl border bg-white p-4 shadow-sm shadow-slate-950/5 transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-[#0b0d10]"
          :class="item.border"
        >
          <div class="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full opacity-70 blur-2xl" :class="item.glow"></div>
          <div class="relative">
            <div class="mb-4 flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm" :class="item.iconBg">
                  {{ item.short }}
                </div>
                <div>
                  <h3 class="font-semibold text-slate-950 dark:text-white">{{ item.title }}</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400">{{ item.subtitle }}</p>
                </div>
              </div>
              <span
                class="rounded-full px-2 py-1 text-[11px] font-semibold"
                :class="item.available ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'"
              >
                {{ item.available ? '可用' : '待配置' }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div class="rounded-xl bg-slate-50 p-3 dark:bg-white/[0.04]">
                <div class="text-[11px] text-slate-500 dark:text-slate-400">延迟参考</div>
                <div class="mt-1 text-sm font-semibold text-slate-950 dark:text-white">{{ item.latency }}</div>
              </div>
              <div class="rounded-xl bg-slate-50 p-3 dark:bg-white/[0.04]">
                <div class="text-[11px] text-slate-500 dark:text-slate-400">价格信号</div>
                <div class="mt-1 truncate text-sm font-semibold text-slate-950 dark:text-white">{{ item.price }}</div>
              </div>
            </div>

            <div class="mt-3 rounded-xl border border-slate-200/80 bg-white/70 p-3 dark:border-white/10 dark:bg-white/[0.03]">
              <div class="text-[11px] font-semibold uppercase text-slate-400 dark:text-slate-500">推荐用途</div>
              <p class="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{{ item.useCase }}</p>
            </div>

            <div class="mt-3 flex flex-wrap gap-1.5">
              <span
                v-for="model in item.models"
                :key="`${item.key}-${model}`"
                class="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
              >
                {{ model }}
              </span>
              <span v-if="item.models.length === 0" class="text-xs text-slate-400">暂无模型</span>
            </div>
          </div>
        </article>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-950/5 dark:border-white/10 dark:bg-[#0b0d10]">
        <div class="mb-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h3 class="text-lg font-semibold text-slate-950 dark:text-white">渠道明细</h3>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">继续保留完整表格，方便搜索平台、分组和具体模型。</p>
          </div>
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div class="relative w-full sm:w-80">
              <Icon
                name="search"
                size="md"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              />
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="t('availableChannels.searchPlaceholder')"
                class="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:border-emerald-400/40"
              />
            </div>
            <button
              @click="loadChannels"
              :disabled="loading"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950 disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.08]"
              :title="t('common.refresh', 'Refresh')"
            >
              <Icon name="refresh" size="md" :class="loading ? 'animate-spin' : ''" />
              刷新
            </button>
          </div>
        </div>

        <AvailableChannelsTable
          :columns="columnLabels"
          :rows="filteredChannels"
          :loading="loading"
          :user-group-rates="userGroupRates"
          pricing-key-prefix="availableChannels.pricing"
          :no-pricing-label="t('availableChannels.noPricing')"
          :no-models-label="t('availableChannels.noModels')"
          :empty-label="t('availableChannels.empty')"
        />
      </section>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/layout/AppLayout.vue'
import Icon from '@/components/icons/Icon.vue'
import AvailableChannelsTable from '@/components/channels/AvailableChannelsTable.vue'
import userChannelsAPI, { type UserAvailableChannel, type UserChannelPlatformSection, type UserSupportedModel } from '@/api/channels'
import userGroupsAPI from '@/api/groups'
import { useAppStore } from '@/stores/app'
import { extractApiErrorMessage } from '@/utils/apiError'

type MatrixKey = 'openai' | 'claude' | 'gemini' | 'grok' | 'other'

interface ProviderDefinition {
  key: MatrixKey
  title: string
  short: string
  subtitle: string
  latency: string
  useCase: string
  border: string
  glow: string
  iconBg: string
  match: (value: string) => boolean
}

const { t } = useI18n()
const appStore = useAppStore()

const channels = ref<UserAvailableChannel[]>([])
const userGroupRates = ref<Record<number, number>>({})
const loading = ref(false)
const searchQuery = ref('')

const providers: ProviderDefinition[] = [
  {
    key: 'openai',
    title: 'OpenAI',
    short: 'OA',
    subtitle: 'GPT / Codex / Realtime',
    latency: '0.8-1.8s',
    useCase: '适合通用问答、代码生成、工具调用、多模态和高频业务请求。',
    border: 'border-emerald-200/80 dark:border-emerald-400/20',
    glow: 'bg-emerald-200 dark:bg-emerald-500/30',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-500',
    match: (value) => /openai|gpt|codex|o1|o3|o4|chatgpt/i.test(value),
  },
  {
    key: 'claude',
    title: 'Claude',
    short: 'CL',
    subtitle: 'Anthropic Claude',
    latency: '1.2-2.4s',
    useCase: '适合长文本、复杂推理、文档总结、客服和知识库场景。',
    border: 'border-orange-200/80 dark:border-orange-400/20',
    glow: 'bg-orange-200 dark:bg-orange-500/30',
    iconBg: 'bg-gradient-to-br from-orange-500 to-amber-500',
    match: (value) => /claude|anthropic/i.test(value),
  },
  {
    key: 'gemini',
    title: 'Gemini',
    short: 'GE',
    subtitle: 'Google Gemini',
    latency: '1.0-2.2s',
    useCase: '适合多模态理解、长上下文分析、轻量问答和内容处理。',
    border: 'border-blue-200/80 dark:border-blue-400/20',
    glow: 'bg-blue-200 dark:bg-blue-500/30',
    iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    match: (value) => /gemini|google/i.test(value),
  },
  {
    key: 'grok',
    title: 'Grok',
    short: 'GK',
    subtitle: 'xAI Grok',
    latency: '1.1-2.6s',
    useCase: '适合创意问答、实时信息类产品、轻松语气内容生成。',
    border: 'border-violet-200/80 dark:border-violet-400/20',
    glow: 'bg-violet-200 dark:bg-violet-500/30',
    iconBg: 'bg-gradient-to-br from-violet-500 to-fuchsia-500',
    match: (value) => /grok|xai|x\.ai/i.test(value),
  },
  {
    key: 'other',
    title: '其他模型',
    short: 'AI',
    subtitle: '兼容模型池',
    latency: '按通道变化',
    useCase: '适合补充备用通道、低成本模型、专用模型和后续新增供应商。',
    border: 'border-slate-200 dark:border-white/10',
    glow: 'bg-cyan-200 dark:bg-cyan-500/30',
    iconBg: 'bg-gradient-to-br from-slate-700 to-cyan-500',
    match: () => false,
  },
]

const columnLabels = computed(() => ({
  name: t('availableChannels.columns.name'),
  description: t('availableChannels.columns.description'),
  platform: t('availableChannels.columns.platform'),
  groups: t('availableChannels.columns.groups'),
  supportedModels: t('availableChannels.columns.supportedModels'),
}))

const flatSections = computed(() => {
  return channels.value.flatMap((channel) =>
    channel.platforms.map((section) => ({
      channel,
      section,
      searchText: [
        channel.name,
        channel.description,
        section.platform,
        ...section.groups.map((group) => group.name),
        ...section.supported_models.map((model) => model.name),
      ].join(' '),
    })),
  )
})

const pageMetrics = computed(() => {
  const modelCount = new Set(
    flatSections.value.flatMap((item) => item.section.supported_models.map((model) => model.name)),
  ).size
  const groupCount = new Set(
    flatSections.value.flatMap((item) => item.section.groups.map((group) => group.id)),
  ).size
  return [
    { label: '可见渠道', value: channels.value.length },
    { label: '支持模型', value: modelCount },
    { label: '可用分组', value: groupCount },
  ]
})

const providerMatrix = computed(() => {
  const claimed = new Set<UserChannelPlatformSection>()
  return providers.map((provider) => {
    const matches = provider.key === 'other'
      ? flatSections.value.filter((item) => !claimed.has(item.section))
      : flatSections.value.filter((item) => provider.match(item.searchText))

    if (provider.key !== 'other') {
      matches.forEach((item) => claimed.add(item.section))
    }

    const models = Array.from(new Set(matches.flatMap((item) => item.section.supported_models.map((model) => model.name)))).slice(0, 5)
    const price = formatLowestPrice(matches.flatMap((item) => item.section.supported_models))

    return {
      ...provider,
      available: matches.length > 0,
      models,
      price,
    }
  })
})

/**
 * 搜索过滤：
 * - 命中渠道名/描述 → 整个渠道（所有 platforms）都保留
 * - 否则按 platform/group/model 维度在 sections 里过滤，保留有匹配的 section
 * - 所有 sections 都不匹配时，渠道本身被过滤掉
 */
const filteredChannels = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return channels.value
  return channels.value
    .map((ch) => {
      const nameHit = ch.name.toLowerCase().includes(q)
      const descHit = (ch.description || '').toLowerCase().includes(q)
      if (nameHit || descHit) return ch
      const matchingSections = ch.platforms.filter(
        (p) =>
          p.platform.toLowerCase().includes(q) ||
          p.groups.some((g) => g.name.toLowerCase().includes(q)) ||
          p.supported_models.some((m) => m.name.toLowerCase().includes(q)),
      )
      if (matchingSections.length === 0) return null
      return { ...ch, platforms: matchingSections }
    })
    .filter((ch): ch is UserAvailableChannel => ch !== null)
})

function formatLowestPrice(models: UserSupportedModel[]): string {
  const prices = models.flatMap((model) => {
    const pricing = model.pricing
    if (!pricing) return []
    return [
      pricing.per_request_price,
      pricing.input_price,
      pricing.output_price,
      pricing.image_output_price,
      ...pricing.intervals.flatMap((interval) => [
        interval.per_request_price,
        interval.input_price,
        interval.output_price,
      ]),
    ].filter((price): price is number => typeof price === 'number' && Number.isFinite(price) && price > 0)
  })
  if (prices.length === 0) return '按分组计费'
  const min = Math.min(...prices)
  return `低至 $${min.toFixed(min < 0.01 ? 4 : 3)}`
}

async function loadChannels() {
  loading.value = true
  try {
    const [list, rates] = await Promise.all([
      userChannelsAPI.getAvailable(),
      userGroupsAPI.getUserGroupRates().catch((err: unknown) => {
        console.error('Failed to load user group rates:', err)
        return {} as Record<number, number>
      }),
    ])
    channels.value = list
    userGroupRates.value = rates
  } catch (err: unknown) {
    appStore.showError(extractApiErrorMessage(err, t('common.error')))
  } finally {
    loading.value = false
  }
}

onMounted(loadChannels)
</script>
