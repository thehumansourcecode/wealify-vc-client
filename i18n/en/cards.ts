import { CardCategory, CardStatus, CardType } from '~/types/cards'
import { CommonCountry } from '~/types/common'
export default {
  button: {
    withdraw: 'Withdraw',
    issue: 'Issue card',
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
    card_number: 'xxxx xxxx xxxx {value}',
    type: {
      [CardType.VIRTUAL]: 'Virtual Card',
      [CardType.PHYSICAL]: 'Physical Card',
    },

    status: {
      [CardStatus.ACTIVE]: 'Active',
      [CardStatus.CANCELLED]: 'Cancel',
      [CardStatus.FROZEN]: 'Freeze',
    },

    category: {
      [CardCategory.ENTERTAINMENT]: 'Entertainment',
      [CardCategory.FOOD_BEVERAGES]: 'Food & Beverages',
      [CardCategory.INVENTORY]: 'Inventory',
      [CardCategory.MARKETING]: 'Marketing',
      [CardCategory.OFFICE]: 'Office',
      [CardCategory.SALARY]: 'Salary',
      [CardCategory.SALES]: 'Sales',
      [CardCategory.SERVICE_PROVIDER]: 'Service Provider',
      [CardCategory.TRAVEL]: 'Travel',
      [CardCategory.UTILITIES]: 'Utilities',
      [CardCategory.OTHER]: 'Other',
      [CardCategory.EQUIPMENT]: 'Equipment',
      [CardCategory.TAXES]: 'Taxes',
      [CardCategory.API_PAYMENTS]: 'API Payments',
      [CardCategory.CLIMATE_CHANGE]: 'Climate Change',
      [CardCategory.FOOD]: 'Food',
      [CardCategory.ADS_SERVICE]: 'Ads Service',
    },
    empty: 'No card created yet',
    pagination: {
      limit: '{limit} lines/page',
    },
    header: {
      card: 'Card',
      type: 'Type',
      category: 'Category',
      balance: 'Card Balance',
      total_top_up: 'Total Top-up',
      total_withdraw: 'Total Withdraw',
      created_at: 'Create Date',
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
          name: 'Enter your card name',
          email: `Enter cardholder's email`,
          phoneNumber: `Enter cardholder's phone number`,
          category: 'Choose card category',
          purpose: 'Enter your card purpose',
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
      total_top_up: 'Total top up',
      button: 'Issue card',
    },
    policy: 'I agree with Terms of Use and Policy',
    notification: {
      title: 'Notification',
      failed: 'Failed to issue a new card. Please try again later',
      limit: 'You have reached the maximum number of cards created. Please contact sales for more supports',
      process: {
        title: 'Processing',
        description: `We're proccessing your request. One moment please`,
      },
    },
  },
  slideovers: {
    detail: {
      label: 'Card detail',
      info: {
        card_number: 'Card number',
        CVV: 'CVV',
        expired: 'Expired date',
        cardBalance: 'Card balance',
        purpose: 'Card purpose',
        total_top_up: 'Total Top-up',
        total_withdraw: 'Total Withdraw',
        balance: 'Balance',
      },
      button: {
        transaction: 'View Transaction',
        viewInfo: 'View card information',
        topup: 'Top-Up',
        freeze: 'Freeze',
        cancel: 'Cancel',
        withdraw: 'Withdraw',
        unfreeze: 'Unfreeze',
      },
    },
  },
  message:{
    freeze:'Freeze card success !',
    cancel:'Cancel card success !',
    unfreeze:'Unfreeze card success !'
  },
  modals: {
    topup: {
      title: 'Top up card',
    },
  },
}
