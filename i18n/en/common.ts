import { PanelChildTab, PanelTab } from '~/types/common'

export default {
  title: {
    [PanelTab.DASHBOARD]: 'Dashboard',
    [PanelTab.CARD_LIST]: 'Cards',
    [PanelTab.TRANSACTIONS]: 'Transactions',
    [PanelTab.SETTINGS]: 'Settings',
    [PanelTab.HELP]: 'Help',
    [PanelTab.CONTACT_SUPPORT]: 'Contact support',
    [PanelChildTab.CARD_ISSUE]: 'Issue a new card',
  },
  toast: {
    copy: 'Copied to clipboard!'
  },
  validator: {
    empty: {
      issueCard: {
        name: 'Card name is mandatory. Please enter your card name',
        phoneNumber: 'Phone number is mandatory. Please enter your phone number',
        email: 'Email is mandatory. Please enter your email',
      }
    },
    invalid: {
      issueCard: 'Invalid email address',
      startingBalance: 'Please enter an amount greater than 0',
    }
  }
}
