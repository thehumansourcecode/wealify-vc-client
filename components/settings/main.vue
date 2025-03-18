<script setup lang="ts">
const { groupTabs, selectedOptions, selectedTab, selectedTabIndex, selectTab } = useTabs()
</script>
<template>
  <div class="flex flex-row justify-between w-full relative overflow-hidden min-h-screen pl-10 pr-10 pt-3 gap-4">
    <div class="w-4/12 relative rounded-lg overflow-hidden flex flex-col gap-4">
      <div
        v-for="group in groupTabs"
        class="pt-4 pb-0.5 relative bg-[#f0f2f5] overflow-hidden rounded-[18px] inline-flex flex-col justify-start items-start"
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
      class="w-8/12 relative rounded-lg overflow-hidden flex flex-col gap-4"
    >
      <div className="justify-center text-[#1b1c23] text-xl font-semibold font-['Manrope'] leading-loose">
        {{ selectedTab.title }}
      </div>
      <SettingsOptionButton v-for="option in selectedOptions" :title="option.title" :status="option.status" />
    </div>
  </div>
</template>
