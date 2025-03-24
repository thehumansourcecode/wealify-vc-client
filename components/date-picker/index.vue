<script setup lang="ts">
import dayjs from 'dayjs'
import { formatYYYYMMDD } from '~/common/functions'

const datepicker = ref<any>()
const { startPlaceholder, endPlaceholder } = defineProps<{
  startPlaceholder?: string
  endPlaceholder?: string
  selectionClass?: string | Array<string>
}>()

const model = defineModel<[Date | undefined, Date | undefined]>({
  default: [undefined, undefined],
})

const displayDateRange = computed<string>(() => {
  let text = ''
  text += model.value[0] ? formatYYYYMMDD(dayjs.utc(model.value[0]).local()) : (startPlaceholder ?? 'YYYY/MM/DD')
  text += ' - '
  text += model.value[1] ? formatYYYYMMDD(dayjs.utc(model.value[1]).local()) : (endPlaceholder ?? 'YYYY/MM/DD')
  return text
})

const reset = () => {
  model.value = [undefined, undefined]
}

const open = () => {
  datepicker.value?.handleOpen()
  styleHeaders()
}

const close = () => {
  datepicker.value?.handleClose()
}

const styleHeaders = () => {
  const headers = document.querySelectorAll('.el-date-range-picker__header > div')
  headers.forEach((header: any) => {
    const parts = header.textContent.split(' ').filter((item: any) => !!item)
    const yearIndex = !isNaN(parseInt(parts[0])) ? 0 : 1
    const monthIndex = yearIndex == 0 ? 1 : 0
    header.innerHTML = `<span class="text-[#ff5524]">${parts[monthIndex]}</span> ${parts[yearIndex]}`
  })
}

const onChangeMonthYear = () => {
  const timer = requestAnimationFrame(() => {
    styleHeaders()
    cancelAnimationFrame(timer)
  })
}
</script>
<template>
  <div class="overflow-hidden flex flex-row-reverse">
    <el-date-picker
      v-model="model"
      ref="datepicker"
      type="daterange"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
    >
      <template #prev-month>
        <img @click="onChangeMonthYear()" class="w-full h-full" src="/icons/common/datepicker-arrow-left.svg" />
      </template>
      <template #prev-year>
        <img @click="onChangeMonthYear()" class="w-full h-full" src="/icons/common/datepicker-double-arrow-left.svg" />
      </template>
      <template #range-separator> </template>
      <template #next-month>
        <img @click="onChangeMonthYear()" class="w-full h-full" src="/icons/common/datepicker-arrow-right.svg" />
      </template>
      <template #next-year>
        <img @click="onChangeMonthYear()" class="w-full h-full" src="/icons/common/datepicker-double-arrow-right.svg" />
      </template>
    </el-date-picker>
    <div
      class="min-w-12 inline-flex justify-start items-center gap-1.5 bg-[#F0F2F5] border border-[#D7D9E5] text-[#7A7D89] text-12-500-20 rounded-[36px] py-[7px] px-3"
      :class="selectionClass"
    >
      <div
        @click="open()"
        className="flex-1 justify-center text-[#7a7c89] text-xs font-medium font-['Manrope'] leading-tight cursor-pointer"
      >
        {{ displayDateRange }}
      </div>
      <img v-if="!model[0] && !model[1]" src="/icons/common/datepicker.svg" />
      <img @click="reset()" class="cursor-pointer" v-else src="/icons/common/datepicker-reset.svg" />
    </div>
  </div>
</template>

<style lang="scss">
.el-picker__popper,
.el-picker-panel {
  background: white;
  box-shadow: 0px 12px 16px rgba(0, 0, 0, 0.11);
  border-radius: 16px;
  outline: 1.5px #d7d9e5 solid;
  outline-offset: -1.5px;
  overflow: hidden;

  .el-date-table-cell__text {
    color: #1c1d23;
    &:hover {
      color: #ff5524;
    }
  }

  .el-date-table td.today .el-date-table-cell__text {
    background-color: #f0f2f5;
    color: #ff5524;
  }

  .el-date-table td.end-date .el-date-table-cell__text,
  .el-date-table td.start-date .el-date-table-cell__text {
    background-color: #ff5524;
    color: #fff;
  }

  .el-date-table td.in-range .el-date-table-cell {
    background-color: #f0f2f5;
  }
}

.el-date-range-picker__content.is-left {
  border-right: none !important;
}

.el-date-editor {
  width: 0px !important;
  overflow: hidden !important;
  visibility: hidden !important;
  padding: 0 !important;
}
</style>
