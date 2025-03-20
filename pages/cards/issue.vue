<script setup lang="ts">
definePageMeta({
  layout: 'home',
})
import { formatMoneyWithoutDecimals, getCountryCode } from '~/common/functions'
import { CardType, type IIssueCardParams } from '~/types/cards'
import { CommonCountry, CommonCurrency, PanelChildTab, PanelTab } from '~/types/common'
import type { FormError } from '#ui/types'
import { validator } from '~/common/validator'

const { t } = useI18n()

const commonStore = useCommonStore()
const cardStore = useCardStore()
const loading = computed(() => cardStore.isLoading)

onMounted(() => {
  commonStore.setHeaderBackLayout(true)
  commonStore.setActiveTab(PanelTab.CARD_LIST)
  commonStore.setActiveChildTab(PanelChildTab.CARD_ISSUE)
  cardStore.getDropdownCategoryList()
})

onUnmounted(() => {
  commonStore.setHeaderBackLayout(false)
  commonStore.setActiveChildTab(undefined)
})

const countryCodeOptions = [
  {
    country: CommonCountry.INDONESIA,
    flag: `/icons/flags/${CommonCountry.INDONESIA}.svg`,
  },
  {
    country: CommonCountry.MYANMAR,
    flag: `/icons/flags/${CommonCountry.MYANMAR}.svg`,
  },
  {
    country: CommonCountry.THAILAND,
    flag: `/icons/flags/${CommonCountry.THAILAND}.svg`,
  },
  {
    country: CommonCountry.VIETNAM,
    flag: `/icons/flags/${CommonCountry.VIETNAM}.svg`,
  },
  {
    country: CommonCountry.MALAYSIA,
    flag: `/icons/flags/${CommonCountry.MALAYSIA}.svg`,
  },
  {
    country: CommonCountry.PHILIPPINES,
    flag: `/icons/flags/${CommonCountry.PHILIPPINES}.svg`,
  },
  {
    country: CommonCountry.LAOS,
    flag: `/icons/flags/${CommonCountry.LAOS}.svg`,
  },
  {
    country: CommonCountry.CAMBODIA,
    flag: `/icons/flags/${CommonCountry.CAMBODIA}.svg`,
  },
  {
    country: CommonCountry.EAST_TIMOR,
    flag: `/icons/flags/${CommonCountry.EAST_TIMOR}.svg`,
  },
  {
    country: CommonCountry.BRUNEI,
    flag: `/icons/flags/${CommonCountry.BRUNEI}.svg`,
  },
  {
    country: CommonCountry.SINGAPORE,
    flag: `/icons/flags/${CommonCountry.SINGAPORE}.svg`,
  },
]

const isSubmitEnabled = ref(true)

const cardCategoryOptions = computed(() => cardStore.categoryList)

const originalNumericValue = ref<number>()

const issueCardFee = computed(() => 0)

const currentBalance = computed(() => 100)

const countryCode = ref({
  country: CommonCountry.VIETNAM,
  flag: `/icons/flags/${CommonCountry.VIETNAM}.svg`,
})

const form = reactive<IIssueCardParams>({
  card_type: CardType.VIRTUAL,
  card_name: '', //req, max 50 char, ko dấu
  email: '', //req, max 128, chữ số ký tự, auto trim, chặn
  country_code: CommonCountry.VIETNAM,
  phone_number: '', // req, nếu có thì = sđt user đã add, nếu ko thì rỗng. Max 15, trim, chặn
  category: undefined, // req, default = Travel. Lấy từ API GET List Reporting fields,
  card_purpose: '', // max = 128, chặn
  spend_limit: 1000, // nhập số nguyên dương. nếu = 0 hiển inline msg
})

const validate = (form: IIssueCardParams): FormError[] => {
  const errors = []
  if (!form.card_name) {
    errors.push({ path: 'name', message: t('common.validator.empty.issueCard.name') })
  }
  if (!form.email) {
    errors.push({ path: 'email', message: t('common.validator.empty.issueCard.email') })
  }
  if (!validator.isEmail(form.email)) {
    errors.push({
      path: 'email',
      message: t('common.validator.invalid.issueCard.email'),
    })
  }
  if (!form.phone_number) {
    errors.push({ path: 'phoneNumber', message: t('common.validator.empty.issueCard.phoneNumber') })
  }
  if (!form.category) {
    errors.push({ path: 'category', message: t('common.validator.empty.issueCard.category') })
  }
  if (form.spend_limit === 0) {
    errors.push({ path: 'startingBalance', message: t('common.validator.invalid.issueCard.startingBalance') })
  }
  return errors
}

const formattedBalance = computed({
  get: () => form.spend_limit.toLocaleString(),
  set: value => {
    // Remove commas and parse to integer
    form.spend_limit = Number(value.replace(/,/g, '')) || 0
  },
})

const formatPhoneNumber = (target: HTMLInputElement) => {
  const rawValue = Number(target.value)
  if (Number.isNaN(Number(rawValue))) {
    target.value = ''
    return
  }
}

const handleInputPhoneNumber = async (event: InputEvent) => {
  const target = event.target as HTMLInputElement
  try {
    formatPhoneNumber(target)
  } catch (error) {
    console.log(error)
  }
}

const formatBalance = (target: HTMLInputElement) => {
  const rawValue = Number(target.value.split(',').join(''))
  if (Number.isNaN(Number(rawValue))) {
    target.value = formattedBalance.value
    return
  }
  if (+rawValue === +formattedBalance.value) {
    target.value = formattedBalance.value
    return
  }
  if (+rawValue >= 1000000) {
    form.spend_limit = 1000000
    target.value = formattedBalance.value
  }
  target.value = target.value.trim()
  originalNumericValue.value = rawValue
}

// Handle manual input updates
const handleInputBalance = async (event: InputEvent) => {
  const target = event.target as HTMLInputElement
  let caretPosition = target.selectionStart || 0
  const originalPositionRight = target.value.length - caretPosition
  try {
    formatBalance(target)
    setTimeout(() => {
      caretPosition = target.value.length === 1 ? 1 : target.value.length - originalPositionRight
      target.setSelectionRange(caretPosition, caretPosition)
    }, 0)
  } catch (error) {
    console.log(error)
  }
}

const presetAmounts = computed(() => {
  const balance = form.spend_limit
  if (!balance || balance == 0) {
    return [500, 1000, 2000, 5000]
  }
  if (+balance >= 100000) {
    return [Math.round(balance / 1000), Math.round(balance / 100), Math.round(balance / 10), balance]
  }
  if (+balance >= 10000) {
    return [Math.round(balance / 100), Math.round(balance / 10), balance, balance * 10]
  }
  if (+balance >= 1000) {
    return [Math.round(balance / 10), balance, balance * 10, balance * 100]
  }
  if (+balance < 1000) {
    return [balance, balance * 10, balance * 100, balance * 1000]
  }
})

const setAmount = amount => {
  formattedBalance.value = formatMoneyWithoutDecimals(amount)
}

async function handleIssue() {
  const payload = { ...form }
  await cardStore.issueCard(payload)
}
</script>

<template>
  <div class="pl-10 pr-[60px] pt-3 pb-8 overflow-y-auto">
    <UForm
      class="flex flex-row gap-20 justify-between"
      validate-on="submit"
      :validate="validate"
      :state="form"
      @submit="handleIssue"
    >
      <div class="flex flex-col flex-1 max-w-[720px]">
        <!-- Card information -->
        <div class="text-18-600-28 text-[#1C1D23]">
          {{ t('cards.issue.info.title') }}
        </div>
        <div class="flex flex-row gap-3 text-14-600-20 mt-5 items-center">
          <div
            @click="form.card_type = CardType.VIRTUAL"
            class="px-5 py-4 bg-[#F0F2F5] hover:bg-[#F2F4F7] rounded-[16px] flex flex-row gap-3 items-center w-[250px] cursor-pointer"
            :class="
              form.card_type === CardType.VIRTUAL
                ? 'text-[#1C1D23] border border-[#FF5524]'
                : 'text-[#7A7D89] border border-[#F0F2F5]'
            "
          >
            <img class="p-[10px] bg-[#FFF] rounded-full" :src="`/icons/cards/${CardType.VIRTUAL}.svg`" alt="" />
            <div>{{ t(`cards.list.type.${CardType.VIRTUAL}`) }}</div>
          </div>
          <div
            class="px-5 py-4 bg-[#F0F2F5] hover:bg-[#F2F4F7] rounded-[16px] flex flex-row gap-3 items-center w-[250px] cursor-not-allowed relative"
            :class="
              form.card_type === CardType.PHYSICAL
                ? 'text-[#1C1D23] border border-[#FF5524]'
                : 'text-[#7A7D89] border border-[#F0F2F5]'
            "
          >
            <div
              class="absolute right-5 -top-[10px] px-[6px] py-[2px] rounded-[10px] bg-[#5268E1] text-10-500-14 text-white"
            >
              Coming soon
            </div>
            <img class="p-[10px] bg-[#FFF] rounded-full" :src="`/icons/cards/${CardType.PHYSICAL}.svg`" alt="" />
            <div>{{ t(`cards.list.type.${CardType.PHYSICAL}`) }}</div>
          </div>
        </div>
        <UFormGroup
          name="name"
          class="mt-5"
          :ui="{
            error: 'ml-[128px] mt-2 text-red-500 dark:text-red-400',
          }"
        >
          <div class="flex flex-row items-center">
            <div class="text-14-500-20 w-[128px]" style="flex: 0 0 128px">
              <span>{{ t('cards.issue.info.form.label.name') }}</span>
              <span class="pl-1 text-[#ED2C38]">*</span>
            </div>
            <BaseInput
              input-class="input-field rounded-49"
              v-model="form.card_name"
              :clearable="!!form.card_name"
              :limit="50"
              leading
              :leading-img="'/icons/cards/issue-card/name.svg'"
              :placeholder="$t('cards.issue.info.form.placeholder.name')"
              autocomplete="off"
              @clear="form.card_name = ''"
            />
          </div>
        </UFormGroup>
        <UFormGroup
          name="email"
          class="mt-5"
          :ui="{
            error: 'ml-[128px] mt-2 text-red-500 dark:text-red-400',
          }"
        >
          <div class="flex flex-row items-center">
            <div class="text-14-500-20 w-[128px]" style="flex: 0 0 128px">
              <span>{{ t('cards.issue.info.form.label.email') }}</span>
              <span class="pl-1 text-[#ED2C38]">*</span>
            </div>
            <BaseInput
              input-class="input-field rounded-49"
              v-model="form.email"
              :clearable="!!form.email"
              :limit="128"
              leading
              :leading-img="'/icons/cards/issue-card/email.svg'"
              :placeholder="$t('cards.issue.info.form.placeholder.email')"
              autocomplete="off"
              @clear="form.email = ''"
            />
          </div>
        </UFormGroup>
        <!-- Phone number -->
        <UFormGroup
          name="phoneNumber"
          class="mt-5"
          :ui="{
            error: 'ml-[128px] mt-2 text-red-500 dark:text-red-400',
          }"
        >
          <div class="flex flex-row items-center">
            <div class="text-14-500-20 w-[128px]" style="flex: 0 0 128px">
              <span>{{ t('cards.issue.info.form.label.phoneNumber') }}</span>
              <span class="pl-1 text-[#ED2C38]">*</span>
            </div>
            <div class="flex flex-row items-center w-full">
              <!-- Country code -->
              <USelectMenu
                v-model="countryCode"
                :options="countryCodeOptions"
                class=""
                :ui-menu="{
                  select: 'cursor-pointer',
                  background: 'bg-white',
                  base: 'relative focus:outline-none overflow-y-auto scroll-py-1',
                  padding: 'p-0',
                  option: {
                    base: 'cursor-pointer text-14-500-20 bg-[#F0F2F5]',
                    inactive: 'bg-white hover:bg-[#F0F2F5] cursor-pointer',
                    padding: 'px-3 py-2',
                    rounded: 'rounded-none',
                    selectedIcon: {
                      base: 'h-[18px] w-[18px]',
                    },
                    empty: 'text-sm',
                  },
                  empty: 'text-sm',
                }"
              >
                <template #option="{ option }">
                  <div class="flex flex-row gap-[10px]">
                    <img :src="option.flag" alt="" />
                    <div class="text-12-500-20">{{ getCountryCode(option.country) }}</div>
                  </div>
                </template>
                <div
                  class="border border-[#D7D9E5] border-r-0 py-[11px] rounded-l-[49px] pl-4 pr-3 flex flex-row gap-[10px] w-[120px]"
                >
                  <img width="20" :src="countryCode.flag" alt="" />
                  <div class="text-14-500-20 text-[#1C1D23] grow">
                    {{ getCountryCode(countryCode.country) }}
                  </div>
                  <img class="justify-self-end" src="assets/img/icons/dropdown.svg" alt="" />
                </div>
              </USelectMenu>
              <!-- Phone  -->
              <UInput
                :ui="{
                  rounded: 'rounded-r-[49px] rounded-l-none',
                  icon: {
                    trailing: { pointer: '' },
                  },
                }"
                class="w-full"
                input-class="input-field"
                variant="none"
                v-model="form.phone_number"
                :clearable="!!form.phone_number"
                :maxlength="15"
                @input="handleInputPhoneNumber"
                :placeholder="$t('cards.issue.info.form.placeholder.phoneNumber')"
                autocomplete="off"
              >
                <template #trailing>
                  <UButton
                    v-if="form.phone_number"
                    color="gray"
                    variant="link"
                    icon="i-heroicons-x-mark-20-solid"
                    :padded="false"
                    @click="form.phone_number = ''"
                    alt=""
                  />
                  <div v-else></div>
                </template>
              </UInput>
            </div>
          </div>
        </UFormGroup>
        <!-- Category -->
        <UFormGroup
          name="category"
          class="mt-5"
          :ui="{
            error: 'ml-[128px] mt-2 text-red-500 dark:text-red-400',
          }"
        >
          <div class="flex flex-row items-center">
            <div class="text-14-500-20 w-[128px]" style="flex: 0 0 128px">
              <span>{{ t('cards.issue.info.form.label.category') }}</span>
              <span class="pl-1 text-[#ED2C38]">*</span>
            </div>
            <BaseSingleSelect
              v-model="form.category"
              :options="cardCategoryOptions"
              class="w-[50%] min-w-[360px]"
              :selected-icon="'i-selected'"
            >
              <template #default="{ open: open }">
                <div
                  class="border border-[#D7D9E5] rounded-[90px] py-[10px] pl-4 pr-3 flex flex-row w-full gap-[10px] justify-between"
                >
                  <div class="flex gap-[10px]">
                    <img src="/icons/cards/issue-card/category.svg" alt="" />
                    <div class="text-14-500-20 text-[#1C1D23] grow">
                      {{
                        form.category
                          ? t(`cards.list.category.${form.category}`)
                          : t('cards.issue.info.form.placeholder.category')
                      }}
                    </div>
                  </div>
                  <img
                    src="/assets/img/icons/dropdown.svg"
                    class="transition-transform"
                    :class="[open && 'transform rotate-180']"
                  />
                </div>
              </template>
              <template #option="{ option }">
                <div class="flex flex-row gap-[10px]">
                  <div class="text-12-500-20">{{ t(`cards.list.category.${option}`) }}</div>
                </div>
              </template>
            </BaseSingleSelect>
          </div>
        </UFormGroup>
        <UFormGroup name="purpose" class="mt-5">
          <div class="flex flex-row items-center">
            <div class="text-14-500-20 w-[128px]" style="flex: 0 0 128px">
              <span>{{ t('cards.issue.info.form.label.purpose') }}</span>
            </div>
            <BaseInput
              input-class="input-field rounded-49"
              v-model="form.card_purpose"
              :limit="128"
              :clearable="!!form.card_purpose"
              leading
              :leading-img="'/icons/cards/issue-card/purpose.svg'"
              :placeholder="$t('cards.issue.info.form.placeholder.purpose')"
              autocomplete="off"
              @clear="form.card_purpose = ''"
            />
          </div>
        </UFormGroup>
        <!-- Separator -->
        <div class="w-full bg-[#FFFFFF] border-b border-[#D7D9E5] h-11"></div>

        <!-- Card balance -->
        <div class="text-18-600-28 text-[#1C1D23] mt-5">
          {{ t('cards.issue.balance.title') }}
        </div>
        <UFormGroup
          name="startingBalance"
          v-slot="{ error }"
          :ui="{
            error: 'mt-2 text-red-500 dark:text-red-400',
          }"
        >
          <div
            class="px-6 py-[22px] border rounded-[16px] flex flex-col mt-5"
            :class="error ? 'border-[#ED2C38]' : 'border-[#5268E1]'"
          >
            <div class="flex flex-row justify-between">
              <div class="text-[#1C1D23] text-14-500-20">
                {{ t('cards.issue.balance.form.starting') }}
              </div>
              <div class="text-12-500-20 text-[#7A7D89]">
                {{ t('cards.issue.balance.form.available', { amount: currentBalance }) }}
              </div>
            </div>

            <div class="flex flex-row justify-between mt-4">
              <UInput
                class="w-full text-20-700-32 items-center flex"
                autocomplete="off"
                variant="none"
                v-model="formattedBalance"
                @input="handleInputBalance"
                :ui="{
                  padding: {
                    sm: 'p-0 text-[20px]',
                  },
                }"
              >
              </UInput>
              <div class="flex flex-row gap-[6px] py-1 pr-3 pl-[6px] bg-[#F0F2F5] rounded-[44px]">
                <img src="~/assets/img/flags/us.svg" alt="" />
                <div class="text-[#1C1D23] text-12-500-20">USD</div>
              </div>
            </div>
            <div class="flex flex-row gap-[5px] mt-[14px] justify-start">
              <UButton
                v-for="amount in presetAmounts"
                :key="amount"
                @click="setAmount(amount)"
                class="flex items-center py-[4px] px-3 bg-[#EDEFFF] hover:bg-[#DCDEEE] rounded-[44px] mx-auto w-[min-content] m-0"
              >
                <div class="text-[#1C1D23] text-12-500-20">{{ formatMoneyWithoutDecimals(amount) }}</div>
              </UButton>
            </div>
          </div>
        </UFormGroup>
        <UCheckbox
          class="mt-5"
          v-model="isSubmitEnabled"
          name="policy"
          :ui="{
            base: 'cursor-pointer',
            label: 'cursor-pointer',
          }"
        >
          <template #label>
            <span class="text-[#1C1D23] text-14-500-20">{{ t('cards.issue.policy') }}</span>
          </template>
        </UCheckbox>
      </div>
      <div class="flex flex-col">
        <div class="text-18-600-28 text-[#1C1D23]">
          {{ t('cards.issue.preview.title') }}
        </div>
        <div class="mt-5">
          <div
            class="w-[399px] h-[219px] rounded-[21px] flex flex-col items-start overflow-hidden bg-[url(~/assets/img/cards/card-bg.svg)] bg-left pt-5 pb-6 pl-4 pr-6"
          >
            <img src="~/assets/img/cards/card-logo.svg" alt="" />
            <div class="text-20-500-32 text-[#FFFFFF] mt-5 w-[270px]" :class="{ uppercase: form.name }">
              {{ form.card_name ? form.card_name : t('cards.issue.preview.namePlaceholder') }}
            </div>
            <img class="mt-auto" src="~/assets/img/cards/card-number.svg" alt="" />
          </div>
        </div>
        <div class="mt-8 px-5 py-4 bg-[#F0F2F5] rounded-[18px] flex flex-col">
          <div class="flex flex-row justify-between">
            <div class="text-[#7A7D89] text-12-500-20">
              {{ t('cards.issue.preview.starting') }}
            </div>
            <div class="text-14-600-20 text-[#1C1D23]">
              {{ form.spend_limit ? formatMoneyWithoutDecimals(form.spend_limit, CommonCurrency.USD) : '-' }}
            </div>
          </div>
          <div class="flex flex-row justify-between mt-6">
            <div class="text-[#7A7D89] text-12-500-20">
              {{ t('cards.issue.preview.fee') }}
            </div>
            <div class="text-14-600-20 text-[#1C1D23]">
              {{ formatMoneyWithoutDecimals(issueCardFee, CommonCurrency.USD) || '0 USD' }}
            </div>
          </div>
          <img src="~/assets/img/cards/line.svg" class="mt-4" alt="" />
          <div class="flex flex-row justify-between mt-4">
            <div class="text-[#7A7D89] text-12-500-20">
              {{ t('cards.issue.preview.total_top_up') }}
            </div>
            <div class="text-16-600-25 text-[#FF5524]">
              {{ formatMoneyWithoutDecimals(form.spend_limit || 0 + issueCardFee, CommonCurrency.USD) }}
            </div>
          </div>
        </div>
        {{ loading.issueCard }}
        <BaseSubmitButton
          :loading="loading.issueCard"
          :is-submit-enabled="isSubmitEnabled"
          :title="t('cards.button.issue')"
        />
      </div>
    </UForm>
  </div>
</template>
