import { normalize, showToast, ToastType } from '~/common/functions'
import { cardService } from '~/services/cards.service'
import { commonService } from '~/services/common.service'
import { otpService } from '~/services/otp.service'
import {
  CardCategory,
  CardStatus,
  type IIssueCardParams,
  type IGetCardListParams,
  type ICardDetail,
  type ITopupCardParams,
  type IEditCardParams,
  type ICardSensitiveDetail,
} from '~/types/cards'
import { FeeType, type IDropdownCardData } from '~/types/common'

export const useCardStore = defineStore('card', () => {
  const cardCount = ref(0)
  const totalCreatedCard = ref(0)
  const activeCardCount  = ref(0)
  const { t } = useI18n()
  const commonStore = useCommonStore()

  // Payload for card list
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

  // MODALS

  const isOpenCardTopupModal = ref(false)
  const isVisibleConfirmFreeze = ref(false)
  const isVisibleConfirmCancel = ref(false)
  const isVisibleConfirmUnfreeze = ref(false)
  const isPreventClose = ref(false)

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

  const isOpenSensitiveOTPModal = ref(false)
  function toggleSensitiveOTPModal(state: boolean) {
    isOpenSensitiveOTPModal.value = state
  }

  const isOpenCardDetailSlideover = ref(false)
  function toggleCardDetailSlideover(state: boolean) {
    isOpenCardDetailSlideover.value = state
    isShowCardSensitiveDetail.value = false
  }

  const isOpenCardEditModal = ref(false)
  function toggleCardEditModal(state: boolean) {
    isOpenCardEditModal.value = state
  }

  // Loading
  const isLoading = ref({
    issueCard: false,
    cardTable: false,
    topupCard: false,
    freezeCard: false,
    cancelCard: false,
    unfreezeCard: false,
    editCard: false,
  })

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
        balance: card?.balance,
      }
    } else {
      selectedCardForTopup.value = undefined
    }
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
      activeCardCount.value =  response.data.total_active
      totalCreatedCard.value = response.data.total_created
    }
    isLoading.value.cardTable = false
    return response
  }

  // Card actions: Issue, topup, withdraw, cancel, freeze

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

  async function editCard(params: IEditCardParams, id: string) {
    isLoading.value.editCard = true
    const response = await cardService.editCard(params, id)
    if (response.success) {
      toggleCardEditModal(false)
      showToast(ToastType.SUCCESS, t('common.toast.success.editCard'))
      if (payload.value.card_status.length !== 1 || payload.value.card_status[0] !== CardStatus.ACTIVE) {
        setPayload({ ...payload.value, card_status: [CardStatus.ACTIVE] })
      } else {
        await getCardList(payload.value)
      }
      await getCardDetailById(id)
      toggleCardDetailSlideover(true)
    } else {
      showToast(ToastType.FAILED, response.message)
    }
    isLoading.value.editCard = false
    return response
  }

  // Sensitive details OTP handling
  const isShowCardSensitiveDetail = ref(false)
  const cardSensitiveDetail = ref<ICardSensitiveDetail>()
  async function sendOTPSensitiveDetail() {
    commonStore.toggleProcessingModal(true)
    const response = await otpService.sendOTPSensitiveDetail()
    commonStore.toggleProcessingModal(false)
    return response
  }

  async function verifyOTPSensitiveDetail(code: string) {
    console.log(code)
    commonStore.toggleProcessingModal(true)
    toggleSensitiveOTPModal(false)
    isShowCardSensitiveDetail.value = true
    // Handle Verify OTP
    // const response = await otpService.verifyOTPSensitiveDetail(code)
    // if (response.success) {
    //   toggleSensitiveOTPModal(false)
    //   isShowCardSensitiveDetail.value = true
    // }
    if (selectedCardDetail.value?.id) {
      const response = await cardService.getCardSensitiveDetailById(selectedCardDetail.value?.id)
      if (response.success) {
        cardSensitiveDetail.value = response.data
      }
    }
    commonStore.toggleProcessingModal(false)
    // return response
  }

  return {
    isLoading,
    // modals - slideovers
    isVisibleConfirmFreeze,
    isVisibleConfirmCancel,
    isVisibleConfirmUnfreeze,
    toggleCardUnFreeze,
    toggleCardFreeze,
    toggleCardCancel,

    isOpenCardDetailSlideover,
    toggleCardDetailSlideover,
    isOpenCardEditModal,
    toggleCardEditModal,
    isOpenCardTopupModal,
    toggleCardTopupModal,
    isOpenSensitiveOTPModal,
    toggleSensitiveOTPModal,
    // Card table
    payload,
    setPayload,
    setPayloadPage,
    cardList,
    cardCount,
    totalCreatedCard,
    activeCardCount,
    getCardList,
    activeCardList,
    // Card detail slideover
    selectedCardForTopup,
    setSelectedCardForTopup,
    selectedCardDetail,
    setSelectedCardDetail,
    getCardDetailById,
    isPreventClose,
    // Card actions
    issueCard,
    freezeCard,
    cancelCard,
    unfreezeCard,
    topupCard,
    editCard,
    // OTPs
    sendOTPSensitiveDetail,
    verifyOTPSensitiveDetail,
    isShowCardSensitiveDetail,
    cardSensitiveDetail,
  }
})
