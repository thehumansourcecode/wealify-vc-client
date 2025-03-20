<script setup lang="ts">
import { passwordRequirements } from '~/utils/validator.util'

const { password } = defineProps<{
  password: string | undefined
}>()

const checkStrength = (str: string | undefined) => {
  if (str == undefined) return []
  return passwordRequirements.map(req => ({ met: req.regex.test(str), text: req.text }))
}

const strength = ref<Array<any>>(checkStrength(undefined))

watch(
  () => password,
  () => {
    if (typeof password != 'string') return
    strength.value = checkStrength(password)
  },
)
</script>
<template>
  <ul v-if="strength.length > 0" class="space-y-1">
    <li
      v-for="(req, index) in strength"
      :key="index"
      class="flex items-center gap-2"
      :class="req.met ? 'text-(--ui-success)' : 'text-(--ui-text-muted)'"
    >
      <img class="w-5 h-5 relative" :src="req.met ? '/images/auth/available.svg' : '/images/auth/unavailable.svg'" />

      <span class="justify-start text-[#7a7c89] text-base font-medium leading-normal">
        {{ req.text }}
        <span class="sr-only">
          {{ req.met ? ' - Requirement met' : ' - Requirement not met' }}
        </span>
      </span>
    </li>
  </ul>
</template>
