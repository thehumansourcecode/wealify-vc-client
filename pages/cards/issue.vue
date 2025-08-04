<script setup lang="ts">
import { formatMoney, formatMoneyWithoutDecimals } from '~/common/functions'
import { getCountryCode, getCountryFlag } from '~/components/cards/functions'
import { CardCategory, CardType, type IIssueCardParams } from '~/types/cards'
import { CommonCountry, CommonCurrency, FeeAmountType, FeeType, PanelChildTab, PanelTab } from '~/types/common'
import {
  nonAccentedCharactersRegex,
  emailRegex,
  numberRegex,
  onlyEnglishCharacters,
  removedAccentMap,
} from '~/common/constants'
import { MAX_SPEND_LIMIT, countryCodeOptions } from '~/components/cards/constants'
import { number, object, string } from 'yup'

definePageMeta({
  layout: 'home',
})

const { t } = useI18n()

const commonStore = useCommonStore()
const cardStore = useCardStore()
const userStore = useUserStore()
const loading = computed(() => cardStore.isLoading)

const issueCardFees = computed(() => {
  if (!commonStore.feeList?.ISSUE_CARD) return 0
  const feeAmountType = commonStore.feeList.ISSUE_CARD.type
  const feeValue = commonStore.feeList.ISSUE_CARD.value
  if (feeAmountType === FeeAmountType.FIXED) {
    return feeValue || 0
  }
  if (feeAmountType === FeeAmountType.PERCENT) {
    return form.spend_limit * (feeValue || 0) || 0
  } else return 0
})

onMounted(async () => {
  commonStore.setHeaderBackLayout(true)
  commonStore.setActiveTab(PanelTab.CARD_LIST)
  commonStore.setActiveChildTab(PanelChildTab.CARD_ISSUE)
  await Promise.all([commonStore.getDropdownCategoryList(), commonStore.getFee(), userStore.getBalance()])
})

const currencyInputRef = ref()

const totalBalance = computed(() => userStore.userBalance?.wallet_balance?.balance)

onUnmounted(() => {
  commonStore.setHeaderBackLayout(false)
  commonStore.setActiveChildTab(undefined)
})

const isPolicyChecked = ref(true)
const cardCategoryOptions = computed(() => commonStore.categoryList)

const form = reactive<IIssueCardParams>({
  card_type: CardType.VIRTUAL,
  card_name: '', //req, max 50 char, ko dấu
  email: '', //req, max 128, chữ số ký tự, auto trim, chặn
  phone_number: '', // req, nếu có thì = sđt user đã add, nếu ko thì rỗng. Max 15, trim, chặn
  country_code: CommonCountry.VIETNAM,
  category: CardCategory.MARKETING, // req, default = Travel. Lấy từ API GET List Reporting fields,
  card_purpose: '', // max = 128, chặn
  spend_limit: 0, // nhập số nguyên dương. nếu = 0 hiển inline msg
  card_usage_type: '',
})

const threshold = computed(() => +(totalBalance.value || 0) - issueCardFees.value)

const issueCardSchema = object({
  card_name: string()
    .required(t('common.validator.empty.issueCard.name'))
    .matches(onlyEnglishCharacters, t('common.validator.invalid.issueCard.name')),
  email: string()
    .required(t('common.validator.empty.issueCard.email'))
    .matches(emailRegex, t('common.validator.invalid.issueCard.email')),
  country_code: string().required(),
  // phone_number: string().required(t('common.validator.empty.issueCard.phoneNumber')),
  category: string().required(t('common.validator.empty.issueCard.category')),
  spend_limit: number().test('max-threshold', t('common.validator.invalid.issueCard.insufficientBalance'), value => {
    return (value ?? 0) <= +threshold.value
  }),
})

const formatPhoneNumber = (target: HTMLInputElement) => {
  let rawValue = target.value.trim()

  const phoneRegex = /^\+?\d*$/

  if (!phoneRegex.test(rawValue)) {
    target.value = ''
    return
  }

  target.value = rawValue.replace(/[^\d+]/g, '')
}

const handleInputPhoneNumber = async (event: InputEvent) => {
  const target = event.target as HTMLInputElement
  try {
    formatPhoneNumber(target)
  } catch (error) {
    console.log(error)
  }
}

const formattedCardName = computed(() => {
  return form.card_name
    .split('')
    .map(char => removedAccentMap[char] || char)
    .join('')
    .toLocaleUpperCase()
    .trim()
})

const handlePasteName = event => {
  // const input = document.getElementById('name_input')
  event.preventDefault()
  let paste = (event.clipboardData || window.clipboardData).getData('text')
  let inputValue = paste.replace(nonAccentedCharactersRegex, '')
  // const remaining = 50 - event.target.value.length
  const start = event.target.selectionStart
  const end = event.target.selectionEnd
  const newValue = event.target.value.slice(0, start) + inputValue + event.target.value.slice(end)
  const newCursorPosition = Math.min(start + newValue.length, 50)
  // input?.focus();
  // input?.setSelectionRange(newCursorPosition, newCursorPosition)
  event.target.value = newValue
  form.card_name = event.target.value
}

const presetAmounts = computed(() => {
  const balance = form.spend_limit
  if (!balance || balance == 0) {
    return [500, 1000, 2000, 5000]
  }
  if (+balance >= 100000000) {
    return []
  }
  if (+balance >= 10000000) {
    return [balance, balance * 10]
  }
  if (+balance >= 1000000) {
    return [balance, balance * 10, balance * 100]
  } else {
    return [balance, balance * 10, balance * 100, balance * 1000]
  }
})

const setAmount = (amount: number) => {
  form.spend_limit = amount > MAX_SPEND_LIMIT ? MAX_SPEND_LIMIT : amount
  if (currencyInputRef?.value) {
    setTimeout(() => {
      currencyInputRef.value.focusInput()
      currencyInputRef.value.blurInput()
    })
  }
}

async function handleIssue() {
  const payload = { ...form, card_name: formattedCardName.value }
  await cardStore.issueCard(payload)
}

const isFormValid = ref(false)

watch(
  form,
  async () => {
    try {
      // Validate the entire form, don't stop at the first error
      await issueCardSchema.validate(form, { abortEarly: false })
      isFormValid.value = true // No errors, enable the button
    } catch (error) {
      isFormValid.value = false // Errors found, disable the button
    }
  },
  { deep: true }, // Watch nested object changes
)
</script>

<template>
  <div class="px-4 md:pl-10 md:pr-[60px] pt-3 pb-[60px] overflow-y-auto">
    <div class="flex flex-col lg:flex-row gap-8 lg:gap-20 justify-between">
      <div class="flex flex-col flex-1 max-w-[720px]">
        <!-- Card information -->
        <div class="text-18-600-28 text-[#1C1D23]">
          {{ t('cards.issue.info.title') }}
        </div>
        <UForm :schema="issueCardSchema" :state="form">
          <UTooltip
            class="ml-1"
            :text="`A card name helps identify your cards. The default name on the card is Kanoha Limited`"
            :popper="{ arrow: true, placement: 'top' }"
            :ui="{
              wrapper: 'w-full block',
              background: 'bg-[#1C1D23]',
              color: 'text-[#FFF]',
              base: 'px-3 py-2 h-[max-content]  text-xs font-medium text-clip text-center',
              ring: 'ring-0',
              arrow: { background: 'before:bg-[#1C1D23]' },
            }"
          >
            <UFormGroup
              name="card_name"
              class="mt-5"
              :ui="{
                error: 'ml-0 md:ml-[156px] mt-2 text-red-500 dark:text-red-400',
              }"
              v-slot="{ error }"
            >
              <div class="flex flex-row items-center">
                <div class="text-14-500-20 mb-2 sm:mb-0" style="flex: 0 0 156px">
                  <span>{{ t('cards.issue.info.form.label.name') }}</span>
                  <span class="pl-1 text-[#ED2C38]">*</span>
                </div>
                <BaseInput
                  id="name_input"
                  @paste="handlePasteName"
                  :error="error"
                  v-model="form.card_name"
                  :clearable="!!form.card_name"
                  :limit="50"
                  leading
                  :leading-img="'/icons/cards/issue-card/name.svg'"
                  :placeholder="$t('cards.issue.info.form.placeholder.name')"
                  @clear="form.card_name = ''"
                  class="w-full"
                />
              </div>
            </UFormGroup>
          </UTooltip>
          <UFormGroup
            name="email"
            class="mt-5"
            :ui="{
              error: 'ml-[156px] mt-2 text-red-500 dark:text-red-400',
            }"
            v-slot="{ error }"
          >
            <div class="flex flex-row items-center">
              <div class="text-14-500-20 flex flex-row items-center" style="flex: 0 0 156px">
                <span>{{ t('cards.issue.info.form.label.email') }}</span>
                <span class="pl-1 text-[#ED2C38]">*</span>
                <UTooltip
                  class="ml-1"
                  text="An OTP will be sent to you when making a payment"
                  :popper="{ arrow: true, placement: 'top' }"
                  :ui="{
                    background: 'bg-[#1C1D23]',
                    width: 'max-w-[252px]',
                    color: 'text-[#FFF]',
                    base: 'px-3 py-2 h-[max-content]  text-xs font-medium text-clip text-center',
                    ring: 'ring-0',
                    arrow: { background: 'before:bg-[#1C1D23]' },
                  }"
                >
                  <img src="~/assets/img/icons/tooltip.svg" alt="" />
                </UTooltip>
              </div>
              <BaseInput
                v-model.trim="form.email"
                :clearable="!!form.email"
                :error="error"
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

          <div class="flex flex-row items-start">
            <div class="text-14-500-20 mt-8" style="flex: 0 0 156px">
              <div class="flex flex-row items-center">
                <span>{{ t('cards.issue.info.form.label.phoneNumber') }}</span>
                <!--                <span class="pl-1 text-[#ED2C38]">*</span>-->
                <!--                <UTooltip-->
                <!--                  class="ml-1"-->
                <!--                  text="An OTP will be sent to you when making a payment"-->
                <!--                  :popper="{ arrow: true, placement: 'top' }"-->
                <!--                  :ui="{-->
                <!--                    width: 'max-w-[310px]',-->
                <!--                    background: 'bg-[#1C1D23]',-->
                <!--                    color: 'text-[#FFF]',-->
                <!--                    base: 'px-3 py-2 h-[max-content] text-xs font-medium text-clip text-center',-->
                <!--                    ring: 'ring-0',-->
                <!--                    arrow: { background: 'before:bg-[#1C1D23]' },-->
                <!--                  }"-->
                <!--                >-->
                <!--                  <img src="~/assets/img/icons/tooltip.svg" alt="" />-->
                <!--                </UTooltip>-->
              </div>
            </div>
            <div class="flex flex-row items-start w-full mt-5">
              <!-- Country code -->
              <UFormGroup
                name="country_code"
                :ui="{
                  error: 'mt-2 text-red-500 dark:text-red-400',
                }"
                v-slot="{ error }"
              >
                <USelectMenu
                  v-model="form.country_code"
                  :options="countryCodeOptions"
                  searchable
                  searchable-placeholder="Search country"
                  option-attribute="name"
                  value-attribute="code"
                  :ui-menu="{
                    select: 'cursor-pointer',
                    background: 'bg-white',
                    base: 'absolute md:min-w-[350px] max-md:min-w-[250px] overflow-x-hidden focus:outline-none overflow-y-auto scroll-py-1',
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
                    input: 'py-2.5 icon-search',
                  }"
                >
                  <template #option="{ option }">
                    <div class="flex flex-row gap-[10px]">
                      <img :src="option.image" alt="" class="w-[22px] h-[20px]" />
                      <div class="text-12-500-20">{{ option.name }}</div>
                    </div>
                  </template>
                  <div class="border border-r-0 py-[11px] rounded-l-[49px] pl-4 flex flex-row gap-[10px] w-[75px]">
                    <img class="w-[22px] h-[20px]" :src="getCountryFlag(form.country_code)" alt="" />
                    <img class="justify-self-end" src="assets/img/icons/dropdown.svg" alt="" />
                  </div>
                </USelectMenu>
              </UFormGroup>

              <!-- Phone  -->
              <UFormGroup
                class="w-full"
                name="phone_number"
                :ui="{
                  error: 'mt-2 text-red-500 dark:text-red-400',
                }"
                v-slot="{ error }"
              >
                <UInput
                  :ui="{
                    rounded: 'rounded-r-[49px] rounded-l-none',
                    icon: {
                      trailing: { pointer: '' },
                    },
                  }"
                  :error="error"
                  class="w-full"
                  :input-class="[`input-field`, `${error ? 'error' : ''}`].join(' ')"
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
              </UFormGroup>
            </div>
          </div>
          <!-- Category -->
          <UFormGroup
            name="category"
            class="mt-5"
            :ui="{
              error: 'ml-[156px] mt-2 text-red-500 dark:text-red-400',
            }"
            v-slot="{ error }"
          >
            <div class="flex flex-row items-center">
              <div class="text-14-500-20" style="flex: 0 0 156px">
                <span>{{ t('cards.issue.info.form.label.category') }}</span>
                <span class="pl-1 text-[#ED2C38]">*</span>
              </div>
              <BaseSingleSelect
                v-model="form.category"
                :options="cardCategoryOptions.filter(item => item == form.category)"
                class="w-full"
                :selected-icon="'i-selected'"
                :error="error"
              >
                <template #default="{ open: open }">
                  <div
                    class="border rounded-[90px] py-[10px] pl-4 pr-3 flex flex-row w-full gap-[10px] justify-between"
                    :class="error ? 'border-[#ec2c37]' : ' border-[#D7D9E5]'"
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
              <div class="text-14-500-20" style="flex: 0 0 156px">
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
            name="spend_limit"
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
                <div class="flex flex-row gap-1">
                  <div class="text-[#1C1D23] text-14-500-20">
                    {{ t('cards.issue.balance.form.starting') }}
                  </div>
                  <UTooltip
                    text="The maximum amount is 999,999,999"
                    :popper="{ arrow: true, placement: 'top' }"
                    :ui="{
                      background: 'bg-[#1C1D23]',
                      color: 'text-[#FFF]',
                      base: 'px-3 py-2 h-8 text-xs font-medium',
                      ring: 'ring-0',
                      arrow: { background: 'before:bg-[#1C1D23]' },
                    }"
                  >
                    <img src="~/assets/img/icons/tooltip.svg" alt="" />
                  </UTooltip>
                </div>
                <div class="text-12-500-20 text-[#7A7D89]">
                  {{ t('cards.issue.balance.form.availableWealify', { amount: formatMoney(totalBalance) }) }}
                </div>
              </div>
              <div class="flex flex-row justify-between mt-4">
                <BaseFormattedCurrencyInput v-model="form.spend_limit" ref="currencyInputRef" />
                <div class="flex flex-row gap-[6px] py-1 pr-3 pl-[6px] bg-[#F0F2F5] rounded-[44px]">
                  <img src="~/assets/img/flags/us.svg" alt="" />
                  <div class="text-[#1C1D23] text-12-500-20">USD</div>
                </div>
              </div>
              <div class="flex flex-row gap-[5px] mt-[14px] justify-start">
                <UButton
                  v-for="(amount, index) in presetAmounts"
                  :key="index"
                  @click="setAmount(amount)"
                  class="flex items-center py-[4px] px-3 bg-[#EDEFFF] hover:bg-[#DCDEEE] rounded-[44px] mx-auto w-[min-content] m-0"
                >
                  <div class="text-[#1C1D23] text-12-500-20">{{ formatMoneyWithoutDecimals(amount) }}</div>
                </UButton>
              </div>
            </div>
          </UFormGroup>
        </UForm>
        <UCheckbox
          class="mt-5"
          v-model="isPolicyChecked"
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
      <div class="flex flex-col mt-8 lg:mt-0">
        <div class="text-18-600-28 text-[#1C1D23]">
          {{ t('cards.issue.preview.title') }}
        </div>
        <div class="mt-5">
          <div
            class="w-full max-w-[399px] h-[219px] rounded-[21px] flex flex-col items-start overflow-hidden bg-[url(~/assets/img/cards/active-card.png)] bg-left pt-5 pb-6 pl-4 pr-6"
          >
            <img src="~/assets/img/cards/card-logo.svg" alt="" />
            <div class="text-20-500-32 text-[#FFFFFF] mt-5 w-full max-w-[360px]">Kanoha Limited</div>
            <img class="mt-auto" src="~/assets/img/cards/card-number.svg" alt="" />
          </div>
        </div>
        <div class="mt-8 px-5 py-4 bg-[#F0F2F5] rounded-[18px] flex flex-col w-full max-w-[399px]">
          <div class="flex flex-row justify-between">
            <div class="text-[#7A7D89] text-12-500-20">
              {{ t('cards.issue.preview.starting') }}
            </div>
            <div class="text-14-600-20 text-[#1C1D23]">
              {{ formatMoneyWithoutDecimals(form.spend_limit, CommonCurrency.USD) }}
            </div>
          </div>
          <div class="flex flex-row justify-between mt-6">
            <div class="text-[#7A7D89] text-12-500-20">
              {{ t('cards.issue.preview.fee') }}
            </div>
            <div class="text-14-600-20 text-[#1C1D23]">
              {{ formatMoneyWithoutDecimals(issueCardFees, CommonCurrency.USD) || '0 USD' }}
            </div>
          </div>
          <img src="~/assets/img/cards/line.svg" class="mt-4" alt="" />
          <div class="flex flex-row justify-between mt-4">
            <div class="text-[#7A7D89] text-12-500-20">
              {{ t('cards.issue.preview.total_top_up') }}
            </div>
            <div class="text-16-600-25 text-[#FF5524]">
              {{ formatMoneyWithoutDecimals((form.spend_limit || 0) + issueCardFees, CommonCurrency.USD) }}
            </div>
          </div>
        </div>
        <BaseSubmitButton
          @click="handleIssue"
          :loading="loading.issueCard"
          :is-submit-enabled="isPolicyChecked && isFormValid"
          :title="t('cards.button.issue')"
          class="mt-8"
        />
      </div>
    </div>
  </div>
</template>
