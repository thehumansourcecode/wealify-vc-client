import { CardCategory, CardStatus, CardType } from '~/types/cards'
import { CommonCurrency } from '~/types/common'
import { TransactionMethod, TransactionStatus, TransactionType, type ITransactionData } from '~/types/dashboard'

export const useTransactionStore = defineStore('transaction', () => {
  const authStore = useAuthStore()
  const commonStore = useCommonStore()
  const toast = useToast()
  const nuxtApp = useNuxtApp()
  const i18n = nuxtApp.$i18n

  const transactionList = ref<ITransactionData[]>([
    {
      type: {
        label: TransactionType.TOPUP,
        method: TransactionMethod.CRYPTO,
      },
      transactionId: 'T124513143726134',
      amount: 100000000,
      currency: CommonCurrency.USD,
      card: null, // USDT top-up, no card used
      status: TransactionStatus.SUCCESS,
    },
    {
      type: {
        label: TransactionType.PAYMENT,
        method: TransactionMethod.CARD,
      },
      transactionId: 'S124513143726134',
      amount: 1000,
      currency: CommonCurrency.USD,
      card: {
        cardName: 'Nguyen Hong Ngoc',
        cardNumber: 'xxxx xxxx xxxx 1232',
      },
      status: TransactionStatus.PROCESSING,
    },
    {
      type: {
        label: TransactionType.WITHDRAW,
        method: TransactionMethod.CRYPTO,
      },
      transactionId: 'T124513143726134',
      amount: 1000,
      currency: CommonCurrency.USD,
      card: null, // USDT withdraw, no card used
      status: TransactionStatus.FAILED,
    },
    {
      type: {
        label: TransactionType.PAYMENT,
        method: TransactionMethod.CARD,
      },
      transactionId: 'T124513143726134',
      amount: 1000,
      currency: CommonCurrency.USD,
      card: {
        cardName: 'Nguyen Hong Ngoc',
        cardNumber: 'xxxx xxxx xxxx 1232',
      },
      status: TransactionStatus.PROCESSING,
    },
    {
      type: {
        label: TransactionType.PAYMENT,
        method: TransactionMethod.CARD,
      },
      transactionId: 'T124513143726134',
      amount: 1000,
      currency: CommonCurrency.USD,
      card: {
        cardName: 'Nguyen Hong Ngoc',
        cardNumber: 'xxxx xxxx xxxx 1232',
      },
      status: TransactionStatus.PROCESSING,
    },
    {
      type: {
        label: TransactionType.TOPUP,
        method: TransactionMethod.CRYPTO,
      },
      transactionId: 'T124513143726134',
      amount: 100000000,
      currency: CommonCurrency.USD,
      card: null, // USDT top-up, no card used
      status: TransactionStatus.SUCCESS,
    },
    {
      type: {
        label: TransactionType.PAYMENT,
        method: TransactionMethod.CARD,
      },
      transactionId: 'S124513143726134',
      amount: 1000,
      currency: CommonCurrency.USD,
      card: {
        cardName: 'Nguyen Hong Ngoc',
        cardNumber: 'xxxx xxxx xxxx 1232',
      },
      status: TransactionStatus.PROCESSING,
    },
    {
      type: {
        label: TransactionType.WITHDRAW,
        method: TransactionMethod.CRYPTO,
      },
      transactionId: 'T124513143726134',
      amount: 1000,
      currency: CommonCurrency.USD,
      card: null, // USDT withdraw, no card used
      status: TransactionStatus.FAILED,
    },
    {
      type: {
        label: TransactionType.PAYMENT,
        method: TransactionMethod.CARD,
      },
      transactionId: 'T124513143726134',
      amount: 1000,
      currency: CommonCurrency.USD,
      card: {
        cardName: 'Nguyen Hong Ngoc',
        cardNumber: 'xxxx xxxx xxxx 1232',
      },
      status: TransactionStatus.PROCESSING,
    },
    {
      type: {
        label: TransactionType.PAYMENT,
        method: TransactionMethod.CARD,
      },
      transactionId: 'T124513143726134',
      amount: 1000,
      currency: CommonCurrency.USD,
      card: {
        cardName: 'Nguyen Hong Ngoc',
        cardNumber: 'xxxx xxxx xxxx 1232',
      },
      status: TransactionStatus.PROCESSING,
    },
    {
      type: {
        label: TransactionType.TOPUP,
        method: TransactionMethod.CRYPTO,
      },
      transactionId: 'T124513143726134',
      amount: 100000000,
      currency: CommonCurrency.USD,
      card: null, // USDT top-up, no card used
      status: TransactionStatus.SUCCESS,
    },
    {
      type: {
        label: TransactionType.PAYMENT,
        method: TransactionMethod.CARD,
      },
      transactionId: 'S124513143726134',
      amount: 1000,
      currency: CommonCurrency.USD,
      card: {
        cardName: 'Nguyen Hong Ngoc',
        cardNumber: 'xxxx xxxx xxxx 1232',
      },
      status: TransactionStatus.PROCESSING,
    },
    {
      type: {
        label: TransactionType.WITHDRAW,
        method: TransactionMethod.CRYPTO,
      },
      transactionId: 'T124513143726134',
      amount: 1000,
      currency: CommonCurrency.USD,
      card: null, // USDT withdraw, no card used
      status: TransactionStatus.FAILED,
    },
    {
      type: {
        label: TransactionType.PAYMENT,
        method: TransactionMethod.CARD,
      },
      transactionId: 'T124513143726134',
      amount: 1000,
      currency: CommonCurrency.USD,
      card: {
        cardName: 'Nguyen Hong Ngoc',
        cardNumber: 'xxxx xxxx xxxx 1232',
      },
      status: TransactionStatus.PROCESSING,
    },
    {
      type: {
        label: TransactionType.PAYMENT,
        method: TransactionMethod.CARD,
      },
      transactionId: 'T124513143726134',
      amount: 1000,
      currency: CommonCurrency.USD,
      card: {
        cardName: 'Nguyen Hong Ngoc',
        cardNumber: 'xxxx xxxx xxxx 1232',
      },
      status: TransactionStatus.PROCESSING,
    },
  ])

  async function getTransactionList() {}

  return {
    transactionList,
    getTransactionList,
  }
})
