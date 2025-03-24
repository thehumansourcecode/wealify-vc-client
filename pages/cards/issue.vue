<script setup lang="ts">
import { formatMoneyWithoutDecimals } from '~/common/functions'
import { getCountryCode, getCountryFlag } from '~/components/cards/functions'
import { CardCategory, CardType, type IIssueCardParams } from '~/types/cards'
import { CommonCountry, CommonCurrency, PanelChildTab, PanelTab } from '~/types/common'
import { accentedCharactersRegex, emailRegex, removedAccentMap } from '~/common/constants'
import { MAX_SPEND_LIMIT, countryCodeOptions } from '~/components/cards/constants'
import { number, object, string } from 'yup'

definePageMeta({
  layout: 'home',
})

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

const isPolicyChecked = ref(true)
const cardCategoryOptions = computed(() => cardStore.categoryList)

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
  phone_number: '', // req, nếu có thì = sđt user đã add, nếu ko thì rỗng. Max 15, trim, chặn
  country_code: CommonCountry.VIETNAM,
  category: CardCategory.TRAVEL, // req, default = Travel. Lấy từ API GET List Reporting fields,
  card_purpose: '', // max = 128, chặn
  spend_limit: 0, // nhập số nguyên dương. nếu = 0 hiển inline msg
})

const issueCardSchema = object({
  card_name: string().required(t('common.validator.empty.issueCard.name')),
  email: string()
    .required(t('common.validator.empty.issueCard.email'))
    .matches(emailRegex, t('common.validator.invalid.issueCard.email')),
  country_code: string().required(),
  phone_number: string().required(t('common.validator.empty.issueCard.phoneNumber')),
  category: string().required(t('common.validator.empty.issueCard.category')),
  spend_limit: number()
    .min(1, t('common.validator.invalid.issueCard.zeroStartingBalance'))
    .max(MAX_SPEND_LIMIT, t('common.validator.invalid.issueCard.limitStartingBalance')),
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

const formattedCardName = computed(() => {
  return form.card_name
    .split('')
    .map(char => removedAccentMap[char] || char)
    .join('')
    .toLocaleUpperCase()
    .trim()
})

const handlePasteName = event => {
  event.preventDefault()
  let paste = (event.clipboardData || window.clipboardData).getData('text')
  let inputValue = paste.replace(accentedCharactersRegex, '')
  const remaining = 50 - event.target.value.length
  if (remaining > 0) {
    event.target.value += inputValue.slice(0, remaining)
    form.card_name = event.target.value
  }
}

const handleInputName = event => {
  // Remove all non-Viet/English characters
  let inputValue = event.target.value
  inputValue = inputValue.replace(accentedCharactersRegex, '')
  // Update the value
  event.target.value = inputValue
}

const originalNumericValue = ref<number>()

const formattedBalance = computed({
  get: () => {
    const formatted = new Intl.NumberFormat('en-US')
    return formatted.format(form.spend_limit)
  },
  set: value => {
    // Remove commas and parse to integer
    form.spend_limit = Number(value.replace(/,/g, '')) || 0
  },
})

const formatBalance = (target: HTMLInputElement) => {
  const rawValue = Number(target.value.split(',').join(''))

  if (Number.isNaN(Number(rawValue))) {
    target.value = formattedBalance.value
    return
  }
  if (+rawValue === +formattedBalance.value) {
    const formatted = new Intl.NumberFormat('en-US')
    target.value = formatted.format(+formattedBalance.value)
    return
  }
  if (+rawValue > MAX_SPEND_LIMIT) {
    const formatted = new Intl.NumberFormat('en-US')
    target.value = formatted.format(form.spend_limit)
    return
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
  if (+balance >= 100000000) {
    return []
  }
  if (+balance >= 10000000) {
    return [balance, balance * 10]
  }
  if (+balance > 1000000) {
    return [balance, balance * 10, balance * 100]
  } else {
    return [balance, balance * 10, balance * 100, balance * 1000]
  }
})

const setAmount = amount => {
  formattedBalance.value =
    amount > MAX_SPEND_LIMIT ? formatMoneyWithoutDecimals(MAX_SPEND_LIMIT) : formatMoneyWithoutDecimals(amount)
}

async function handleIssue() {
  const payload = { ...form, card_name: formattedCardName.value }
  await cardStore.issueCard(payload)
}

const isFormValid = ref(false)

watch(
  form,
  async () => {
    console.log(form)
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
  <div class="pl-10 pr-[60px] pt-3 pb-8 overflow-y-auto">
    <div class="flex flex-row gap-20 justify-between">
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
        <UForm :schema="issueCardSchema" :state="form">
          <UFormGroup
            name="card_name"
            class="mt-5"
            :ui="{
              error: 'ml-[156px] mt-2 text-red-500 dark:text-red-400',
            }"
            v-slot="{ error }"
          >
            <div class="flex flex-row items-center">
              <div class="text-14-500-20" style="flex: 0 0 156px">
                <span>{{ t('cards.issue.info.form.label.name') }}</span>
                <span class="pl-1 text-[#ED2C38]">*</span>
              </div>
              <BaseInput
                @input="handleInputName"
                @paste="handlePasteName"
                :error="error"
                v-model="form.card_name"
                :clearable="!!form.card_name"
                :limit="50"
                leading
                :leading-img="'/icons/cards/issue-card/name.svg'"
                :placeholder="$t('cards.issue.info.form.placeholder.name')"
                @clear="form.card_name = ''"
              />
            </div>
          </UFormGroup>
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
                  text="An OTP will be sent to you when making a payment if it cannot be sent via email"
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
                v-model="form.email"
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
                <span class="pl-1 text-[#ED2C38]">*</span>
                <UTooltip
                  class="ml-1"
                  text="An OTP will be sent to you when making a payment"
                  :popper="{ arrow: true, placement: 'top' }"
                  :ui="{
                    width: 'max-w-[310px]',
                    background: 'bg-[#1C1D23]',
                    color: 'text-[#FFF]',
                    base: 'px-3 py-2 h-[max-content] text-xs font-medium text-clip text-center',
                    ring: 'ring-0',
                    arrow: { background: 'before:bg-[#1C1D23]' },
                  }"
                >
                  <img src="~/assets/img/icons/tooltip.svg" alt="" />
                </UTooltip>
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
                  value-attribute="country"
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
                    class="border border-r-0 py-[11px] rounded-l-[49px] pl-4 pr-3 flex flex-row gap-[10px] w-[120px]"
                  >
                    <img width="20" :src="getCountryFlag(form.country_code)" alt="" />
                    <div class="text-14-500-20 text-[#1C1D23] grow">
                      {{ form.country_code ? getCountryCode(form.country_code) : '' }}
                    </div>
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
                :options="cardCategoryOptions"
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
      <div class="flex flex-col">
        <div class="text-18-600-28 text-[#1C1D23]">
          {{ t('cards.issue.preview.title') }}
        </div>
        <div class="mt-5">
          <div
            class="w-[399px] h-[219px] rounded-[21px] flex flex-col items-start overflow-hidden bg-[url(~/assets/img/cards/card-bg.svg)] bg-left pt-5 pb-6 pl-4 pr-6"
          >
            <img src="~/assets/img/cards/card-logo.svg" alt="" />
            <div class="text-20-500-32 text-[#FFFFFF] mt-5 w-[360px]" :class="{ uppercase: form.name }">
              {{ form.card_name ? formattedCardName : t('cards.issue.preview.namePlaceholder') }}
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
        <BaseSubmitButton
          @click="handleIssue"
          :loading="loading.issueCard"
          :is-submit-enabled="isPolicyChecked && isFormValid"
          :title="t('cards.button.issue')"
        />
      </div>
    </div>
  </div>
</template>
