import type { ICardData } from './card'
import type { CommonCurrency } from './common'

export enum TransactionType {
  TOPUP = 'TOPUP',
  PAYMENT = 'PAYMENT',
  WITHDRAW = 'WITHDRAW',
}

export enum TransactionMethod {
  CARD = 'CARD',
  USDT = 'USDT',
}

export enum TransactionStatus {
  SUCCESS = 'SUCCESS',
  PROCESSING = 'PROCESSING',
  FAILED = 'FAILED',
}

export enum TransactionNetwork {
  SOLANA = 'SOL',
  TRON = 'TRX',
  ETHEREUM = 'ETH',
}

export enum TransactionCryptocurrency {
  USDT = 'USDT',
  USDC = 'USDC',
}

export interface ITransactionData {
  type: {
    method: TransactionMethod
    label: TransactionType
  }
  transactionId: string
  amount: number
  currency: CommonCurrency
  card: Partial<ICardData> | null
  status: TransactionStatus
}
