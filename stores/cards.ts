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
} from '~/types/cards'

export const useCardStore = defineStore('card', () => {
  const authStore = useAuthStore()
  const commonStore = useCommonStore()
  const toast = useToast()
  const nuxtApp = useNuxtApp()
  const i18n = nuxtApp.$i18n

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

  const selectedCardDetail = ref<ICardData>()
  function setSelectedCardDetail(card?: ICardData) {
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

  const filteredCardList = computed(() =>
    cardList.value?.filter((card: ICardData) => {
      const haveType = payload.value.card_type ? card.card_type === payload.value.card_type : true
      const haveCategory = payload.value.category.length ? payload.value.category.includes(card.category) : true
      const haveStatus = payload.value.card_status.length ? payload.value.card_status.includes(card.card_status) : true
      const haveKeyword = payload.value.keyword
        ? normalize(card.card_name) === normalize(payload.value.keyword) ||
          card.cardNumber.includes(payload.value.keyword)
        : true
      return haveType && haveStatus && haveCategory && haveKeyword
    }),
  )

  async function getCardList(payload: IGetCardListParams) {
    const response = await cardsService.getCardList(payload)
    if (response.success) {
      cardList.value = response.data.items
    }
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
    const response = await commonService.issueCard(params)
    if (response.success) {
      navigateTo('/cards')
      payload.value = { ...payload.value, card_status: [CardStatus.ACTIVE] }
      await getCardList(payload.value)
    } else {
      showToast(ToastType.FAILED, i18n.t('cards.issue.notification.failed'))
    }
    return response
  }

  return {
    payload,
    setPayload,
    cardList,
    getCardList,
    activeCardList,
    filteredCardList,
    categoryList,
    getDropdownCategoryList,
    issueCard,
    isOpenCardDetailSlideover,
    toggleCardDetailSlideover,
    selectedCardDetail,
    setSelectedCardDetail,
  }
})
