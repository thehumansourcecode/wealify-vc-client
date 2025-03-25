<script setup lang="ts">
const {loading} = defineProps<{
  type: string,
  loading:Boolean,
}>()
const { t } = useI18n()
const emit = defineEmits(['click'])

const handleClick = () => {  
    if(loading){
        return
    }
    emit('click')
}
</script>
<template>
    <button @click="handleClick" class="flex flex-col gap-3 items-center cursor-pointer hover:opacity-90 bg-transparent border-none" :class="{'!cursor-not-allowed':loading}">
        <div class="flex items-center justify-center h-[40px] w-[40px]" v-if="loading">
            <div class="w-6 h-6 border-4 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        <img v-else class="w-10" :src="`_nuxt/assets/img/cards/${type}.svg`"/>
        <div>{{ t(`cards.slideovers.detail.button.${type}`) }}</div>
    </button>
    
</template>


