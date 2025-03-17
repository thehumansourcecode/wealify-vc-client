<script setup lang="ts">
definePageMeta({
  layout: 'home',
})
import { formatDDMMYYYY, formatMoney } from '~/common/functions'
import { CardCategory, CardStatus, CardType, type ICardData, type IFormCardIssue } from '~/types/cards'
import { PanelChildTab, PanelTab } from '~/types/common'
import type { FormError } from '#ui/types'

const { t } = useI18n()

const commonStore = useCommonStore()

onMounted(() => {
  commonStore.setHeaderBackLayout(true)
  commonStore.setActiveTab(PanelTab.CARD_LIST)
  commonStore.setActiveChildTab(PanelChildTab.CARD_ISSUE)
})

onUnmounted(() => {
  commonStore.setHeaderBackLayout(false)
  commonStore.setActiveChildTab(undefined)
})

const canSubmit = computed(() => form.name && form.email && form.phoneNumber && form.startingBalance)

const issueCardFee = computed(() => 0)

const form = reactive<IFormCardIssue>({
  type: CardType.VIRTUAL,
  name: '', //req, max 50 char, ko dấu
  email: '', //req, max 128, chữ số ký tự, auto trim, chặn
  phoneNumber: '', // req, nếu có thì = sđt user đã add, nếu ko thì rỗng. Max 15, trim, chặn
  category: CardCategory.TRAVEL, // req, default = Travel. Lấy từ API GET List Reporting fields
  purpose: '', // max = 128, chặn
  startingBalance: undefined, // nhập số nguyên dương. nếu = 0 hiển inline msg
})

const validate = (form: IFormCardIssue): FormError[] => {
  const errors = []
  if (!form.name) {
    errors.push({ path: 'name', message: t('common.validator.empty.issueCard.name') })
  }
  if (!form.email) {
    errors.push({ path: 'name', message: t('common.validator.empty.issueCard.name') })
  }
  if (!form.phoneNumber) {
    errors.push({ path: 'name', message: t('common.validator.empty.issueCard.phoneNumber') })
  }
  if (!form.category) {
    errors.push({ path: 'name', message: t('common.validator.empty.issueCard.category') })
  }
  return errors
}

async function handleIssue() {
  console.log(form)
}
</script>

<template>
  <div class="pl-10 pr-[60px] mt-[50px]">
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
        <UFormGroup name="name" class="mt-5">
          <div class="flex flex-row items-center">
            <div class="text-14-500-20 w-[128px]" style="flex: 0 0 128px">
              <span>{{ t('cards.issue.info.form.label.name') }}</span>
              <span class="pl-1 text-[#ED2C38]">*</span>
            </div>
            <BaseInput
              input-class="input-field"
              v-model="form.name"
              leading
              :leading-img="'/icons/cards/issue-card/name.svg'"
              :placeholder="$t('cards.issue.info.form.placeholder.name')"
              autocomplete="off"
            />
          </div>
        </UFormGroup>
        <UFormGroup name="email" class="mt-5">
          <div class="flex flex-row items-center">
            <div class="text-14-500-20 w-[128px]" style="flex: 0 0 128px">
              <span>{{ t('cards.issue.info.form.label.email') }}</span>
              <span class="pl-1 text-[#ED2C38]">*</span>
            </div>
            <BaseInput
              input-class="input-field"
              v-model="form.email"
              leading
              :leading-img="'/icons/cards/issue-card/email.svg'"
              :placeholder="$t('cards.issue.info.form.placeholder.email')"
              autocomplete="off"
            />
          </div>
        </UFormGroup>
        <UFormGroup name="category" class="mt-5">
          <div class="flex flex-row items-center">
            <div class="text-14-500-20 w-[128px]" style="flex: 0 0 128px">
              <span>{{ t('cards.issue.info.form.label.category') }}</span>
              <span class="pl-1 text-[#ED2C38]">*</span>
            </div>
            <USelectMenu v-model="form.category" :options="cardCategoryOptions" class="w-[50%] min-w-[360px]">
              <template #option="{ option }">
                <div class="flex flex-row gap-[10px]">
                  <div class="text-12-500-20">{{ t(`cards.issue.info.form.category.${option}`) }}</div>
                </div>
              </template>
              <div class="border border-[#D7D9E5] rounded-[90px] py-[10px] pl-4 pr-3 flex flex-row gap-[10px] w-full">
                <img src="/icons/cards/issue-card/category.svg" alt="" />
                <div class="text-14-500-20 text-[#1C1D23] grow">
                  {{ t(`cards.list.category.${form.category}`) }}
                </div>
                <img class="justify-self-end" src="assets/img/icons/dropdown.svg" alt="" />
              </div>
            </USelectMenu>
          </div>
        </UFormGroup>
        <UFormGroup name="purpose" class="mt-5">
          <div class="flex flex-row items-center">
            <div class="text-14-500-20 w-[128px]" style="flex: 0 0 128px">
              <span>{{ t('cards.issue.info.form.label.purpose') }}</span>
              <span class="pl-1 text-[#ED2C38]">*</span>
            </div>
            <BaseInput
              input-class="input-field"
              v-model="form.purpose"
              leading
              :leading-img="'/icons/cards/issue-card/purpose.svg'"
              :placeholder="$t('cards.issue.info.form.placeholder.purpose')"
              autocomplete="off"
            />
          </div>
        </UFormGroup>
        <!-- Separator -->
        <div class="w-full bg-[#FFFFFF] border-b border-[#D7D9E5] h-11"></div>

        <!-- Card balance -->
        <div class="text-18-600-28 text-[#1C1D23] mt-5">
          {{ t('cards.issue.balance.title') }}
        </div>
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
              {{ form.name ? form.name : t('cards.issue.preview.namePlaceholder') }}
            </div>
            <img class="mt-auto" src="~/assets/img/cards/card-number.svg" alt="" />
          </div>
        </div>
        <div class="mt-8 px-5 py-4 bg-[#F0F2F5] rounded-[18px] flex flex-col">
          <div class="flex flex-row justify-between">
            <div class="text-[#7A7D89] text-12-500-20">
              {{ t('cards.issue.preview.starting') }}
            </div>
            <div class="text-14-600-20 text-[#1C1D23]">{{ form.startingBalance ? form.startingBalance : '-' }}</div>
          </div>
          <div class="flex flex-row justify-between mt-6">
            <div class="text-[#7A7D89] text-12-500-20">
              {{ t('cards.issue.preview.fee') }}
            </div>
            <div class="text-14-600-20 text-[#1C1D23]">{{ issueCardFee }}</div>
          </div>
          <img src="~/assets/img/cards/line.svg" class="mt-4" alt="" />
          <div class="flex flex-row justify-between mt-4">
            <div class="text-[#7A7D89] text-12-500-20">
              {{ t('cards.issue.preview.totalTopup') }}
            </div>
            <div class="text-16-600-25 text-[#FF5524]">{{ form.startingBalance || 0 + issueCardFee }}</div>
          </div>
        </div>
        <UButton
          class="flex items-center justify-center rounded-[49px] bg-[#FF5524] py-3 w-full mt-6"
          :class="
            canSubmit
              ? 'bg-[#FF5524] text-[#FFFFFF] hover:bg-[#EE4413]'
              : 'bg-[#A5A8B8] text-[#D7D9E5] hover:bg-[#B6B9C9] cursor-not-allowed'
          "
          type="submit"
        >
          <div class="text-white text-16-600-24">
            {{ t('cards.button.issue') }}
          </div>
        </UButton>
      </div>
    </UForm>
  </div>
</template>
