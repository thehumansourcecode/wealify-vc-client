export enum CardType {
  PHYSICAL = 'PHYSICAL',
  DIGITAL = 'DIGITAL',
}

export enum CardCategory {
  INVESTMENT = 'INVESTMENT',
  TRAVEL = 'TRAVEL',
  UTILITIES = 'UTILITIES',
  SOFTWARE = 'SOFTWARE',
  MARKETING = 'MARKETING',
  SALES = 'SALES',
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
  cardType: CardType
  cardCategory: CardCategory | string
  balance: number
  totalTopup: number
  totalSpend: number
  createdAt: string
  status: CardStatus
}
