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
  FREEZE = 'FREEZE',
  CANCEL = 'CANCEL',
}
export interface ICardData {
  id?: string
  cardName: string
  cardNumber: string
  type: CardType
  category: CardCategory
  balance: number
  totalTopup: number
  totalWithdraw: number
  createdAt: string
  status: CardStatus
}

export interface IFormCardIssue {
  card_name: string
  email: string
  phone_number: string
  country_code: string
  category?: CardCategory
  card_purpose?: string
  card_type: string
  spend_limit: number
}

// Request - Response

export interface IGetCardListParams {
  page: number
  limit: number
  start_date?: string
  end_date?: string
  keyword?: string
  card_status?: CardStatus
  card_type?: CardType
  category?: CardCategory
}