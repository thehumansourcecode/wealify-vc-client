export default defineAppConfig({
  ui: {
    notifications: {
      wrapper: 'fixed flex flex-col justify-start z-[55]',
      position: 'bottom-0 end-0',
    },
    notification: {
      background: 'bg-[#3d2612]',
      title: 'clash-medium text-sm text-[#CDA981]',
      ring: '',
      progress: {
        base: 'absolute bottom-0 end-0 start-0',
        background: 'bg-[#CDA981]'
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
