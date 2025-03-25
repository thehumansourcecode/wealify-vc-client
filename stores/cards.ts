import { normalize, showToast, ToastType } from '~/common/functions'
import { cardService } from '~/services/cards.service'
import { commonService } from '~/services/common.service'
import {
  CardCategory,
  CardStatus,
  type IIssueCardParams,
  type IGetCardListParams,
  type ICardDetail,
} from '~/types/cards'

export const useCardStore = defineStore('card', () => {
  const cardCount = ref(0)

  const isOpenCardTopupModal = ref(false)

  function toggleCardTopupModal(state: boolean) {
    isOpenCardTopupModal.value = state
  }

  const isLoading = ref({
    issueCard: false,
    cardTable: false,
  })

  const payload = ref<IGetCardListParams>({
    page: 1,
    limit: 10,
    keyword: undefined,
    card_type: undefined,
    card_status: [] as CardStatus[],
    category: [] as CardCategory[],
    start_date: undefined,
    end_date: undefined,
  })

  function setPayload(_payload: IGetCardListParams) {
    payload.value = { ..._payload }
  }

  function setPayloadPage(page: number) {
    payload.value.page = page
  }

  const selectedCardDetail = ref<ICardDetail>()

  function setSelectedCardDetail(card?: ICardDetail) {
    selectedCardDetail.value = card
  }

  const isOpenCardDetailSlideover = ref(false)

  function toggleCardDetailSlideover(state: boolean) {
    isOpenCardDetailSlideover.value = state
  }

  const cardList = ref<ICardDetail[]>([])

  const activeCardList = computed(() =>
    cardList.value.filter((card: ICardDetail) => card.card_status === CardStatus.ACTIVE),
  )

  async function getCardList(payload: IGetCardListParams) {
    isLoading.value.cardTable = true
    cardList.value = []
    const response = await cardService.getCardList(payload)
    if (response.success) {
      cardList.value = response.data.items
      cardCount.value = response.data.total_items
    }
    isLoading.value.cardTable = false
    return response
  }

  async function issueCard(params: IIssueCardParams) {
    isLoading.value.issueCard = true
    console.log(isLoading.value)
    console.log(isLoading.value.issueCard)
    const response = await cardService.issueCard(params)
    if (response.success) {
      navigateTo('/cards')
      payload.value = { ...payload.value, card_status: [CardStatus.ACTIVE] }
      await getCardList(payload.value)
    } else {
      showToast(ToastType.FAILED, response.message)
    }
    isLoading.value.issueCard = false
    return response
  }

  async function getCardDetailById(id: string) {
    const response = await cardService.getCardDetailById(id)
    if (response.success) {
      selectedCardDetail.value = response.data
    }
    return response
  }

  async function freezeCard(id: string) {
    const response = await cardService.freezeCard(id)
    if (!response.success) {
      return {
        success:false,
        message:response.message
      }
    }
     return {
      success:true
    }
  }

  async function cancelCard(id: string) {
    const response = await cardService.cancelCard(id)
    if (!response.success) {
      return {
        success:false,
        message:response.message
      }
    }
     return {
      success:true
    }
  }

  return {
    isLoading,
    payload,
    setPayload,
    setPayloadPage,
    cardList,
    cardCount,
    getCardList,
    activeCardList,
    issueCard,
    isOpenCardDetailSlideover,
    toggleCardDetailSlideover,
    selectedCardDetail,
    setSelectedCardDetail,
    getCardDetailById,
    isOpenCardTopupModal,
    toggleCardTopupModal,
    freezeCard,
    cancelCard,
  }
})
