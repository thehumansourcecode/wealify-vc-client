<script setup lang="ts">
definePageMeta({
  layout: 'home',
})

const { t } = useI18n()
const cardStore = useCardStore()

const cardList = computed(() => cardStore.cardList)

const selected = ref([cardList.value[1]])

const cardTableColumns = [
  {
    key: 'card',
    label: t('card.list.header.card'),
    class: 'mr-5',
  },
  {
    key: 'type',
    label: t('card.list.header.type'),
    class: 'mr-5 text-center',
  },
  {
    key: 'category',
    label: t('card.list.header.category'),
    class: 'mr-5 text-center',
  },
  {
    key: 'balance',
    label: t('card.list.header.balance'),
    class: 'text-center mr-5 text-center',
  },
  {
    key: 'totalTopup',
    label: t('card.list.header.totalTopup'),
    class: 'text-center mr-5 text-center',
  },
  {
    key: 'totalSpend',
    label: t('card.list.header.totalSpend'),
    class: 'mr-5 text-center',
  },
  {
    key: 'createdAt',
    label: t('card.list.header.createdAt'),
    class: 'text-center mr-5',
  },
  {
    key: 'action',
    label: t('card.list.header.action'),
    class: 'text-center',
  },
]

function onClickTopup() {
  console.log('click topup')
}
</script>
<template>
  <div class="flex flex-col overflow-y-auto pl-10 pr-[60px] flex-1 gap-6">
    <div class="flex flex-row justify-between items-start gap-[200px]">
      <div class="flex flex-col gap-[10px] flex-1">
        <BaseInput
          input-class="input-field"
          class="w-full"
          leading
          :leading-img="'/icons/common/search.svg'"
          :placeholder="$t('card.filter.placeholder.search')"
          autocomplete="off"
        />
        <div>456</div>

      </div>
      <div class="flex flex-row gap-[10px]">
        <UButton
          class="flex items-center justify-center rounded-[49px] bg-[#F0F2F5] hover:bg-[#E1E3E6] px-4 py-3 w-[168px]"
        >
          <div class="text-[#1C1D23] text-16-600-24">
            {{ t('card.button.withdraw') }}
          </div>
        </UButton>
        <UButton
          class="flex items-center justify-center rounded-[49px] bg-[#FF5524] hover:bg-[#EE4413] px-4 py-2 w-[168px]"
        >
          <div class="text-white text-16-600-24">
            {{ t('card.button.topup') }}
          </div>
        </UButton>
      </div>
    </div>

    <div class="rounded-[12px] flex flex-col border border-[#D7D9E5] mb-8 overflow-hidden">
      <!-- Table -->
      <UTable
        selectable
        v-model="selected"
        v-if="cardList?.length"
        :rows="cardList"
        :columns="cardTableColumns"
        :ui="{
          default: {
            checkbox: {
              color: '[#000000]',
            },
          },
          divide: 'divide-y divide-[#D7D9E5]/0',
          tbody: 'divide-y divide-[#D7D9E5] max-h-[400px]',
          td: {
            padding: 'px-5 py-4',
          },
          tr: {
            base: '',
            padding: 'px-0 py-0',
            selected: 'bg-[#F0F2F5]',
          },
          th: {
            padding: 'px-5 py-4',
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
          <div class="flex flex-row items-center gap-[14px] w-[218px]">
            <img src="/icons/dashboard/mastercard.svg" alt="" />
            <div class="flex flex-col gap-1">
              <span class="text-14-600-20">{{ row?.cardName }}</span>
              <span class="text-12-500-20 text-[#7A7D89]"> {{ row?.cardNumber }}</span>
            </div>
          </div>
        </template>
        <template #type-data="{ row }">
          <div class="text-14-500-20 w-[160px] text-[#7A7D89]">{{ row.type }}</div>
        </template>
        <template #category-data="{ row }">
          <div class="text-16-700-24 w-[150px] text-[#1C1D23] text-center">
            {{ row.category }}
          </div>
        </template>
        <template #balance-data="{ row }">
          <div class="text-14-500-20 w-[120px] text-[#FF5524] text-center">{{ row.balance }}</div>
        </template>
        <template #totalTopup-data="{ row }">
          <div class="text-14-500-20 w-[120px] text-[#FF5524] text-center">{{ row.totalTopup }}</div>
        </template>
        <template #totalSpend-data="{ row }">
          <div class="text-14-500-20 w-[120px] text-[#FF5524] text-center">{{ row.totalSpend }}</div>
        </template>
        <template #createdAt-data="{ row }">
          {{ row.createdAt }}
        </template>
        <template #action-data="{}">
          <UButton
            @click="onClickTopup"
            class="flex items-center py-[6px] px-4 bg-[#1C1D23] hover:bg-[#3D3E34] rounded-[6px] mx-auto"
          >
            <div class="text-12-600-20 text-white">
              {{ t('card.button.topup') }}
            </div>
          </UButton>
        </template>
      </UTable>
      <div v-else class="flex flex-col items-center justify-center gap-4 h-full">
        <img src="~/assets/img/dashboard/no-transaction.svg" alt="" />
        <div class="text-14-500-20 text-[#A5A8B8]">{{ t('dashboard.transactions.table.empty') }}</div>
      </div>
    </div>
  </div>
</template>

