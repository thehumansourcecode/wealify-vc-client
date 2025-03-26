import type { CommonCountry, FeeType } from './common'

export enum CardType {
  PHYSICAL = 'PHYSICAL',
  VIRTUAL = 'VIRTUAL',
}

export enum CardCategory {
  INVENTORY = 'Inventory',
  INVESTMENT_DIVIDEND = 'Investment/Dividend',
  MARKETING = 'Marketing',
  SALARY = 'Salary',
  EQUIPMENT = 'Equipment',
  GOVERNMENT_SERVICES = 'Government Services',
  SOFTWARE = 'Software',
  RETAIL = 'Retail',
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
export interface ICardDetail {
  id: string
  email: string
  balance: number
  card_name: string
  card_number: string
  card_purpose: string
  card_type: CardType
  card_status: CardStatus
  category: CardCategory
  expiry_date: string
  last_four: string
  phone_number: string
  total_top_up: number
  total_withdraw: number
  country_code: CommonCountry
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

export interface IEditCardParams {
  card_name: string
  email: string
  phone_number: string
  country_code: CommonCountry
  category?: CardCategory
  card_purpose?: string
}

export interface ITopupCardParams {
  id: string
  amount: number
}

// Request - Response

export interface IGetDropdownCardListParams {
  page?: number
  limit?: number
  start_date?: string
  end_date?: string
  keyword?: string
  card_status?: CardStatus[]
  card_type?: CardType
  category?: CardCategory[]
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
