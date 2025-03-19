<template>
  <div
    class="w-[516px] pl-8 pr-7 py-7 bg-white rounded-[30px] inline-flex flex-col justify-start items-end gap-7 overflow-hidden"
  >
    <div class="self-stretch flex flex-col justify-start items-start gap-[18px]">
      <div class="self-stretch inline-flex justify-between items-center">
        <div class="flex-1 justify-center text-[#1b1c23] text-2xl font-semibold leading-9">OTP</div>
        <div
          class="p-1.5 bg-white rounded-[50px] outline outline-[0.70px] outline-offset-[-0.70px] outline-[#d6d8e5] flex justify-start items-start gap-2.5"
        >
          <div class="w-5 h-5 relative">
            <div
              class="w-[12.49px] h-[12.49px] left-[3.76px] top-[3.76px] absolute outline outline-[1.20px] outline-offset-[-0.60px] outline-[#1b1c23]"
            />
            <div
              class="w-[12.49px] h-[12.49px] left-[3.76px] top-[3.76px] absolute outline outline-[1.20px] outline-offset-[-0.60px] outline-[#1b1c23]"
            />
          </div>
        </div>
      </div>
      <div class="self-stretch justify-start text-[#7a7c89] text-sm font-medium leading-tight">
        You have reached the maximum fail attempts. Please try again after 30 minutes
      </div>
    </div>
    <div class="w-[180px] px-4 py-3 bg-[#a4a8b8] rounded-[49px] inline-flex justify-center items-center gap-2">
      <div class="justify-center text-[#f0f2f5] text-base font-semibold leading-normal">29m59s</div>
    </div>
  </div>
</template>
