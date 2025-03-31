import { TransactionService } from '~/services/transactions.service'
import { HTTP_STATUS_CODE } from '~/types/common'
import {
  type ITransactionData,
  type IGetTransactionListParams,
  TransactionVCType,
  TransactionDetailType,
} from '~/types/transactions'

export const useTransactionStore = defineStore('transaction', () => {
  const transactionCount = ref(0)

  const isLoading = ref({
    transactionTable: false,
  })

  const payload = ref<IGetTransactionListParams>({
    page: 1,
    limit: 10,
    keyword: undefined,
    transaction_type: undefined,
    transaction_status: undefined,
    start_date: undefined,
    end_date: undefined,
    dataSort: undefined,
  })

  function setPayload(_payload: IGetTransactionListParams) {
    payload.value = { ..._payload }
  }

  function setPayloadPage(page: number) {
    payload.value.page = page
  }

  const selectedTransactionDetail = ref<ITransactionData>()

  function setSelectedTransactionDetail(transaction: ITransactionData) {
    const isCardTransaction = !!transaction.virtual_card
    const type = transaction.transaction_vc_type
    let detailType
    console.log(transaction)
    if (isCardTransaction && type === TransactionVCType.TOP_UP) {
      detailType = TransactionDetailType.CARD_TOP_UP
    }
    if (isCardTransaction && type === TransactionVCType.WITHDRAWAL) {
      detailType = TransactionDetailType.CARD_WITHDRAW
    }
    if (isCardTransaction && type === TransactionVCType.PAYMENT) {
      detailType = TransactionDetailType.CARD_PAYMENT
    }
    if (!isCardTransaction && type === TransactionVCType.TOP_UP) {
      detailType = TransactionDetailType.WALLET_TOP_UP
    }
    if (!isCardTransaction && type === TransactionVCType.WITHDRAWAL) {
      detailType = TransactionDetailType.WALLET_WITHDRAW
    }
    selectedTransactionDetail.value = { ...transaction, detailType: detailType }
  }

  const isOpenTransactionDetailSlideover = ref(false)

  function toggleTransactionDetailSlideover(state: boolean) {
    isOpenTransactionDetailSlideover.value = state
  }

  const transactionList = ref<ITransactionData[]>([])

  async function getTransactionList(payload: IGetTransactionListParams) {
    isLoading.value.transactionTable = true
    try {
      const response = await TransactionService.instance.getTransactionList(payload)
      if (response.code == HTTP_STATUS_CODE.OK) {
        transactionList.value = response.data.items
        transactionCount.value = response.data.total_items
      } else {
        throw new Error(response.message ?? 'Can not get transactions')
      }
      return response
    } catch (error) {
      transactionList.value = []
    } finally {
      isLoading.value.transactionTable = false
    }
  }

  return {
    payload,
    setPayload,
    setPayloadPage,
    transactionList,
    transactionCount,
    getTransactionList,
    isOpenTransactionDetailSlideover,
    toggleTransactionDetailSlideover,
    selectedTransactionDetail,
    setSelectedTransactionDetail,
    isLoading,
  }
})
