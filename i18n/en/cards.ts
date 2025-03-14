import { CardCategory, CardStatus } from '~/types/cards'
export default {
  button: {
    withdraw: 'Withdraw',
    issue: 'Issue',
    topup: 'Top-up',
    freeze: 'Freeze',
    unfreeze: 'Unfreeze',
    cancel: 'Cancel cards',
  },
  filter: {
    placeholder: {
      search: 'Search card number, card name',
    },
    label: {
      type: 'Type',
      category: 'Category',
      status: 'Status',
      total: 'Total: ${amount}',
      amount: '{active}/{total} cards',
      amountSelected: '{selected}/{total} selected cards'
    },
  },
  list: {
    status: {
      [CardStatus.ACTIVE]: 'Active',
      [CardStatus.CANCEL]: 'Cancel',
      [CardStatus.FREEZE]: 'Freeze',
    },
    empty: 'No card created yet',
    pagination: {
      limit: '{limit} lines/page',
    },
    header: {
      card: 'Card',
      type: 'Type',
      category: 'Category',
      balance: 'Balance',
      totalTopup: 'Total Top-up',
      totalSpend: 'Total Spend',
      createdAt: 'Create Date',
      status: 'Status',
      action: 'Action',
    },
    category: {
      [CardCategory.INVESTMENT]: 'Investment/Dividend',
      [CardCategory.TRAVEL]: 'Travel',
      [CardCategory.UTILITIES]: 'Utilities',
      [CardCategory.SOFTWARE]: 'Software',
      [CardCategory.MARKETING]: 'Marketing',
      [CardCategory.SALES]: 'Sales',
      [CardCategory.OTHER]: 'Other',
    },
  },
}
