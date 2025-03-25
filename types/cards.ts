import type { CommonCountry } from './common'

export enum CardType {
  PHYSICAL = 'PHYSICAL',
  VIRTUAL = 'VIRTUAL',
}

export enum CardCategory {
  INVENTORY = 'Inventory',
  MARKETING = 'Marketing',
  SALARY = 'Salary',
  EQUIPMENT = 'Equipment',
  SERVICE_PROVIDER = 'Service Provider',
  TAXES = 'Taxes',
  TRAVEL = 'Travel',
  OFFICE = 'Office',
  UTILITIES = 'Utilities',
  SALES = 'Sales',
  FOOD_BEVERAGES = 'Food & Beverages',
  ENTERTAINMENT = 'Entertainment',
  API_PAYMENTS = 'API Payments',
  CLIMATE_CHANGE = 'Climate Change',
  FOOD = 'Food',
  ADS_SERVICE = 'Ads Service',
  OTHER = 'Other',
}

export enum CardStatus {
  ACTIVE = 'ACTIVE',
  FROZEN = 'FROZEN',
  CANCELLED = 'CANCELLED',
}
export interface ICardData {
  id?: string
  card_name: string
  cardNumber: string
  card_type: CardType
  card_status: CardStatus
  expiry_date: string
  category: CardCategory
  balance: number
  total_top_up: number
  total_withdraw: number
  created_at: string
}

export interface ICardDetail {
  balance: number
  card_name: string
  card_purpose: string
  card_status: string
  category: string
  email: string
  expiry_date: string
  id: string
  last_four: string
  phone_number: string
  total_top_up: number
  total_withdraw: number
}

export interface IIssueCardParams {
  card_name: string
  email: string
  phone_number: string
  country_code: CommonCountry
  category?: CardCategory
  card_purpose?: string
  card_type: string
  spend_limit: number
}

// Request - Response

export interface IGetDropdownCardListParams {
  page: number
  limit: number
  start_date?: string
  end_date?: string
  keyword?: string
  card_status: CardStatus[]
  card_type?: CardType
  category: CardCategory[]
}

export interface IGetCardListParams {
  page: number
  limit: number
  start_date?: string
  end_date?: string
  keyword?: string
  card_status: CardStatus[]
  card_type?: CardType
  category: CardCategory[]
}
