
import { paymentService } from '~/services/payment.service'

export const usePaymentStore = defineStore('payment', () => {
  const walletInfo = ref(undefined)
  const fetchWalletInfo = async()=>{
    let result = {
      success:true
    }
    const response = await paymentService.getWalletInfo()
    if (response.success) {
      walletInfo.value = response.data
      return result
    }
    return {
      success:false,
      message: response.message || ''
    }
  }

  return {
    walletInfo,
    fetchWalletInfo
  }
})
