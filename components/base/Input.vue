<script setup lang="ts">
defineProps({
  leading: Boolean,
  leadingImg: String,
  clearable: Boolean,
  limit: Number,
  error: Boolean,
  ui:{
    type:Object,
    default: ()=>{
      return {
      base: 'disabled:cursor-not-allowed disabled:opacity-75 disabled:bg-[#c6c8d4] disabled:text-[#1C1D23]',
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
        trailing: { pointer: '' },
      },
    }
    }
  }
})

const emit = defineEmits(['clear'])

function clearInput() {
  emit('clear')
}
</script>

<template>
  <UInput
    class="w-full"
    autocomplete="off"
    variant="none"
    :maxlength="limit"
    :input-class="[`input-field rounded-49`, `${error ? 'error' : ''}`].join(' ')"
    :ui="ui"
  >
    <template #leading>
      <img v-if="leading" :src="leadingImg" alt="" />
    </template>
    <template #trailing>
      <UButton
        v-if="clearable"
        color="gray"
        variant="link"
        icon="i-heroicons-x-mark-20-solid"
        :padded="false"
        @click="clearInput"
        alt=""
      />
      <div v-else></div>
    </template>
  </UInput>
</template>

<style lang="scss">
.input-field {
  height: 44px;
  box-shadow: none;
  border: 1px solid #d7d9e5;
  background: white;
  color: #1c1d23;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  &:focus {
    border: 1px solid #c6c8d4 !important;
  }
  &:hover {
    border: 1px solid #c6c8d4 !important;
  }
  &::placeholder {
    color: #7a7d89;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
  }
  &.error {
    border: 1px solid #ec2c37 !important;
  }
}

.rounded-49 {
  border-radius: 49px;
}

.transparent {
  background: transparent;
  border: none !important;
  &:focus {
    border: none !important;
  }
  &:hover {
    border: none !important;
  }
}
</style>
