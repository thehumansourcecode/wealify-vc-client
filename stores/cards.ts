import { normalize, showToast, ToastType } from '~/common/functions'
import { cardService } from '~/services/cards.service'
import { commonService } from '~/services/common.service'
import {
  CardCategory,
  CardStatus,
  type IIssueCardParams,
  type IGetCardListParams,
  type ICardDetail,
  type ITopupCardParams,
  type IEditCardParams,
} from '~/types/cards'
import { FeeType, type IDropdownCardData } from '~/types/common'

export const useCardStore = defineStore('card', () => {
  const cardCount = ref(0)
  const { t } = useI18n()
  const commonStore = useCommonStore()
  const isOpenCardTopupModal = ref(false)
  const isVisibleConfirmFreeze = ref(false)
  const isVisibleConfirmCancel = ref(false)
  const isVisibleConfirmUnfreeze = ref(false)

  function toggleCardTopupModal(state: boolean) {
    isOpenCardTopupModal.value = state
  }

  function toggleCardFreeze(state: boolean) {
    isVisibleConfirmFreeze.value = state
  }

  function toggleCardUnFreeze(state: boolean) {
    isVisibleConfirmUnfreeze.value = state
  }

  function toggleCardCancel(state: boolean) {
    isVisibleConfirmCancel.value = state
  }

  const isLoading = ref({
    issueCard: false,
    cardTable: false,
    topupCard: false,
    freezeCard: false,
    cancelCard: false,
    unfreezeCard: false,
    editCard: false,
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

  const selectedCardForTopup = ref<IDropdownCardData | undefined>()

  function setSelectedCardForTopup(card?: ICardDetail) {
    if (card?.id) {
      selectedCardForTopup.value = {
        id: card.id,
        card_name: card?.card_name,
        last_four: card?.last_four,
      }
    } else {
      selectedCardForTopup.value = undefined
    }
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
    // Flow: issue card => get id from response => back to card list page => call API to get card data from id => Show card detail
    isLoading.value.issueCard = true
    commonStore.toggleProcessingModal(true)
    const response = await cardService.issueCard(params)
    if (response.success) {
      const id = response.data.id
      navigateTo('/cards')
      showToast(ToastType.SUCCESS, t('common.toast.success.issueCard'))
      // Fetch newly created card
      setPayload({ ...payload.value, card_status: [CardStatus.ACTIVE] })
      await getCardList(payload.value)
      // Open card detail slideover logic
      const selectedCardDetail = cardList.value.find((card: ICardDetail) => card.id === id)
      if (selectedCardDetail) {
        const getCardDetailResponse = await getCardDetailById(id)
        if (getCardDetailResponse.success) {
          const cardDetail = getCardDetailResponse.data
          setSelectedCardForTopup(cardDetail)
          toggleCardDetailSlideover(true)
        }
      }
    } else {
      showToast(ToastType.FAILED, response.message)
    }
    commonStore.toggleProcessingModal(false)
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
        success: false,
        message: response.message,
      }
    }
    return {
      success: true,
    }
  }

  async function cancelCard(id: string) {
    const response = await cardService.cancelCard(id)
    if (!response.success) {
      return {
        success: false,
        message: response.message,
      }
    }
    return {
      success: true,
    }
  }

  async function unfreezeCard(id: string) {
    const response = await cardService.unfreezeCard(id)
    if (!response.success) {
      return {
        success: false,
        message: response.message,
      }
    }
    return {
      success: true,
    }
  }

  async function topupCard(params: ITopupCardParams) {
    isLoading.value.topupCard = true
    toggleCardTopupModal(false)
    commonStore.toggleProcessingModal(true)
    const response = await cardService.topup(params)
    if (response.success) {
      showToast(ToastType.SUCCESS, t('common.toast.success.topupCard'))
      // On change status => call API. Avoid duplicate API calls
      if (payload.value.card_status.length !== 1 || payload.value.card_status[0] !== CardStatus.ACTIVE) {
        setPayload({ ...payload.value, card_status: [CardStatus.ACTIVE] })
      } else {
        await getCardList(payload.value)
      }
    } else {
      showToast(ToastType.FAILED, t('common.toast.failed.topupCard'))
    }
    isLoading.value.topupCard = false
    commonStore.toggleProcessingModal(false)
    return response
  }

  const isOpenCardEditModal = ref(false)
  function toggleCardEditModal(state: boolean) {
    isOpenCardEditModal.value = state
  }

  async function editCard(params: IEditCardParams, id: string) {
    isLoading.value.editCard = true
    const response = await cardService.editCard(params, id)
    if (response.success) {
      showToast(ToastType.SUCCESS, t('common.toast.success.editCard'))
      // On change status => call API. Avoid duplicate API calls
      if (payload.value.card_status.length !== 1 || payload.value.card_status[0] !== CardStatus.ACTIVE) {
        setPayload({ ...payload.value, card_status: [CardStatus.ACTIVE] })
      } else {
        await getCardList(payload.value)
      }
    } else {
      showToast(ToastType.FAILED, response.message)
    }
    isLoading.value.editCard = false
    return response
  }

  return {
    isVisibleConfirmFreeze,
    isVisibleConfirmCancel,
    isVisibleConfirmUnfreeze,
    toggleCardUnFreeze,
    toggleCardFreeze,
    toggleCardCancel,
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
    unfreezeCard,
    selectedCardForTopup,
    setSelectedCardForTopup,
    topupCard,
    isOpenCardEditModal,
    toggleCardEditModal,
    editCard,
  }
})
