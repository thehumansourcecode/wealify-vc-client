<script setup lang="ts">
definePageMeta({
  layout: 'home',
})
import { formatDDMMYYYY, formatDDMMYYYYHHMM, formatMoney } from '~/common/functions'
import { CardCategory, CardStatus, CardType, type ICardDetail } from '~/types/cards'
import { showToast, ToastType } from '~/common/functions'
import { datetime } from '@/utils/datetime.utils'

const { t } = useI18n()
const dayjs = useDayjs()

const loading = computed(() => cardStore.isLoading)
const cardStore = useCardStore()
const commonStore = useCommonStore()
const selectedCardList = ref([])
const payload = computed(() => cardStore.payload)
const tempKeyword = ref<string | undefined>(payload.value.keyword)
const filterCat = ref(null)

const cardList = computed(() => cardStore.cardList)
const cardCount = computed(() => cardStore.cardCount)

const limitOptions = ref([10, 30, 50])
const page = computed(() => payload.value.page)
const limit = computed(() => payload.value.limit)
const filterType = ref(undefined)
const selected = ref(undefined)
const {
  isVisibleConfirmFreeze,
  isVisibleConfirmCancel,
  isVisibleConfirmUnfreeze,
  activeCardCount,
  isPreventClose,
  totalCreatedCard,
  totalBalanceCard,
} = storeToRefs(cardStore)

function isCardSelected(card: ICardDetail) {
  return selectedCardList.value.some((selectedCard: ICardDetail) => selectedCard.id === card.id)
}

async function getCardList() {
  await cardStore.getCardList(payload.value)
}

const activeCardList = computed(
  () => cardList.value?.filter((card: ICardDetail) => card.card_status === CardStatus.ACTIVE) || [],
)

const totalSelectedAmount = computed(() => {
  const cardListAmount = selectedCardList.value.map((selectedCard: ICardDetail) => selectedCard.balance)
  return cardListAmount.reduce((a: number, b: number) => a + b, 0)
})
const totalActiveAmount = computed(() => {
  const cardListAmount = activeCardList.value.map((activeCard: ICardDetail) => activeCard.balance)
  return cardListAmount.reduce((a: number, b: number) => a + b, 0)
})

const typeOptions = Object.values(CardType).map((value, index) => ({ type: value, disabled: index == 0 }))
const categoryOptions = computed(() => commonStore.categoryList)
const statusOptions = Object.values(CardStatus)

function isCategorySelected(category: CardCategory) {
  return payload.value.category.includes(category)
}

function isStatusSelected(status: CardStatus) {
  return payload.value.card_status.includes(status)
}

const cardTableColumns = [
  {
    key: 'card',
    label: t('cards.list.header.card'),
    class: 'mr-5 min-w-[240px]',
  },
  {
    key: 'type',
    label: t('cards.list.header.type'),
    class: 'text-center w-16',
  },
  {
    key: 'category',
    label: t('cards.list.header.category'),
    class: 'mr-5 text-center w-[172px] grow',
  },
  {
    key: 'balance',
    label: t('cards.list.header.balance'),
    class: 'text-center mr-5 w-[150px]',
  },
  {
    key: 'total_top_up',
    label: t('cards.list.header.total_top_up'),
    class: 'text-center mr-5 w-[150px]',
  },
  {
    key: 'total_withdraw',
    label: t('cards.list.header.total_withdraw'),
    class: 'mr-5 text-center w-[150px]',
  },
  {
    key: 'created_at',
    label: t('cards.list.header.created_at'),
    class: 'text-center mr-5 w-[150px]',
  },
  {
    key: 'status',
    label: t('cards.list.header.status'),
    class: 'text-center mr-5 w-[100px]',
  },
  {
    key: 'action',
    label: t('cards.list.header.action'),
    class: 'text-center w-[128px]',
  },
]

function getStatusColor(status: CardStatus) {
  if (status === CardStatus.CANCELLED) {
    return '#ED2C38'
  }
  if (status === CardStatus.ACTIVE) {
    return '#2EA518'
  }
  if (status === CardStatus.FROZEN) {
    return '#7A7D89'
  }
}

function onClickTopup(card: ICardDetail) {
  if (card?.id) {
    cardStore.toggleCardTopupModal(true)
    cardStore.setSelectedCardForTopup(card)
  }
}

function clearSelected() {
  selectedCardList.value = []
}

watch(
  () => [page.value, limit.value],
  () => {
    clearSelected()
  },
)

async function onChangePage(page: number) {
  cardStore.setPayloadPage(page)
  await getCardList()
}

async function handleClickCard(row: ICardDetail) {
  const id = row.id
  const selectedCardDetail = cardList.value.find((card: ICardDetail) => card.id === id)
  if (selectedCardDetail) {
    selected.value = selectedCardDetail
    cardStore.setSelectedCardForTopup(row)
    await cardStore.getCardDetailById(id)
    cardStore.toggleCardDetailSlideover(true)
  }
}

const tableRef = ref(null)

watch(
  () => [tableRef.value, selectedCardList.value.length],
  () => {
    const checkboxes = document.querySelectorAll('.table-wrapper input[type=checkbox]')
    checkboxes.forEach(item => {
      item.addEventListener('click', e => {
        console.log(item)
        e.stopPropagation()
      })
    })
  },
  { immediate: true, flush: 'sync' },
)

const dateRange = ref<[Date | undefined, Date | undefined]>([undefined, undefined])

watch(dateRange, () => {
  const start_date = dateRange.value[0] ? dateFormat(dateRange.value[0], 'yyyy-MM-dd') : undefined
  const end_date = dateRange.value[1] ? dateFormat(dateRange.value[1], 'yyyy-MM-dd') : undefined
  if (payload.value.start_date == start_date && payload.value.end_date == end_date) {
    return
  }

  cardStore.setPayload({
    ...payload.value,
    start_date,
    end_date,
  })
})

watch(
  () => [
    payload.value.card_status,
    payload.value.card_type,
    payload.value.category,
    payload.value.keyword,
    payload.value.limit,
    payload.value.start_date,
    payload.value.end_date,
  ],
  async () => {
    if (page.value !== 1) {
      cardStore.setPayloadPage(1)
    }
    await getCardList()
  },
  { deep: true },
)

watch(filterType, (value: { type: string } | undefined) => {
  if (value) {
    payload.value.card_type = value.type
    return
  }
  payload.value.card_type = value
})

async function onEnterKeyword() {
  if (tempKeyword.value !== payload.value.keyword) {
    tempKeyword.value = tempKeyword.value?.trim()
    cardStore.setPayload({ ...payload.value, keyword: tempKeyword.value })
  }
}

onMounted(() => initPage())

async function initPage() {
  await Promise.all([getCardList(), commonStore.getDropdownCategoryList()])
}

const handleFreeze = async () => {
  cardStore.isLoading.freezeCard = true
  const result = await cardStore.freezeCard(selected.value.id)
  cardStore.isLoading.freezeCard = false
  if (!result.success) {
    showToast(ToastType.FAILED, t('cards.message.freeze.error'))
    return
  }
  showToast(ToastType.SUCCESS, t('cards.message.freeze.success'))
  await cardStore.getCardDetailById(selected.value.id)
  cardStore.toggleCardFreeze(false)
  isPreventClose.value = false
  initPage()
}

const getIconCategory = ({ category }: any): string => {
  const name = category.replace(/[\/\s]/g, '-')
  return `/icons/cards/category/${name}.svg`
}

const handleCancel = async () => {
  cardStore.isLoading.cancelCard = true
  const result = await cardStore.cancelCard(selected.value.id)
  cardStore.isLoading.cancelCard = false
  if (!result.success) {
    showToast(ToastType.FAILED, t('cards.message.cancel.error'))
    return
  }
  await cardStore.getCardDetailById(selected.value.id)
  cardStore.toggleCardCancel(false)
  isPreventClose.value = false
  initPage()
}

const handleUnfreeze = async () => {
  cardStore.isLoading.unfreezeCard = true
  const result = await cardStore.unfreezeCard(selected.value.id)
  cardStore.isLoading.unfreezeCard = false
  if (!result.success) {
    showToast(ToastType.FAILED, t('cards.message.unfreeze.error'))
    return
  }
  showToast(ToastType.SUCCESS, t('cards.message.unfreeze.success'))
  await cardStore.getCardDetailById(selected.value.id)
  cardStore.toggleCardUnFreeze(false)
  isPreventClose.value = false
  initPage()
}

const clearFilterCategory = () => {
  filterCat.value.resetQuery()
  payload.value.category = []
}

onUnmounted(() =>
  cardStore.setPayload({
    page: 1,
    limit: 10,
    keyword: undefined,
    card_type: undefined,
    card_status: [] as CardStatus[],
    category: [] as CardCategory[],
    start_date: undefined,
    end_date: undefined,
  }),
)
</script>
<template>
  <!-- Note: Overflow-y-auto here if want to fit table data into 100vh -->
  <div class="flex flex-col px-4 sm:pl-10 sm:pr-[60px] flex-1 gap-6 mt-7">
    <!-- Button group chỉ hiện trên mobile -->
    <div class="flex flex-row gap-[10px] justify-between sm:hidden">
      <UButton
        class="flex items-center justify-center rounded-[49px] bg-[#F0F2F5] hover:bg-[#E1E3E6] px-3 py-2 w-[120px] cursor-not-allowed"
      >
        <div class="text-[#1C1D23] text-14-600-20">
          {{ t('cards.button.withdraw') }}
        </div>
      </UButton>
      <UButton
        class="flex items-center justify-center rounded-[49px] bg-[#FF5524] hover:bg-[#EE4413] px-3 py-2 w-[120px]"
        @click="navigateTo('/cards/issue')"
      >
        <div class="text-white text-14-600-20">
          {{ t('cards.button.issue') }}
        </div>
      </UButton>
    </div>
    <!-- Cards not selected -->
    <div v-if="!selectedCardList?.length" class="flex flex-col gap-3">
      <div class="flex flex-col sm:flex-row gap-4 sm:gap-[100px] justify-between">
        <BaseInput
          @blur="onEnterKeyword()"
          @keyup.enter="onEnterKeyword()"
          input-class="input-field rounded-49"
          class="w-full"
          v-model="tempKeyword"
          leading
          :leading-img="'/icons/common/search.svg'"
          :placeholder="t('cards.filter.placeholder.search')"
          autocomplete="off"
        />
        <!-- Button group chỉ hiện trên PC -->
        <div class="flex-row gap-[10px] justify-between hidden sm:flex">
          <UButton
            class="flex items-center justify-center rounded-[49px] bg-[#F0F2F5] hover:bg-[#E1E3E6] px-3 sm:px-4 py-2 sm:py-3 w-[120px] sm:w-[168px] cursor-not-allowed"
          >
            <div class="text-[#1C1D23] text-14-600-20 sm:text-16-600-24">
              {{ t('cards.button.withdraw') }}
            </div>
          </UButton>
          <UButton
            class="flex items-center justify-center rounded-[49px] bg-[#FF5524] hover:bg-[#EE4413] px-3 sm:px-4 py-2 sm:py-3 w-[120px] sm:w-[168px]"
            @click="navigateTo('/cards/select-type')"
          >
            <div class="text-white text-14-600-20 sm:text-16-600-24">
              {{ t('cards.button.issue') }}
            </div>
          </UButton>
        </div>
      </div>
      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-3 sm:gap-5 items-start sm:items-center">
        <!-- Grid container for mobile -->
        <div class="grid grid-cols-2 sm:flex sm:flex-row sm:flex-wrap gap-3 sm:gap-5 w-full items-center">
          <!-- Date Picker -->
          <div class="col-span-1 sm:col-auto">
            <DatePicker v-model="dateRange" class="w-full sm:w-auto" />
          </div>

          <div class="hidden sm:block">
            <img src="~/assets/img/common/line.svg" alt="" />
          </div>

          <!-- Type -->
          <div class="col-span-1 sm:col-auto">
            <BaseSingleSelect
              class="w-full sm:w-[150px]"
              :options="typeOptions"
              v-model="filterType"
              :selected-icon="'i-selected'"
              :option-attribute="`label`"
            >
              <template #default="{ open: open }">
                <div
                  class="px-3 py-[6px] w-full rounded-[36px] bg-[#f0f2f5] border flex items-center justify-between"
                  :class="open ? 'border-[#FF5524]' : 'border-[f0f2f5]'"
                >
                  <div class="text-12-500-20 text-[#7A7D89]">
                    <span v-if="filterType">
                      {{ t(`cards.list.type.${filterType.type}`) }}
                    </span>
                    <span v-else>
                      {{ t('cards.filter.label.type') }}
                    </span>
                  </div>
                  <img
                    v-if="!filterType"
                    src="/assets/img/icons/dropdown.svg"
                    class="transition-transform"
                    :class="[open && 'transform rotate-180']"
                  />
                  <img
                    @click.prevent="filterType = undefined"
                    v-else
                    class="cursor-pointer"
                    src="/assets/img/icons/clear.svg"
                  />
                </div>
              </template>
              <template #option="{ option }">
                <span class="text-[#1C1D23] text-14-500-20">
                  {{ t(`cards.list.type.${option.type}`) }}
                </span>
              </template>
            </BaseSingleSelect>
          </div>

          <!-- Category -->
          <div class="col-span-1 sm:col-auto">
            <BaseMultipleSelect
              ref="filterCat"
              class="w-full sm:w-[200px]"
              multiple
              searchable
              :searchable-placeholder="'Search categories'"
              :options="categoryOptions"
              v-model="payload.category"
            >
              <template #default="{ open: open }">
                <div
                  class="px-3 py-[6px] w-full rounded-[36px] bg-[#f0f2f5] border flex items-center justify-between"
                  :class="open ? 'border-[#FF5524]' : 'border-[f0f2f5]'"
                >
                  <div class="text-12-500-20 text-[#7A7D89]">
                    <span v-if="payload.category.length == 1">
                      {{ t(`cards.list.category.${payload.category[0]}`) }}
                    </span>
                    <span v-else-if="payload.category.length > 1" class="text-12-500-20 text-[#7A7D89]">
                      {{ payload.category.length }} selected
                    </span>
                    <span v-else>
                      {{ t('cards.filter.label.category') }}
                    </span>
                  </div>
                  <img
                    v-if="!payload.category.length"
                    src="/assets/img/icons/dropdown.svg"
                    class="transition-transform"
                    :class="[open && 'transform rotate-180']"
                  />
                  <img
                    @click.prevent="clearFilterCategory()"
                    v-else
                    class="cursor-pointer"
                    src="/assets/img/icons/clear.svg"
                    alt=""
                  />
                </div>
              </template>
              <template #option="{ option: category }">
                <div class="flex flex-row gap-[9px]">
                  <UCheckbox
                    @click.prevent
                    :model-value="isCategorySelected(category)"
                    :ui="{
                      base: 'cursor-pointer',
                    }"
                  />
                  <span class="text-[#1C1D23] text-14-500-20">
                    {{ t(`cards.list.category.${category}`) }}
                  </span>
                </div>
              </template>
            </BaseMultipleSelect>
          </div>

          <div class="hidden sm:block">
            <img src="~/assets/img/common/line.svg" alt="" />
          </div>

          <!-- Status -->
          <div class="col-span-1 sm:col-auto">
            <BaseMultipleSelect
              class="w-full sm:w-[150px]"
              multiple
              :options="statusOptions"
              v-model="payload.card_status"
            >
              <template #default="{ open: open }">
                <div
                  class="px-3 py-[6px] w-full rounded-[36px] bg-[#f0f2f5] border flex items-center justify-between"
                  :class="open ? 'border-[#FF5524]' : 'border-[f0f2f5]'"
                >
                  <div class="text-12-500-20 text-[#7A7D89]">
                    <span v-if="payload.card_status.length == 1">
                      {{ t(`cards.list.status.${payload.card_status[0]}`) }}
                    </span>
                    <span v-else-if="payload.card_status.length > 1" class="text-12-500-20 text-[#7A7D89]">
                      {{ payload.card_status.length }} selected
                    </span>
                    <span v-else>
                      {{ t('cards.filter.label.status') }}
                    </span>
                  </div>
                  <img
                    v-if="!payload.card_status.length"
                    src="/assets/img/icons/dropdown.svg"
                    class="transition-transform"
                    :class="[open && 'transform rotate-180']"
                  />
                  <img
                    @click.prevent="payload.card_status = []"
                    v-else
                    class="cursor-pointer"
                    src="/assets/img/icons/clear.svg"
                    alt=""
                  />
                </div>
              </template>
              <template #option="{ option: status }">
                <div class="flex flex-row gap-[9px]">
                  <UCheckbox
                    @click.prevent
                    :model-value="isStatusSelected(status)"
                    :ui="{
                      base: 'cursor-pointer',
                    }"
                  />
                  <span class="text-[#1C1D23] text-14-500-20">
                    {{ t(`cards.list.status.${status}`) }}
                  </span>
                </div>
              </template>
            </BaseMultipleSelect>
          </div>

          <div class="hidden sm:block">
            <img src="~/assets/img/common/line.svg" alt="" />
          </div>

          <!-- Active / Total Stats -->
          <div class="col-span-1 sm:col-auto flex flex-col sm:flex-row gap-2 sm:gap-5">
            <div class="text-[#7A7D89] text-12-500-20">
              {{ t('cards.filter.label.amount', { active: activeCardCount, total: totalCreatedCard }) }}
            </div>
            <div class="hidden sm:block">
              <img src="~/assets/img/common/line.svg" alt="" />
            </div>
            <div class="text-[#1C1D23] text-12-600-20">
              {{ t('cards.filter.label.total', { amount: formatMoney(totalBalanceCard) }) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Cards selected -->
    <div v-else class="flex flex-row justify-between items-start">
      <!-- Buttons -->
      <div class="flex flex-col gap-[10px] flex-1">
        <div class="flex flex-row gap-[10px]">
          <UButton
            class="flex items-center justify-center rounded-[49px] bg-[#FF5524] hover:bg-[#EE4413] px-4 py-3 w-[168px] cursor-not-allowed"
          >
            <div class="text-white text-16-600-24">
              {{ t('cards.button.topup') }}
            </div>
          </UButton>
          <UButton
            class="flex items-center justify-center rounded-[49px] bg-[#F0F2F5] hover:bg-[#E1E3E6] px-3 sm:px-4 py-2 sm:py-3 w-[120px] sm:w-[168px] cursor-not-allowed"
          >
            <div class="text-[#1C1D23] text-14-600-20 sm:text-16-600-24">
              {{ t('cards.button.withdraw') }}
            </div>
          </UButton>
          <UButton
            class="flex items-center justify-center rounded-[49px] bg-[#F0F2F5] hover:bg-[#E1E3E6] px-4 py-2 w-[168px] cursor-not-allowed"
          >
            <div class="text-[#1C1D23] text-16-600-24">
              {{ t('cards.button.freeze') }}
            </div>
          </UButton>
          <UButton
            class="flex items-center justify-center rounded-[49px] bg-[#F0F2F5] hover:bg-[#E1E3E6] px-4 py-2 w-[168px] cursor-not-allowed"
          >
            <div class="text-[#1C1D23] text-16-600-24">
              {{ t('cards.button.unfreeze') }}
            </div>
          </UButton>
          <UButton
            class="flex items-center justify-center rounded-[49px] bg-[#F0F2F5] hover:bg-[#E1E3E6] px-4 py-2 w-[168px] cursor-not-allowed"
          >
            <div class="text-[#ED2C38] text-16-600-24">
              {{ t('cards.button.cancel') }}
            </div>
          </UButton>
        </div>
        <div class="flex items-center gap-5 my-3">
          <div class="text-[#7A7D89] text-12-500-20">
            {{
              t('cards.filter.label.amountSelected', {
                selected: selectedCardList.length,
                total: cardList.length,
              })
            }}
          </div>
          <img src="~/assets/img/common/line.svg" alt="" />
          <div class="text-[#1C1D23] text-12-600-20">
            {{ t('cards.filter.label.total', { amount: formatMoney(totalSelectedAmount) }) }}
          </div>
        </div>
      </div>
      <!-- Close -->
      <img @click="clearSelected" class="cursor-pointer hover:opacity-70" src="~/assets/img/common/close.svg" alt="" />
    </div>
    <div class="rounded-[12px] flex flex-col border border-[#D7D9E5] mb-8 w-full grow">
      <!-- Table -->
      <div
        v-if="!cardList?.length && !loading.cardTable"
        class="flex flex-col items-center justify-center gap-4 h-full grow"
      >
        <img src="~/assets/img/dashboard/no-transaction.svg" alt="" />
        <div class="text-14-500-20 text-[#A5A8B8]">{{ t('cards.list.empty') }}</div>
      </div>
      <UTable
        v-else
        selectable
        ref="tableRef"
        :loading="loading.cardTable"
        :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
        v-model="selectedCardList"
        :rows="cardList"
        @select="handleClickCard"
        :columns="cardTableColumns"
        :ui="{
          default: {
            checkbox: {
              color: '[#000000]',
            },
          },
          divide: 'divide-y divide-[#D7D9E5]/0',
          tbody: 'divide-y divide-[#D7D9E5]',
          td: {
            padding: 'px-2 sm:px-3 py-4',
          },
          checkbox: {
            padding: 'px-2 ps-2 sm:ps-4',
          },
          tr: {
            base: '',
            padding: 'px-0 py-0',
            selected: 'bg-[#F0F2F5]',
          },
          th: {
            padding: 'px-2 sm:px-3 py-4',
          },
          thead: 'bg-[#FFEEE9]',
          emptyState: {
            label: 'text-md text-center',
            icon: '',
          },
        }"
        class="table-wrapper grow overflow-x-auto"
      >
        <template #card-data="{ row }">
          <div class="flex flex-row items-center gap-2 sm:gap-[14px] min-w-[240px]">
            <img :src="`/images/cards/${row.card_type}.png`" class="w-8 h-8 sm:w-auto sm:h-auto" alt="" />
            <div class="flex flex-col gap-1">
              <BaseTruncatedTooltip
                class="text-12 sm:text-14-600-20 text-[#1C1D23] max-w-[120px] sm:max-w-[180px]"
                :text="row?.card_name"
              />
              <span class="text-11 sm:text-12-500-20 text-[#7A7D89]">
                {{ t(`cards.list.card_number`, { value: row?.last_four }) }}</span
              >
            </div>
          </div>
        </template>
        <template #type-data="{ row }">
          <div class="flex justify-center w-[100px] sm:w-[120px]">
            <!-- <img :src="`/icons/cards/${row.card_type}.svg`" class="w-6 h-6 sm:w-auto sm:h-auto" alt="" /> -->
            <div class="text-[#7A7D89]">
              {{ t(`cards.list.type.${row.card_type}`) }}
            </div>
          </div>
        </template>
        <template #category-data="{ row }">
          <div class="flex justify-center">
            <div
              class="px-3 sm:px-3 py-[2px] flex items-center justify-center rounded-[5px] gap-1 bg-[#F0F2F5] border border-[#D7D9E5]"
              :style="{ background: isCardSelected(row) ? 'white' : '#F0F2F5' }"
            >
              <div class="text-[#1C1D23] text-11 sm:text-12-500-20">{{ t(`cards.list.category.${row.category}`) }}</div>
              <img :src="getIconCategory(row)" class="w-4 h-4 sm:w-auto sm:h-auto" />
            </div>
          </div>
        </template>
        <template #balance-data="{ row }">
          <div class="text-14 sm:text-16-700-24 w-[120px] sm:w-[150px] text-[#1C1D23] text-center">
            ${{ formatMoney(row.balance) }}
          </div>
        </template>
        <template #total_top_up-data="{ row }">
          <div class="text-14 sm:text-16-700-24 w-[120px] sm:w-[150px] text-[#2EA518] text-center">
            ${{ row.total_top_up ? formatMoney(row.total_top_up) : 0.0 }}
          </div>
        </template>
        <template #total_withdraw-data="{ row }">
          <div class="text-14 sm:text-16-700-24 w-[120px] sm:w-[150px] text-[#ED2C38] text-center">
            ${{ row.total_withdraw ? formatMoney(row.total_withdraw) : 0.0 }}
          </div>
        </template>
        <template #created_at-data="{ row }">
          <div class="text-12 sm:text-14-500-20 w-[120px] sm:w-[150px] text-[#7A7D89] text-center">
            {{ formatDDMMYYYY(dayjs.utc(row.created_at).local()) }}
          </div>
        </template>
        <template #status-data="{ row }">
          <div
            class="flex flex-row gap-[6px] w-[90px] sm:w-[100px] items-center justify-center mx-auto px-2 sm:px-3 py-[2px] rounded-[110px]"
            :style="{ color: getStatusColor(row?.card_status), background: isCardSelected(row) ? 'white' : '#F0F2F5' }"
          >
            <div class="text-11 sm:text-12-500-20">
              {{ t(`cards.list.status.${row.card_status}`) }}
            </div>
            <div
              class="w-[4px] sm:w-[6px] h-[4px] sm:h-[6px] rounded-[1px]"
              :style="{ background: getStatusColor(row?.card_status) }"
            ></div>
          </div>
        </template>
        <template #action-data="{ row }">
          <UButton
            v-if="row.card_status === CardStatus.ACTIVE"
            @click.stop="onClickTopup(row)"
            class="flex items-center py-1 sm:py-[6px] px-2 sm:px-4 mx-2 sm:mx-4 bg-[#1C1D23] hover:bg-[#3D3E34] rounded-[6px]"
          >
            <div class="text-11 sm:text-12-600-20 text-white">
              {{ t('cards.button.topup') }}
            </div>
          </UButton>
          <div v-else class="w-[80px] sm:w-[104px]"></div>
        </template>
      </UTable>
      <div
        class="flex flex-row justify-between sm:justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700 gap-3 sm:gap-10 items-center"
      >
        <USelectMenu
          v-model="payload.limit"
          :options="limitOptions"
          class="hidden sm:block w-[150px] sm:w-auto"
          :selected-icon="'i-selected'"
        >
          <template #option="{ option }">
            <div class="text-14-500-20">{{ t(`cards.list.pagination.limit`, { limit: option }) }}</div>
          </template>
          <template #default="{ open: open }">
            <div class="px-3 py-[6px] w-full rounded-[36px] border flex items-center justify-between">
              <div class="text-14-500-20 text-[#1C1D23] w-[152px] px-2 py-1">
                {{ t(`cards.list.pagination.limit`, { limit: limit }) }}
              </div>
              <img
                src="/assets/img/icons/dropdown.svg"
                class="transition-transform"
                :class="[open && 'transform rotate-180']"
              />
            </div>
          </template>
        </USelectMenu>
        <div class="flex-1 sm:flex-none flex justify-center sm:justify-end">
          <BasePagination
            @update:model-value="onChangePage"
            :model-value="payload.page"
            :limit="payload.limit"
            :total="cardCount"
          />
        </div>
      </div>
      <ConfirmModal
        v-model="isVisibleConfirmFreeze"
        @confirm="handleFreeze"
        :title="t('cards.modals.freeze.title')"
        :message="t('cards.modals.freeze.message')"
        :confirm-label="t('cards.modals.freeze.label.confirm')"
        :cancel-label="t('cards.modals.freeze.label.cancel')"
        :loading="cardStore.isLoading.freezeCard"
      />

      <ConfirmModal
        v-model="isVisibleConfirmCancel"
        @confirm="handleCancel"
        :title="t('cards.modals.cancel.title')"
        :message="t('cards.modals.cancel.message')"
        :confirm-label="t('cards.modals.cancel.label.confirm')"
        :cancel-label="t('cards.modals.cancel.label.cancel')"
        :bg-confirm="`!bg-[#ED2C38] hover:bg-[#ED2C38]`"
        :loading="cardStore.isLoading.cancelCard"
      />
      <ConfirmModal
        v-model="isVisibleConfirmUnfreeze"
        @confirm="handleUnfreeze"
        :title="t('cards.modals.unfreeze.title')"
        :message="t('cards.modals.unfreeze.message')"
        :confirm-label="t('cards.modals.unfreeze.label.confirm')"
        :cancel-label="t('cards.modals.unfreeze.label.cancel')"
        :loading="cardStore.isLoading.unfreezeCard"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
::-webkit-scrollbar-thumb {
  background: #888888;
}
::-webkit-scrollbar-track {
  background: #f0f0f0;
}
</style>
