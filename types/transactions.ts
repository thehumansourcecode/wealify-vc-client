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

// Interface for each Transaction item
export interface ITransactionData {
  created_at: string // ISO 8601 timestamp, e.g., "2025-03-24T04:00:05.261Z"
  updated_at: string // ISO 8601 timestamp, e.g., "2025-03-24T04:00:05.261Z"
  id: string // UUID, e.g., "77572b62-a82d-43d3-8076-b3b4677ca72e"
  transaction_id: string // ID, e.g., "T123456789"
  fee: Fee
  rate: Rate
  amount: number // e.g., 152887.16402
  transaction_type: TransactionType // e.g., "TOP_UP"
  transaction_status: TransactionStatus // e.g., "APPROVED"
  virtual_card: null | object // null in this case, but could be an object
  currency: Currency
}

export interface IGetTransactionListParams {
  page: number
  limit: number
  start_date?: string
  end_date?: string
  keyword?: string
  transaction_status?: TransactionStatus[]
  transaction_type?: TransactionType[]
  dataSort?: {
    direction?: 'ASC' | 'DESC'
    field?: string
  }
}
