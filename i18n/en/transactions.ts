import { TransactionCryptocurrency, TransactionNetwork } from '~/types/dashboard'
import { TransactionStatus, TransactionType } from '~/types/transactions'

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
      [TransactionType.INTERNAL]: 'Spend',
      [TransactionType.TOP_UP]: 'Top-up',
      [TransactionType.WITHDRAWAL]: 'Withdraw',
    },
    status: {
      [TransactionStatus.PENDING]: 'Processing',
      [TransactionStatus.PROCESS]: 'Processing',
      [TransactionStatus.APPROVED]: 'Success',
      [TransactionStatus.REJECTED]: 'Failed',
      [TransactionStatus.WAITING]: 'Processing',
      [TransactionStatus.CANCELLED]: 'Failed',
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
      [TransactionType.INTERNAL]: 'Payment Amount',
      [TransactionType.TOP_UP]: 'Top up Amount',
      [TransactionType.WITHDRAWAL]: 'Withdraw Amount',
    },
    amount: '{amount} USDT',
    rate: 'Rate',
    fee: 'Fee',
    rateValue: '{rateUSDT} USDT = {rateUSD} USD',
    feeValue: '{fee} USD',
    account: 'Top up account',
    address: 'Received address',
    txhash: 'TxHash',
    id: 'Top up ID',
    created_at: 'Created at',
    successAt: 'Success at',
    createNew: {
      [TransactionType.INTERNAL]: 'Create new payment',
      [TransactionType.TOP_UP]: 'Create new top up',
      [TransactionType.WITHDRAWAL]: 'Create new withdraw',
    },
    contact:
      'If you find any errors or omissions in this statement, please contact Wealify’s customer service emailing at ',
    label: {
      [TransactionType.INTERNAL]: 'Wallet Payment',
      [TransactionType.TOP_UP]: 'Wallet Top up',
      [TransactionType.WITHDRAWAL]: 'Wallet Withdraw',
    },
    status: {
      [TransactionStatus.PENDING]: 'Processing',
      [TransactionStatus.PROCESS]: 'Processing',
      [TransactionStatus.APPROVED]: 'Success',
      [TransactionStatus.REJECTED]: 'Failed',
      [TransactionStatus.WAITING]: 'Processing',
      [TransactionStatus.CANCELLED]: 'Failed',
    },
  },
}
