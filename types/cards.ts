export enum CardType {
  PHYSICAL = 'PHYSICAL',
  VIRTUAL = 'VIRTUAL',
}

export enum CardCategory {
  ENTERTAINMENT = 'ENTERTAINMENT',
  FOOD_BEVERAGE = 'FOOD_BEVERAGE',
  GOVERNMENT_SERVICES = 'GOVERNMENT_SERVICES',
  INVENTORY = 'INVENTORY',
  MARKETING = 'MARKETING',
  OFFICE = 'OFFICE',
  SALARY = 'SALARY',
  SALES = 'SALES',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  SOFTWARE = 'SOFTWARE',
  TRAVEL = 'TRAVEL',
  UTILITIES = 'UTILITIES',
  INVESTMENT = 'INVESTMENT',
  RETAIL = 'RETAIL',
  OTHER = 'OTHER',
}

export enum CardStatus {
  ACTIVE = 'ACTIVE',
  FREEZE = 'FREEZE',
  CANCEL = 'CANCEL',
}

export interface ICardData {
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
  type: CardType
  name: string
  email: string
  countryCode: string
  phoneNumber: string
  category: string
  purpose: string
  startingBalance: number
}
