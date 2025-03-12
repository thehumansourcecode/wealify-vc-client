import type { CommonCurrency } from './common'

export enum TransactionType {
  TOPUP = 'TOPUP',
  PAYMENT = 'PAYMENT',
  WITHDRAW = 'WITHDRAW',
}

export enum TransactionStatus {
  SUCCESS = 'SUCCESS',
  PROCESSING = 'PROCESSING',
  FAILED = 'FAILED',
}

export interface ICardData {
  cardName: string
  cardNumber: string
}

export interface ITransactionData {
  type: TransactionType
  transactionId: string
  amount: number
  currency: CommonCurrency
  card: ICardData | null
  status: TransactionStatus
}
