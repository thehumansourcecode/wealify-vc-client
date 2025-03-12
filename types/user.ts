import type { CommonCurrency, CommonUSDTNetwork } from './common'
import type { SortOrder } from './market'

export enum UserTier {
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  MASTER_GUARDIAN = 'MASTER_GUARDIAN',
  DISTINGUISHED = 'DISTINGUISHED',
  LEGENDARY = 'LEGENDARY',
  SUPREME = 'SUPREME',
  GLOBAL_ELITE = 'GLOBAL_ELITE',
}

export enum UserTierThreshold {
  SILVER = 0,
  GOLD = 1000,
  MASTER_GUARDIAN = 2500,
  DISTINGUISHED = 4000,
  LEGENDARY = 7500,
  SUPREME = 12000,
  GLOBAL_ELITE = 20000,
}

export enum UserTierDiscount {
  SILVER = 0,
  GOLD = 0.25,
  MASTER_GUARDIAN = 0.5,
  DISTINGUISHED = 0.75,
  LEGENDARY = 1,
  SUPREME = 1.25,
  GLOBAL_ELITE = 1.5,
}

export interface IReferredUser {
  username: string
  email: string
  createdAt: string // ISO date string
  activatedAt: string // ISO date string
  id: string // UUID
  totalSpendAmount: number
}

export interface IReferralEarning {
  totalReferralBonus: number
  totalReferralBonusDone: number
}

export interface IUserProfileData {
  id: string
  tier: UserTier
  username: string
  password: string
  email: string
  status: UserStatus
  activatedAt: Date
  balance: number
  pendingOrderAmount: number
  referralCode: string
  isPartner: boolean
  successOrderAmount: number
  pendingWithdrawAmount: number
  totalPendingAmount: number
}

export interface IBalanceHistory {
  createdBy: string | null
  updatedBy: string | null
  userId: string
  amount: number
  newBalance: number
  oldBalance: number
  type: string
  mode: string
  metadata: {
    transactionId: string
    userId: string
    amount: number
    fee: number
    rate: number
  }
  createdAt: string
  updatedAt: string
  id: string
}

export interface IUpdateUserProfileParams {
  username: string
}

export interface IUpdateUserReferralCodeParams {
  referralCode: string
}

export interface IOrderHistoryParams {
  sortBy: string
  sortOrder: SortOrder
  keyword?: undefined
  minPrice?: undefined
  maxPrice?: undefined
  startCreatedAt?: undefined
  endCreatedAt?: undefined
}

export interface IBalanceHistoryParams {
  sortBy: string
  sortOrder: SortOrder
  keyword?: undefined
  minPrice?: undefined
  maxPrice?: undefined
  startCreatedAt?: undefined
  endCreatedAt?: undefined
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  REGISTERING = 'REGISTERING',
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
}

export enum TransactionStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum PaymentMethod {
  CRYPTO = 'CRYPTO',
  BANK = 'BANK',
}

export interface IBankOption {
  id: number
  name: string
  code: string
  bin: string
  shortName: string
  logo: string
  transferSupported: number
  lookupSupported: number
  short_name: string
  support: number
  isTransfer: number
  swift_code: string
}

export interface IDepositForm {
  amount?: number
  channel?: PaymentMethod
  bankAccountNumber?: string
  bankOption?: IBankOption
  walletAddress?: string
  currency: CommonCurrency
  network?: CommonUSDTNetwork
}

export interface IWithdrawForm {
  amount?: number
  channel?: PaymentMethod
  bankAccountNumber?: string
  bankOption?: IBankOption
  walletAddress?: string
  currency: CommonCurrency
}

export interface IDepositParams {
  amount?: number
  bankAccountNumber?: string
  bankBin?: string
  walletAddress?: string
  currency: CommonCurrency
}

export interface IWithdrawParams {
  amount?: number
  bankAccountNumber?: string
  bankBin?: string
  walletAddress?: string
  currency: CommonCurrency
}

export interface IDepositResponseData {}

export interface IWithdrawResponseData {}

export interface ITransactionData {
  _id: string
  transactionId: string
  currency: CommonCurrency
  type: TransactionType
  amount: 25000
  remark: string
  status: TransactionStatus
  fee: 0
  rate: 26000
  paymentMethod: PaymentMethod
  walletAddress: null | string
  bankBin: string
  bankAccountNumber: string
  createdAt: string
  updatedAt: string
  id: string
  user: Partial<IUserProfileData>
}
