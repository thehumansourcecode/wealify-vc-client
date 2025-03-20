<script setup lang="ts">
definePageMeta({
  layout: 'home',
})
import { formatDDMMYYYY, formatMoney, normalize } from '~/common/functions'
import { CardCategory, CardStatus, CardType, type ICardData } from '~/types/cards'

const { t } = useI18n()
const dayjs = useDayjs()

const cardStore = useCardStore()
const payload = computed(() => cardStore.payload)
const filteredCardList = computed(() => cardStore.filteredCardList)
const selectedCardList = ref([])

function isCardSelected(card: ICardData) {
  return selectedCardList.value.some((selectedCard: ICardData) => selectedCard.id === card.id)
}

const activeCardList = computed(() =>
  filteredCardList.value.filter((card: ICardData) => card.status === CardStatus.ACTIVE),
)

const totalSelectedAmount = computed(() => {
  const cardListAmount = selectedCardList.value.map((selectedCard: ICardData) => selectedCard.balance)
  return cardListAmount.reduce((a: number, b: number) => a + b, 0)
})
const totalActiveAmount = computed(() => {
  const cardListAmount = activeCardList.value.map((activeCard: ICardData) => activeCard.balance)
  return cardListAmount.reduce((a: number, b: number) => a + b, 0)
})

const rows = computed(() => {
  return filteredCardList.value.slice((page.value - 1) * limit.value, page.value * limit.value)
})

const typeOptions = Object.values(CardType)
const categoryOptions = Object.values(CardCategory)
const statusOptions = Object.values(CardStatus)

function isCategorySelected(category: CardCategory) {
  return payload.value.categories.includes(category)
}

function isStatusSelected(status: CardStatus) {
  return payload.value.statuses.includes(status)
}

const cardTableColumns = [
  {
    key: 'card',
    label: t('cards.list.header.card'),
    class: 'mr-5 w-[max-content]',
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
    key: 'totalTopup',
    label: t('cards.list.header.totalTopup'),
    class: 'text-center mr-5 w-[150px]',
  },
  {
    key: 'totalWithdraw',
    label: t('cards.list.header.totalWithdraw'),
    class: 'mr-5 text-center w-[150px]',
  },
  {
    key: 'createdAt',
    label: t('cards.list.header.createdAt'),
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
  if (status === CardStatus.CANCEL) {
    return '#ED2C38'
  }
  if (status === CardStatus.ACTIVE) {
    return '#2EA518'
  }
  if (status === CardStatus.FREEZE) {
    return '#7A7D89'
  }
}

function onClickTopup() {
  console.log('click topup')
}

function clearSelected() {
  selectedCardList.value = []
}

const page = ref(1)
const limitOptions = ref([10, 30, 50])
const limit = ref(limitOptions.value[0])

watch(
  () => [page.value, limit.value],
  () => {
    clearSelected()
  },
)

function onChangeLimit() {
  page.value = 1
}

function handleClickCard(row) {
  const id = row.id
  const selectedCardDetail = filteredCardList.value.find((card: ICardData) => card.id === id)
  if (selectedCardDetail) {
    cardStore.setSelectedCardDetail(selectedCardDetail)
    cardStore.toggleCardDetailSlideover(true)
  }
}
</script>
<template>
  <div class="flex flex-col overflow-y-auto pl-10 pr-[60px] flex-1 gap-6 mt-7">
    <!-- Cards not selected -->
    <div v-if="!selectedCardList?.length" class="flex flex-row justify-between items-start gap-[100px]">
      <div class="flex flex-col gap-[10px] flex-1">
        <BaseInput
          input-class="input-field rounded-49"
          class="w-[80%]"
          v-model="payload.keyword"
          leading
          :leading-img="'/icons/common/search.svg'"
          :placeholder="t('cards.filter.placeholder.search')"
          autocomplete="off"
        />
        <!-- Filters -->
        <div class="flex flex-row gap-5 items-center">
          <!-- Type -->
          <BaseSingleSelect
            class="w-[150px]"
            :options="typeOptions"
            v-model="payload.type"
            :selected-icon="'i-selected'"
          >
            <template #default="{ open: open }">
              <div
                class="px-3 py-[6px] w-full rounded-[36px] bg-[#f0f2f5] border flex items-center justify-between"
                :class="open ? 'border-[#FF5524]' : 'border-[f0f2f5]'"
              >
                <div class="text-12-500-20 text-[#7A7D89]">
                  <span v-if="payload.type">
                    {{ t(`cards.list.type.${payload.type}`) }}
                  </span>
                  <span v-else>
                    {{ t('cards.filter.label.type') }}
                  </span>
                </div>
                <img
                  v-if="!payload.type"
                  src="/assets/img/icons/dropdown.svg"
                  class="transition-transform"
                  :class="[open && 'transform rotate-180']"
                />
                <img
                  @click.prevent="payload.type = undefined"
                  v-else
                  class="cursor-pointer"
                  src="/assets/img/icons/clear.svg"
                  alt=""
                />
              </div>
            </template>
            <template #option="{ option: type }">
              <span class="text-[#1C1D23] text-14-500-20">
                {{ t(`cards.list.type.${type}`) }}
              </span>
            </template>
          </BaseSingleSelect>

          <img src="~/assets/img/common/line.svg" alt="" />

          <!-- Category -->
          <BaseMultipleSelect
            class="w-[200px]"
            multiple
            searchable
            :searchable-placeholder="'Search categories'"
            :options="categoryOptions"
            v-model="payload.categories"
          >
            <template #default="{ open: open }">
              <div
                class="px-3 py-[6px] w-full rounded-[36px] bg-[#f0f2f5] border flex items-center justify-between"
                :class="open ? 'border-[#FF5524]' : 'border-[f0f2f5]'"
              >
                <div class="text-12-500-20 text-[#7A7D89]">
                  <span v-if="payload.categories.length == 1">
                    {{ t(`cards.list.category.${payload.categories[0]}`) }}
                  </span>
                  <span v-else-if="payload.categories.length > 1" class="text-12-500-20 text-[#7A7D89]">
                    {{ payload.categories.length }} selected
                  </span>
                  <span v-else>
                    {{ t('cards.filter.label.category') }}
                  </span>
                </div>
                <img
                  v-if="!payload.categories.length"
                  src="/assets/img/icons/dropdown.svg"
                  class="transition-transform"
                  :class="[open && 'transform rotate-180']"
                />
                <img
                  @click.prevent="payload.categories = []"
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

          <img src="~/assets/img/common/line.svg" alt="" />

          <!-- Status -->
          <BaseMultipleSelect class="w-[150px]" multiple :options="statusOptions" v-model="payload.statuses">
            <template #default="{ open: open }">
              <div
                class="px-3 py-[6px] w-full rounded-[36px] bg-[#f0f2f5] border flex items-center justify-between"
                :class="open ? 'border-[#FF5524]' : 'border-[f0f2f5]'"
              >
                <div class="text-12-500-20 text-[#7A7D89]">
                  <span v-if="payload.statuses.length == 1">
                    {{ t(`cards.list.status.${payload.statuses[0]}`) }}
                  </span>
                  <span v-else-if="payload.statuses.length > 1" class="text-12-500-20 text-[#7A7D89]">
                    {{ payload.statuses.length }} selected
                  </span>
                  <span v-else>
                    {{ t('cards.filter.label.status') }}
                  </span>
                </div>
                <img
                  v-if="!payload.statuses.length"
                  src="/assets/img/icons/dropdown.svg"
                  class="transition-transform"
                  :class="[open && 'transform rotate-180']"
                />
                <img
                  @click.prevent="payload.statuses = []"
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
                  @click.passive
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

          <img src="~/assets/img/common/line.svg" alt="" />

          <!-- Active / Total -->
          <div class="text-[#7A7D89] text-12-500-20">
            {{ t('cards.filter.label.amount', { active: activeCardList.length, total: filteredCardList.length }) }}
          </div>
          <img src="~/assets/img/common/line.svg" alt="" />
          <div class="text-[#1C1D23] text-12-600-20">
            {{ t('cards.filter.label.total', { amount: formatMoney(totalActiveAmount) }) }}
          </div>
        </div>
      </div>
      <div class="flex flex-row gap-[10px]">
        <UButton
          class="flex items-center justify-center rounded-[49px] bg-[#F0F2F5] hover:bg-[#E1E3E6] px-4 py-3 w-[168px]"
        >
          <div class="text-[#1C1D23] text-16-600-24">
            {{ t('cards.button.withdraw') }}
          </div>
        </UButton>
        <UButton
          class="flex items-center justify-center rounded-[49px] bg-[#FF5524] hover:bg-[#EE4413] px-4 py-2 w-[168px]"
          @click="navigateTo('/cards/issue')"
        >
          <div class="text-white text-16-600-24">
            {{ t('cards.button.issue') }}
          </div>
        </UButton>
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
            class="flex items-center justify-center rounded-[49px] bg-[#F0F2F5] hover:bg-[#E1E3E6] px-4 py-2 w-[168px] cursor-not-allowed"
          >
            <div class="text-[#1C1D23] text-16-600-24">
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
                total: filteredCardList.length,
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
    <div class="rounded-[12px] flex flex-col border border-[#D7D9E5] mb-8 overflow-x-auto w-full grow">
      <!-- Table -->
      <UTable
        selectable
        v-model="selectedCardList"
        v-if="filteredCardList?.length"
        :rows="rows"
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
            padding: 'px-3 py-4',
          },
          checkbox: {
            padding: 'px-2 ps-4',
          },
          tr: {
            base: '',
            padding: 'px-0 py-0',
            selected: 'bg-[#F0F2F5]',
          },
          th: {
            padding: 'px-3 py-4',
          },
          thead: 'bg-[#FFEEE9]',
          emptyState: {
            label: 'text-md text-center',
            icon: '',
          },
        }"
        class="table-wrapper grow"
      >
        <template #card-data="{ row }">
          <div class="flex flex-row items-center gap-[14px] w-[200px]">
            <img src="/icons/dashboard/mastercard.svg" alt="" />
            <div class="flex flex-col gap-1">
              <span class="text-14-600-20 text-[#1C1D23]">{{ row?.cardName }}</span>
              <span class="text-12-500-20 text-[#7A7D89]"> {{ row?.cardNumber }}</span>
            </div>
          </div>
        </template>
        <template #type-data="{ row }">
          <div class="w-16 flex justify-center">
            <img :src="`/icons/cards/${row.type}.svg`" alt="" />
          </div>
        </template>
        <template #category-data="{ row }">
          <div class="flex justify-center w-[172px]">
            <div
              class="px-3 py-[2px] flex items-center justify-center rounded-[5px] gap-1 bg-[#F0F2F5] border border-[#D7D9E5] max-w-[180px]"
              :style="{ background: isCardSelected(row) ? 'white' : '#F0F2F5' }"
            >
              <div class="text-[#1C1D23] text-12-500-20">{{ t(`cards.list.category.${row.category}`) }}</div>
              <img :src="`/icons/cards/category/${row.category}.svg`" alt="" />
            </div>
          </div>
        </template>
        <template #balance-data="{ row }">
          <div class="text-16-700-24 w-[150px] text-[#1C1D23] text-center">${{ formatMoney(row.balance) }}</div>
        </template>
        <template #totalTopup-data="{ row }">
          <div class="text-16-700-24 w-[150px] text-[#2EA518] text-center">${{ formatMoney(row.totalTopup) }}</div>
        </template>
        <template #totalWithdraw-data="{ row }">
          <div class="text-16-700-24 w-[150px] text-[#ED2C38] text-center">${{ formatMoney(row.totalWithdraw) }}</div>
        </template>
        <template #createdAt-data="{ row }">
          <div class="text-14-500-20 w-[150px] text-[#7A7D89] text-center">
            {{ formatDDMMYYYY(dayjs.utc(row.createdAt).local()) }}
          </div>
        </template>
        <template #status-data="{ row }">
          <div
            class="flex flex-row gap-[6px] w-[100px] items-center justify-center mx-auto px-3 py-[2px] rounded-[110px]"
            :style="{ color: getStatusColor(row?.status), background: isCardSelected(row) ? 'white' : '#F0F2F5' }"
          >
            <div class="text-12-500-20">
              {{ t(`cards.list.status.${row.status}`) }}
            </div>
            <div class="w-[6px] h-[6px] rounded-[1px]" :style="{ background: getStatusColor(row?.status) }"></div>
          </div>
        </template>
        <template #action-data="{ row }">
          <UButton
            v-if="row.status === CardStatus.ACTIVE"
            @click="onClickTopup"
            class="flex items-center py-[6px] px-4 mx-4 bg-[#1C1D23] hover:bg-[#3D3E34] rounded-[6px]"
          >
            <div class="text-12-600-20 text-white">
              {{ t('cards.button.topup') }}
            </div>
          </UButton>
          <div v-else class="w-[104px]"></div>
        </template>
      </UTable>

      <div v-else class="flex flex-col items-center justify-center gap-4 h-full grow">
        <img src="~/assets/img/dashboard/no-transaction.svg" alt="" />
        <div class="text-14-500-20 text-[#A5A8B8]">{{ t('cards.list.empty') }}</div>
      </div>

      <div
        v-if="filteredCardList?.length > limit"
        class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700 gap-10 items-center"
      >
        <USelectMenu v-model="limit" :options="limitOptions" @change="onChangeLimit">
          <template #option="{ option }">
            <div class="text-12-500-20">{{ t(`cards.list.pagination.limit`, { limit: option }) }}</div>
          </template>
          <div class="border border-[#D7D9E5] rounded-[90px] py-[10px] pl-5 pr-4 flex flex-row gap-8">
            <div class="text-14-500-20 text-[#1C1D23]">
              {{ t(`cards.list.pagination.limit`, { limit: limit }) }}
            </div>
            <img src="assets/img/icons/dropdown.svg" alt="" />
          </div>
        </USelectMenu>
        <UPagination
          size="md"
          :max="6"
          v-model="page"
          :page-count="limit"
          :total="filteredCardList?.length"
          class="pagination-custom"
          :active-button="{
            color: '',
            variant: 'ghost',
            class: 'bg-[#FF5524] rounded-full w-10 h-10 text-center justify-center text-white p-3',
          }"
          :inactive-button="{
            color: '',
            variant: 'ghost',
            class: 'rounded-full border border-[#D7D9E5] w-10 h-10 justify-center',
          }"
          :ui="{
            wrapper: 'flex items-center -space-x-px gap-[6px]',
            default: {
              activeButton: {},
            },
          }"
        >
          <template #prev="{ onClick, canGoPrev }">
            <UTooltip text="Previous page">
              <UButton class="p-0 shadow-none bg-[#FFFFFF] hover:bg-[#FFFFFF]" @click="onClick">
                <img
                  :class="canGoPrev ? '' : 'opacity-50 cursor-not-allowed'"
                  src="~/assets/img/icons/back.svg"
                  alt=""
                />
              </UButton>
            </UTooltip>
          </template>
          <template #next="{ onClick, canGoNext }">
            <UTooltip text="Next page">
              <UButton class="p-0 shadow-none bg-[#FFFFFF] hover:bg-[#FFFFFF]" @click="onClick">
                <img
                  :class="canGoNext ? '' : 'opacity-50 cursor-not-allowed'"
                  src="~/assets/img/icons/next.svg"
                  alt=""
                />
              </UButton>
            </UTooltip>
          </template>
        </UPagination>
      </div>
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
