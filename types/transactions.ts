// Enum for WalletType
export enum WalletType {
  MAIN = 'MAIN',
  VA = 'VA',
  VC = 'VC',
}

// Enum for TransactionType
export enum TransactionType {
  TOP_UP = 'TOP_UP',
  WITHDRAWAL = 'WITHDRAWAL',
  INTERNAL = 'INTERNAL',
}

// Enum for TransactionStatus
export enum TransactionStatus {
  PENDING = 'PENDING',
  PROCESS = 'PROCESS',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  WAITING = 'WAITING',
  CANCELLED = 'CANCELLED',
}

// Enum for TransactionType
export enum TransactionVCType {
  TOP_UP = 'TOP_UP',
  WITHDRAWAL = 'WITHDRAWAL',
  PAYMENT = 'PAYMENT',
}

// Enum for TransactionStatus
export enum TransactionVCStatus {
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}
export interface Fee {
  type: string // e.g., "PERCENT"
  value: number // e.g., 0
}

export interface Rate {
  type: string // e.g., "MANUAL"
  value: number // e.g., 1
}

export interface Currency {
  symbol: string // e.g., "USD"
}

export interface VCard {
  card_name: string
  card_number: string
  last_four: string
}

// Interface for each Transaction item
export interface ITransactionData {
  created_at: string
  id: string
  transaction_id: string
  is_issue: Boolean
  fee: Fee
  rate: Rate
  amount: number
  received_amount: number // Amount after fees
  transaction_type: TransactionType // Added string as a fallback for other possible types
  transaction_status: TransactionStatus // Added string as a fallback for other possible types
  transaction_vc_status: TransactionVCStatus // Added string as a fallback for other possible types
  transaction_vc_type: TransactionVCType // Added string as a fallback for other possible types
  is_vc_transaction: boolean
  virtual_card: VCard
  currency: Currency
  detailType?: TransactionDetailType
  vc_detail_transaction_type : String
}

export interface IGetTransactionListParams {
  page: number
  limit: number
  start_date?: string
  end_date?: string
  keyword?: string
  exclude_vc_detail_transaction_types?: string
  transaction_status?: TransactionVCStatus[]
  transaction_type?: TransactionVCType[]
  dataSort?: {
    direction?: 'ASC' | 'DESC'
    field?: string
  }
}

export enum TransactionDetailType {
  CARD_ISSUE_TOPUP = 'CARD_ISSUE_TOP_UP',
  CARD_TOP_UP = 'CARD_TOP_UP',
  CARD_WITHDRAW = 'CARD_WITHDRAW',
  CARD_CRYPTO_TOP_UP = 'CARD_TOP_UP_CRYPTO',
  CARD_PAYMENT = 'CARD_PAYMENT',
  WALLET_TOP_UP = 'WALLET_TOP_UP',
  WALLET_WITHDRAW = 'WALLET_WITHDRAW',
  WALLET_ISSUE_WITHDRAW = 'WALLET_ISSUE_WITHDRAW',
  WALLET_REFUND = 'WALLET_REFUND'
}
