import { TransactionCryptocurrency, TransactionNetwork } from '~/types/dashboard'
import { TransactionDetailType, TransactionVCStatus, TransactionVCType } from '~/types/transactions'

export default {
  button: {
    export: 'Export',
  },
  recentTitle: 'Recent transactions',
  viewAll: 'View all',
  filter: {
    placeholder: {
      search: 'Search card number, card name,Transaction ID',
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
    empty: 'No transactions in your history',
    header: {
      type: 'Type',
      transactionId: 'Transaction ID',
      amount: 'Amount',
      currency: 'Currency',
      card: 'Card',
      status: 'Status',
      create_date:'Create date',
      action: 'Action',
    },
    type: {
      [TransactionVCType.PAYMENT]: 'Spend',
      [TransactionVCType.TOP_UP]: 'Top-up',
      [TransactionVCType.WITHDRAWAL]: 'Withdraw',
    },
    status: {
      [TransactionVCStatus.PROCESSING]: 'Processing',
      [TransactionVCStatus.SUCCESS]: 'Success',
      [TransactionVCStatus.FAILURE]: 'Failed',
    },
    card: 'Card',
    wallet: 'Wallet',
    action: {
      viewDetail: 'View Detail',
    },
    pagination: {
      limit: '{limit} lines/page',
    },
  },
  modals: {
    topup: {
      title: 'Top up',
      note: 'Send only USDT/USDC to this deposit address. Sending any other asset to this address may result in the loss of your deposit',
      fee: 'Fee: {fee}%',
      label: {
        network: 'Network',
        [TransactionNetwork.SOLANA]: 'Solana (SOL)',
        [TransactionNetwork.ETHEREUM]: 'Ethereum (ERC-20)',
        [TransactionNetwork.TRON]: 'Tron (TRC-20)',

        currency: 'Currency',
        [TransactionCryptocurrency.USDT]: 'USDT',
        [TransactionCryptocurrency.USDC]: 'USDC',

        address: 'Address',
      },
    },
  },
  detail: {
    to: {
      [TransactionDetailType.CARD_PAYMENT]: 'Card',
      [TransactionDetailType.CARD_TOP_UP]: 'Card',
      [TransactionDetailType.CARD_ISSUE_TOPUP]:'Card',
      [TransactionDetailType.CARD_WITHDRAW]: 'Card',
      [TransactionDetailType.WALLET_TOP_UP]: 'Wealify balance',
      [TransactionDetailType.WALLET_WITHDRAW]: 'Card',
      [TransactionDetailType.WALLET_ISSUE_WITHDRAW]: 'issue new virtual card',
      [TransactionDetailType.WALLET_REFUND]: 'refund to wallet when cancelling card',
    },
    amountLabel: {
      [TransactionDetailType.CARD_PAYMENT]: 'Merchant charged',
      [TransactionDetailType.CARD_TOP_UP]: 'Top up amount',
      [TransactionDetailType.CARD_ISSUE_TOPUP]: 'Top up amount',
      [TransactionDetailType.CARD_WITHDRAW]: 'Withdraw amount',
      [TransactionDetailType.WALLET_TOP_UP]: 'Top up amount',
      [TransactionDetailType.WALLET_WITHDRAW]: 'Withdraw amount',
      [TransactionDetailType.WALLET_ISSUE_WITHDRAW]: 'Withdraw amount',
      [TransactionDetailType.WALLET_REFUND]: 'Top up amount',
    },
    amount:  {
      [TransactionDetailType.WALLET_TOP_UP]: '{amount} {currency}',
      [TransactionDetailType.WALLET_WITHDRAW]: '{amount} {currency}',
      [TransactionDetailType.WALLET_ISSUE_WITHDRAW]: '{amount} {currency}',
      [TransactionDetailType.CARD_TOP_UP]: '{amount} {currency}',
      [TransactionDetailType.CARD_ISSUE_TOPUP]: '{amount} {currency}',
      [TransactionDetailType.CARD_WITHDRAW]: '{amount} {currency}',
      [TransactionDetailType.CARD_PAYMENT]: '{amount} {currency}',
      [TransactionDetailType.WALLET_REFUND]: '{amount} {currency}',
    },
    rate: 'Rate',
    fee: 'Fee',
    rateValue: '{rateUSDT} {currency} = {rateUSD} USD',
    feeValue: '{fee} USD',
    account: 'Top up account',
    address: 'Received address',
    wallet: 'Wallet',
    txhash: 'TxHash',
    cardName: 'Card name',
    cardNumber: 'Card number',
    id: {
      [TransactionVCType.PAYMENT]: 'Payment ID',
      [TransactionVCType.TOP_UP]: 'Card Top up ID',
      [TransactionVCType.WITHDRAWAL]: 'Wallet Withdraw ID',
    },
    id2: {
      [TransactionVCType.PAYMENT]: 'Payment ID',
      [TransactionVCType.TOP_UP]: 'Wallet Withdraw ID',
      [TransactionVCType.WITHDRAWAL]: 'Card Topup ID',
    },
    created_at: 'Created at',
    successAt: 'Success at',
    createNew: {
      [TransactionDetailType.WALLET_TOP_UP]: 'Create new top up',
    },
    downloadInvoice: {
      [TransactionDetailType.CARD_PAYMENT]: 'Download Invoice',
    },
    disputeTransaction: {
      [TransactionDetailType.CARD_PAYMENT]: 'Dispute transaction',
    },
    contact:
      'If you find any errors or omissions in this statement, please contact Wealify’s customer service emailing at ',
    label: {
      [TransactionDetailType.WALLET_TOP_UP]: 'Wallet Top up',
      [TransactionDetailType.WALLET_WITHDRAW]: 'Wallet withdraw',
      [TransactionDetailType.WALLET_ISSUE_WITHDRAW]: 'Wallet withdraw',
      [TransactionDetailType.CARD_TOP_UP]: 'Card Top up',
      [TransactionDetailType.CARD_ISSUE_TOPUP]: 'Card Top up',
      [TransactionDetailType.CARD_WITHDRAW]: 'Card withdraw',
      [TransactionDetailType.CARD_PAYMENT]: 'Card payment',
      [TransactionDetailType.WALLET_REFUND]: 'Wallet Top up',
    },
    status: {
      [TransactionVCStatus.PROCESSING]: 'Processing',
      [TransactionVCStatus.SUCCESS]: 'Success',
      [TransactionVCStatus.FAILURE]: 'Failed',
    },
  },
}
