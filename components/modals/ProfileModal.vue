<script setup lang="ts">
import {object, string } from 'yup'
import { getCountryCode, getCountryFlag } from '~/components/cards/functions'
import { countryCodeOptions } from '~/components/cards/constants'
import { CommonCountry} from '~/types/common'
import {type ProfileData}  from '~/types/profile'
import {emailRegex} from '~/common/constants'
import { showToast, ToastType } from '~/common/functions'

const { t } = useI18n()
const profileStore = useProfileStore()
const {profile} = storeToRefs(useProfileStore())
const formRef = ref(null)

const form = ref({
  full_name: profile.value?.full_name,
  email: profile.value?.email,
  phone_number: profile.value?.phone_number,
  country_code:profile.value?.country_code ? profile.value?.country_code:  CommonCountry.VIETNAM,
})

const isSubmitting = ref(false)
const isDisableButton = ref(false)

const profileSchema = object({
  full_name: string()
      .required(t('common.validator.empty.profile.full_name')),
  email: string()
      .required(t('common.validator.empty.profile.email'))
      .matches(emailRegex, t('common.validator.invalid.profile.email')),
  country_code: string().required(),
})

const isOpen = defineModel()
const emit = defineEmits(['update:modelValue', 'confirm'])

const closeModal = () => {
  emit('update:modelValue', false)
}

const formatPhoneNumber = (target: HTMLInputElement) => {
  target.value = target.value.replace(/\s+/g, '')
  const rawValue = Number(target.value)
  if (Number.isNaN(Number(rawValue))) {
    target.value = target.value.replace(/\D/g, '')
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


const handleClickEdit = async() =>{
  if(isDisableButton.value){
    return
  }
  let valid = true
  try {
    await formRef.value.validate()
  }catch (e){
    valid = false
    console.log(e)
  }
  if (!valid){
    return
  }

  isSubmitting.value = true
  const result =  await profileStore.updateProfile(form.value)
  isSubmitting.value = false
  if (!result.success) {
    showToast(ToastType.FAILED,result.message)
    return
  }
  showToast(ToastType.SUCCESS, t('profile.message.edit.success'))
  closeModal()
  await profileStore.fetchProfile()
}

const showLastEdit = computed(()=> {
  const date = new Date(profile.value.updated_at)
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
 return formattedDate
})

watch(
  isOpen,
  (v) => {
      if (!v) return
      form.value = {
      full_name: profile.value?.full_name,
      email: profile.value?.email,
      phone_number: profile.value?.phone_number,
      country_code:profile.value?.country_code,
    }
  },
)

watch(
  form,
  (v) => {
    isDisableButton.value = form.value.full_name === ""
  },
  { deep: true },
)

</script>

<template>
  <UModal
      class="modal-xs"
      v-model="isOpen"
      :ui="{
      overlay: {
        background: 'bg-gray-200/20',
      },
      container: 'flex items-center justify-center sm:items-center lg:justify-center text-center',
      rounded: 'rounded-[30px]',
      background: '',
      width: 'w-[358px] lg:w-[516px]',
      margin: 'sm:my-0',
    }"
  >
    <div class="p-4 bg-white rounded-[30px] flex flex-col lg:p-7">
      <div class="w-full flex flex-row justify-between items-center mb-[14px]">
        <div class="manrope text-2xl font-semibold leading-9">{{t('profile.modal.title')}}</div>
        <img class="cursor-pointer hover:opacity-70" src="~/assets/img/common/close.svg" @click="closeModal()" />
      </div>
      <UForm :schema="profileSchema" ref="formRef" :state="form">
        <UFormGroup name="full_name" class="mt-5" :ui="{error: 'ml-[156px] mt-2 text-red-500 dark:text-red-400'}" v-slot="{ error }">
          <div class="flex flex-row items-center">
            <div class="text-14-500-20 flex flex-row items-center" style="flex: 0 0 156px">
              <span>{{ t('profile.form.label.full_name') }}</span>
              <span class="pl-1 text-[#ED2C38]">*</span>
            </div>
            <BaseInput
                v-model.trim="form.full_name"
                :error="error"
                :limit="128"
                leading
                :leading-img="'/icons/cards/issue-card/name.svg'"
                :placeholder="$t('profile.form.placeholder.full_name')"
                autocomplete="off"
                @clear="form.full_name = ''"
            />
          </div>
        </UFormGroup>
        <UFormGroup name="email" class="mt-5" :ui="{error: 'ml-[156px] mt-2 text-red-500 dark:text-red-400'}" v-slot="{ error }">
          <div class="flex flex-row items-center">
            <div class="text-14-500-20 flex flex-row items-center" style="flex: 0 0 156px">
              <span>{{ t('profile.form.label.email') }}</span>
              <span class="pl-1 text-[#ED2C38]">*</span>
            </div>
            <BaseInput
            :ui="{
                  padding: {
                    sm: 'pr-9 pl-1.5 py-1.5',
                  },
                  leading: {
                    padding: {
                      sm: 'ps-11 pe-11',
                    },
                  },
                  icon: {
                    leading: {
                      padding: {
                        sm: 'pl-4 pr-2.5',
                      },
                    },
                  },
                }"
                :class="`disabled-email`"
                v-model.trim="form.email"
                leading
                disabled
                :leading-img="'/icons/cards/issue-card/email.svg'"
                :placeholder="$t('profile.form.placeholder.email')"
            />
          </div>
        </UFormGroup>
        <!-- Phone number -->

        <div class="flex flex-row items-start">
          <div class="text-14-500-20 mt-8" style="flex: 0 0 156px">
            <div class="flex flex-row items-center">
              <span>{{t('profile.form.label.phone_number') }}</span>
            </div>
          </div>
          <div class="flex flex-row items-start w-full mt-5 relative">
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
                    <img :src="option.flag" />
                    <div class="text-12-500-20">{{ getCountryCode(option.country) }}</div>
                  </div>
                </template>
                <div class="border border-r-0 py-[11px] rounded-l-[49px] pl-4 pr-3 flex flex-row gap-[10px] w-[120px]">
                  <img width="20" :src="getCountryFlag(form.country_code)" />
                  <div class="text-14-500-20 text-[#1C1D23] grow">
                    {{ form.country_code ? getCountryCode(form.country_code) : '' }}
                  </div>
                  <img class="justify-self-end" src="assets/img/icons/dropdown.svg" />
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
                  :input-class="[`input-field phone_number`, `${error ? 'error' : ''}`].join(' ')"
                  variant="none"
                  v-model="form.phone_number"
                  :clearable="!!form.phone_number"
                  :maxlength="15"
                  @input="handleInputPhoneNumber"
                  :placeholder="$t('profile.form.placeholder.phone_number')"
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
      </UForm>

      <div class="flex justify-between mt-[28px]">
        <div class="text-[#7A7D89] text-[12px] manrope font-normal leading-[20px] flex items-center justify-center">Last edit: {{showLastEdit}}</div>
        <UButton
            :class="isDisableButton ? 'text-[#d6d8e5] !bg-[#a4a8b8] hover:bg-[#a4a8b8]' : 'text-white !bg-[#FF5524] hover:bg-[#FF5524]'"
            :disabled="isDisableButton"
            :loading="isSubmitting"
            :label="t('profile.button.ready.edit')"
            @click="handleClickEdit"
            class="manrope flex justify-center rounded-[49px] p-3 xl:min-w-[223px] font-semibold"
        ></UButton>
      </div>
    </div>
  </UModal>
</template>
<style lang="scss">
.phone_number.error{
  margin-bottom: 35px !important;
}

@media (max-width: 1023px) {
  [style*="flex: 0 0 156px"] {
    flex: 0 0 100px !important;
  }
}
</style>