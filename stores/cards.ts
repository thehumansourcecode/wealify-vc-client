import { normalize, showToast, ToastType } from '~/common/functions'
import { cardsService } from '~/services/cards.service'
import { commonService } from '~/services/common.service'
import {
  CardCategory,
  CardStatus,
  CardType,
  type ICardData,
  type IIssueCardParams,
  type IGetCardListParams,
  type ICardDetail,
} from '~/types/cards'

export const useCardStore = defineStore('card', () => {
  const cardCount = ref(0)

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

  const cardList = ref<ICardData[]>([])

  const activeCardList = computed(() =>
    cardList.value.filter((card: ICardData) => card.card_status === CardStatus.ACTIVE),
  )

  async function getCardList(payload: IGetCardListParams) {
    isLoading.value.cardTable = true
    cardList.value = []
    const response = await cardsService.getCardList(payload)
    if (response.success) {
      cardList.value = response.data.items
      cardCount.value = response.data.total_items
    }
    isLoading.value.cardTable = false
    return response
  }

  const categoryList = ref<CardCategory[]>([])

  async function getDropdownCategoryList() {
    const response = await commonService.getDropdownCategoryList()
    if (response.success) {
      categoryList.value = response.data as CardCategory[]
    }
    return response
  }

  async function issueCard(params: IIssueCardParams) {
    isLoading.value.issueCard = true
    console.log(isLoading.value)
    console.log(isLoading.value.issueCard)
    const response = await commonService.issueCard(params)
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
    const response = await cardsService.getCardDetailById(id)
    if (response.success) {
      selectedCardDetail.value = response.data
    }
    return response
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
    categoryList,
    getDropdownCategoryList,
    issueCard,
    isOpenCardDetailSlideover,
    toggleCardDetailSlideover,
    selectedCardDetail,
    setSelectedCardDetail,
    getCardDetailById,
  }
})
