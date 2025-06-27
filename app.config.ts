export default defineAppConfig({
  ui: {
    notifications: {
      wrapper: 'fixed flex flex-col justify-start z-[55] h-[max-content]',
      position: 'top-0 end-0',
    },
    notification: {
      wrapper: ' pointer-events-auto w-full',
      background: 'bg-[#1C1D23]',
      rounded: 'rounded-[10px]',
      container: 'relative overflow-hidden',
      title: 'text-[#FFFFFF] text-sm leading-5 font-medium manrope max-w-[330px]',
      inner: 'w-0 flex-0 self-center',
      padding: 'p-5',
      gap: 'gap-[18px]',
      ring: 'ring-0',
      progress: {
        base: 'absolute bottom-0 end-0 start-0',
        background: 'bg-[#F0F2F5]'
      },
      default: {
        
      },
      
    },
    theme: {
      extend: {
        colors: {
          customSilver: '#C0C0C0',
          customGold: '#FFD700',
          customMG: '#4C6B8A',
          customDMG: '#3D3D3D',
          customLE: '#27292B',
          customSMFC: '#000000'
        },
      },
    },
  },
})
