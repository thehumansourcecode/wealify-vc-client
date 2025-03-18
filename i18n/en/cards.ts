import { CardCategory, CardStatus, CardType } from '~/types/cards'
import { CommonCountry } from '~/types/common'
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
      amountSelected: '{selected}/{total} selected cards',
    },
  },
  list: {
    type: {
      [CardType.VIRTUAL]: 'Virtual Card',
      [CardType.PHYSICAL]: 'Physical Card',
    },

    status: {
      [CardStatus.ACTIVE]: 'Active',
      [CardStatus.CANCEL]: 'Cancel',
      [CardStatus.FREEZE]: 'Freeze',
    },

    category: {
      [CardCategory.ENTERTAINMENT]: 'Entertainment',
      [CardCategory.FOOD_BEVERAGE]: 'Food & Beverage',
      [CardCategory.GOVERNMENT_SERVICES]: 'Government Services',
      [CardCategory.INVENTORY]: 'Inventory',
      [CardCategory.MARKETING]: 'Marketing',
      [CardCategory.OFFICE]: 'Office',
      [CardCategory.SALARY]: 'Salary',
      [CardCategory.SALES]: 'Sales',
      [CardCategory.SERVICE_PROVIDER]: 'Service Provider',
      [CardCategory.SOFTWARE]: 'Software',
      [CardCategory.TRAVEL]: 'Travel',
      [CardCategory.UTILITIES]: 'Utilities',
      [CardCategory.INVESTMENT]: 'Investment/Dividend',
      [CardCategory.RETAIL]: 'Retail',
      [CardCategory.OTHER]: 'Other',
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
  },
  issue: {
    info: {
      title: 'Card information',
      form: {
        country: {
          [CommonCountry.INDONESIA]: 'Indonesia',
          [CommonCountry.MYANMAR]: 'Myanmar',
          [CommonCountry.THAILAND]: 'Thailand',
          [CommonCountry.VIETNAM]: 'Vietnam',
          [CommonCountry.MALAYSIA]: 'Malaysia',
          [CommonCountry.PHILIPPINES]: 'Philippines',
          [CommonCountry.LAOS]: 'Laos',
          [CommonCountry.CAMBODIA]: 'Cambodia',
          [CommonCountry.EAST_TIMOR]: 'East Timor',
          [CommonCountry.BRUNEI]: 'Brunei',
          [CommonCountry.SINGAPORE]: 'Singapore',
        },
        label: {
          name: 'Card name',
          email: 'Email',
          phoneNumber: 'Phone number',
          category: 'Card category',
          purpose: 'Card purpose',
        },
        placeholder: {
          name: 'Enter card name',
          email: 'Enter your email',
          phoneNumber: `Enter cardholder's phone number`,
          category: 'Choose card category',
          purpose: 'Enter card purpose',
        },
      },
    },
    balance: {
      title: 'Balance',
      form: {
        starting: 'Starting balance of the card',
        available: 'Available: {amount} USD',
      },
    },
    preview: {
      title: 'Card preview',
      namePlaceholder: 'Card holder name',
      fee: 'Issue card fee',
      starting: 'Starting balance of the card',
      totalTopup: 'Total top up',
      button: 'Issue card',
    },
    policy: 'I agree with Terms of Use and Policy',
  },
}
