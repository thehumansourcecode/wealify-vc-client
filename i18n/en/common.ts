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
  header: {
    profile: 'Profile',
    resetPassword: 'Reset Password',
    lastReset: 'Last edit: {date}',
    logout: 'Logout',
},
  toast: {
    copy: 'Copied to clipboard!',
  },
  validator: {
    empty: {
      issueCard: {
        name: 'Card name is mandatory. Please enter your card name',
        phoneNumber: 'Phone number is mandatory. Please enter your phone number',
        email: 'Email is mandatory. Please enter your email',
        category: "Category is mandatory. Please choose your category"
      },
    },
    invalid: {
      issueCard: {
        email: 'Invalid email address',
        zeroStartingBalance: 'Please enter an amount greater than 0',
        limitStartingBalance: 'The maximum amount is 999,999,999',
      },
    },
  },
}
