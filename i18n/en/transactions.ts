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
    cryptoTransfer: 'Crypto Transfer',
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
    to: 'to {destination}',
    amountLabel: {
      [TransactionVCType.PAYMENT]: 'Payment Amount',
      [TransactionVCType.TOP_UP]: 'Top up Amount',
      [TransactionVCType.WITHDRAWAL]: 'Withdraw Amount',
    },
    amount: '{amount} USDT',
    rate: 'Rate',
    fee: 'Fee',
    rateValue: {
      [TransactionVCType.PAYMENT]: '-',
      [TransactionVCType.TOP_UP]: '{rateUSDT} USDT = {rateUSD} USD',
      [TransactionVCType.WITHDRAWAL]: '-',
    },
    feeValue: '{fee} USD',
    account: 'Top up account',
    address: 'Received address',
    txhash: 'TxHash',
    id:  {
      [TransactionVCType.PAYMENT]: 'Top up ID',
      [TransactionVCType.TOP_UP]: 'Top up ID',
      [TransactionVCType.WITHDRAWAL]: 'Withdraw ID',
    },
    created_at: 'Created at',
    successAt: 'Success at',
    createNew: {
      [TransactionVCType.PAYMENT]: 'Create new payment',
      [TransactionVCType.TOP_UP]: 'Create new top up',
      [TransactionVCType.WITHDRAWAL]: 'Create new withdraw',
    },
    contact:
      'If you find any errors or omissions in this statement, please contact Wealify’s customer service emailing at ',
    label: {
      [TransactionDetailType.WALLET_TOP_UP]: 'Wallet Top up',
      [TransactionDetailType.WALLET_WITHDRAW]: 'Wallet withdraw',
      [TransactionDetailType.CARD_TOP_UP]: 'Card Top up',
      [TransactionDetailType.CARD_WITHDRAW]: 'Card withdraw',
      [TransactionDetailType.CARD_PAYMENT]: 'Card payment',
    },
    status: {
      [TransactionVCStatus.PROCESSING]: 'Processing',
      [TransactionVCStatus.SUCCESS]: 'Success',
      [TransactionVCStatus.FAILURE]: 'Failed',
    },
  },
}
