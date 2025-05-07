<script setup lang="ts">
const { groupTabs, selectedOptions, selectedTab, selectedTabIndex, selectTab } = useTabs()
</script>
<template>
  <div class="flex flex-row justify-between w-full relative overflow-x-hidden min-h-screen px-4 md:px-10 pt-3 gap-4 md:gap-10">
    <div class="w-5/12 md:w-4/12 relative rounded-lg overflow-y-auto flex flex-col gap-4">
      <div
        v-for="group in groupTabs"
        class="pt-4 pb-0.5 relative bg-[#f0f2f5] overflow-hidden rounded-[18px] inline-flex flex-col justify-start items-start w-full"
      >
        <div class="text-[#7a7c89] text-xs font-medium font-['Manrope'] leading-tight p-4">
          {{ group.name }}
        </div>
        <SettingsTabButton
          v-for="tab in group.tabs"
          :key="tab.index"
          :icon="tab.icon"
          :title="tab.title"
          :index="tab.index"
          :selected="selectedTabIndex == tab.index"
          :on-select="selectTab"
        />
      </div>
    </div>
    <div
      v-if="selectedTab"
      class="w-7/12 md:w-8/12 relative rounded-lg overflow-y-auto flex flex-col gap-4"
    >
      <div className="justify-center text-[#1b1c23] text-lg md:text-xl font-semibold font-['Manrope'] leading-loose sticky top-0 bg-white z-10 py-2">
        {{ selectedTab.title }}
      </div>
      <div class="flex flex-col gap-4 pb-8">
        <SettingsOptionButton v-for="option in selectedOptions" :title="option.title" :status="option.status" />
      </div>
    </div>
  </div>
</template>
