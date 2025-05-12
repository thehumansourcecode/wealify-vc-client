<script setup lang="ts">
import { number, object, string } from 'yup'
import { nonAccentedCharactersRegex, emailRegex, removedAccentMap } from '~/common/constants'
import { CardType, CardCategory, type IEditCardParams } from '~/types/cards'
import { getCountryCode, getCountryFlag } from '~/components/cards/functions'
import { CommonCountry } from '~/types/common'
import { MAX_SPEND_LIMIT, countryCodeOptions } from '~/components/cards/constants'

const { t } = useI18n()
const cardStore = useCardStore()
const commonStore = useCommonStore()

onMounted(async () => {
  await Promise.all([commonStore.getDropdownCategoryList()])
})

const cardCategoryOptions = computed(() => commonStore.categoryList)
const selectedCardDetail = computed(() => cardStore.selectedCardDetail)
const loading = computed(() => cardStore.isLoading.editCard)

const editCardSchema = object({
  card_name: string().required(t('common.validator.empty.issueCard.name')),
  email: string()
    .required(t('common.validator.empty.issueCard.email'))
    .matches(emailRegex, t('common.validator.invalid.issueCard.email')),
  country_code: string().required(),
  phone_number: string().required(t('common.validator.empty.issueCard.phoneNumber')),
  category: string().required(t('common.validator.empty.issueCard.category')),
})

const form = reactive<IEditCardParams>({
  card_name: selectedCardDetail?.value?.card_name as string, //req, max 50 char, ko dấu
  email: selectedCardDetail?.value?.email as string, //req, max 128, chữ số ký tự, auto trim, chặn
  phone_number: selectedCardDetail.value?.phone_number as string, // req, nếu có thì = sđt user đã add, nếu ko thì rỗng. Max 15, trim, chặn
  country_code: selectedCardDetail?.value?.country_code || CommonCountry.VIETNAM,
  category: selectedCardDetail?.value?.category, // req, default = Travel. Lấy từ API GET List Reporting fields,
  card_purpose: selectedCardDetail?.value?.card_purpose, // max = 128, chặn
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
  let inputValue = paste.replace(nonAccentedCharactersRegex, '')
  const remaining = 50 - event.target.value.length
  if (remaining > 0) {
    event.target.value += inputValue.slice(0, remaining)
    form.card_name = event.target.value
  }
}

const handleInputName = event => {
  // Remove all non-Viet/English characters
  let inputValue = event.target.value
  inputValue = inputValue.replace(nonAccentedCharactersRegex, '')
  // Update the value
  event.target.value = inputValue
}

const isFormValid = ref(false)

watch(
  form,
  async () => {
    try {
      // Validate the entire form, don't stop at the first error
      await editCardSchema.validate(form, { abortEarly: false })
      isFormValid.value = true // No errors, enable the button
    } catch (error) {
      isFormValid.value = false // Errors found, disable the button
    }
  },
  { deep: true, immediate: true }, // Watch nested object changes
)

async function handleEdit() {
  const id = selectedCardDetail.value?.id
  if (id) {
    const payload = { ...form, card_name: formattedCardName.value }
    await cardStore.editCard(payload, id)
  }
}
</script>

<template>
  <BaseModal :label="t('cards.modals.edit.title')" @close-prevented="cardStore.toggleCardEditModal(false)">
    <div class="flex flex-col gap-4 sm:gap-7 w-full sm:w-[700px] px-4 sm:px-0">
      <UForm :schema="editCardSchema" :state="form">
        <UFormGroup
          name="card_name"
          :ui="{
            error: 'ml-0 sm:ml-[156px] mt-2 text-red-500 dark:text-red-400',
          }"
          v-slot="{ error }"
        >
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
            <div class="text-xs sm:text-14-500-20 w-full sm:w-auto sm:flex-none lg:flex-[0_0_156px]">
              <span>{{ t('cards.issue.info.form.label.name') }}</span>
              <span class="pl-1 text-[#ED2C38]">*</span>
            </div>
            <BaseInput
              @input="handleInputName"
              @paste="handlePasteName"
              disabled
              :error="error"
              v-model="form.card_name"
              :limit="50"
              leading
              :leading-img="'/icons/cards/issue-card/name.svg'"
              :placeholder="$t('cards.issue.info.form.placeholder.name')"
              @clear="form.card_name = ''"
              class="w-full"
            />
          </div>
        </UFormGroup>
        <UFormGroup
          name="email"
          class="mt-4 sm:mt-5"
          :ui="{
            error: 'ml-0 sm:ml-[156px] mt-2 text-red-500 dark:text-red-400',
          }"
          v-slot="{ error }"
        >
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
            <div class="text-xs sm:text-14-500-20 flex flex-row items-center w-full sm:w-auto sm:flex-none lg:flex-[0_0_156px]">
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
                  base: 'px-3 py-2 h-[max-content] text-clip text-center',
                  ring: 'ring-0',
                  arrow: { background: 'before:bg-[#1C1D23]' },
                }"
              >
                <img class="w-4 h-4 sm:w-auto sm:h-auto" src="~/assets/img/icons/tooltip.svg" alt="" />
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
              class="w-full"
            />
          </div>
        </UFormGroup>
        <!-- Phone number -->
        <div class="flex flex-col sm:flex-row items-start gap-2 sm:gap-0">
          <div class="text-xs sm:text-14-500-20 mt-4 sm:mt-8 w-full sm:w-auto sm:flex-none lg:flex-[0_0_156px]">
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
                <img class="w-4 h-4 sm:w-auto sm:h-auto" src="~/assets/img/icons/tooltip.svg" alt="" />
              </UTooltip>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row items-start w-full gap-2 sm:gap-0 mt-2 sm:mt-5">
            <div class="flex flex-row w-full gap-0">
              <!-- Country code -->
              <UFormGroup
                name="country_code"
                :ui="{
                  error: 'mt-2 text-red-500 dark:text-red-400',
                }"
                v-slot="{ error }"
                class="w-auto"
              >
                <USelectMenu
                  v-model="form.country_code"
                  value-attribute="country"
                  :options="countryCodeOptions"
                  class="w-[100px] sm:w-[120px]"
                  :ui-menu="{
                    select: 'cursor-pointer',
                    background: 'bg-white',
                    base: 'relative focus:outline-none overflow-y-auto scroll-py-1',
                    padding: 'p-0',
                    option: {
                      base: 'cursor-pointer text-xs sm:text-14-500-20 bg-[#F0F2F5]',
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
                      <div class="text-xs sm:text-12-500-20">{{ getCountryCode(option.country) }}</div>
                    </div>
                  </template>
                  <div class="border border-r-0 py-2 sm:py-[11px] rounded-l-[49px] pl-3 sm:pl-4 pr-2 sm:pr-3 flex flex-row gap-[10px] w-[100px] sm:w-[120px] h-[44px] items-center">
                    <img width="20" :src="getCountryFlag(form.country_code)" alt="" />
                    <div class="text-xs sm:text-14-500-20 text-[#1C1D23] grow">
                      {{ form.country_code ? getCountryCode(form.country_code) : '' }}
                    </div>
                    <img class="justify-self-end w-4 h-4 sm:w-auto sm:h-auto" src="assets/img/icons/dropdown.svg" alt="" />
                  </div>
                </USelectMenu>
              </UFormGroup>

              <!-- Phone  -->
              <UFormGroup
                class="flex-1"
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
            <div class="text-14-500-20 w-full sm:w-auto sm:flex-none lg:flex-[0_0_156px]">
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
            <div class="text-14-500-20 w-full sm:w-auto sm:flex-none lg:flex-[0_0_156px]">
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
      </UForm>
      <BaseSubmitButton
        class="ml-auto w-[180px]"
        @click="handleEdit"
        :loading="loading"
        :is-submit-enabled="isFormValid"
        :title="t('cards.button.editCard')"
      />
    </div>
  </BaseModal>
</template>

<style lang="scss" scoped></style>
