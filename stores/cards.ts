import { normalize, showToast, ToastType } from '~/common/functions'
import { commonService } from '~/services/common.service'
import {
  CardCategory,
  CardStatus,
  CardType,
  type ICardData,
  type IGetCardListParams,
  type IIssueCardParams,
} from '~/types/cards'

export const useCardStore = defineStore('card', () => {
  const authStore = useAuthStore()
  const commonStore = useCommonStore()
  const toast = useToast()
  const nuxtApp = useNuxtApp()
  const i18n = nuxtApp.$i18n

  const payload = ref({
    page: 1,
    limit: 10,
    keyword: undefined,
    type: undefined,
    categories: [] as CardCategory[],
    statuses: [] as CardStatus[],
    start_date: undefined,
    end_date: undefined,
  })

  const selectedCardDetail = ref<ICardData>()
  function setSelectedCardDetail(card?: ICardData) {
    selectedCardDetail.value = card
  }

  const isOpenCardDetailSlideover = ref(false)

  function toggleCardDetailSlideover(state: boolean) {
    isOpenCardDetailSlideover.value = state
  }

  const cardList = ref<ICardData[]>([])

  const activeCardList = computed(() => cardList.value.filter((card: ICardData) => card.status === CardStatus.ACTIVE))

  const filteredCardList = computed(() =>
    cardList.value?.filter((card: ICardData) => {
      const haveType = payload.value.type ? card.type === payload.value.type : true
      const haveCategory = payload.value.categories.length ? payload.value.categories.includes(card.category) : true
      const haveStatus = payload.value.statuses.length ? payload.value.statuses.includes(card.status) : true
      const haveKeyword = payload.value.keyword
        ? normalize(card.cardName) === normalize(payload.value.keyword) ||
          card.cardNumber.includes(payload.value.keyword)
        : true
      return haveType && haveStatus && haveCategory && haveKeyword
    }),
  )

  async function getCardList(payload: IGetCardListParams) {
    const response = await commonService.getCardList(payload)
    if (response.success) {
      cardList.value = response.data
    }
    return response
  }

  const categoryList = ref<CardCategory[]>([])

  async function getCategoryList() {
    const response = await commonService.getCategoryList()
    if (response.success) {
      categoryList.value = response.data
    }
    return response
  }

  async function issueCard(params: IIssueCardParams) {
    const response = await commonService.issueCard(params)
    console.log(response)
    if (response.success) {
      await getCardList(payload.value)
    } else {
      showToast(ToastType.FAILED, i18n.t('cards.issue.notification.failed'))
    }
    return response
  }

  return {
    payload,
    cardList,
    getCardList,
    activeCardList,
    filteredCardList,
    categoryList,
    getCategoryList,
    issueCard,
    isOpenCardDetailSlideover,
    toggleCardDetailSlideover,
    selectedCardDetail,
    setSelectedCardDetail,
  }
})
