import {
  TransactionCryptocurrency,
  TransactionMethod,
  TransactionNetwork,
  TransactionStatus,
  TransactionType,
} from '~/types/dashboard'

export default {
  balance: {
    title: 'Balance',
    wealify: {
      balance: 'Wealify Balance',
      moneyIn: 'Money In',
      moneyOut: 'Money Out',
      topup: 'Top up',
      withdraw: 'Withdraw',
    },
    card: {
      balance: 'Total Card Balance',
      topup: 'Total Top-up',
      withdraw: 'Total Withdraw',
    },
  },
  transactions: {
    title: 'Recent transactions',
    viewAll: 'View all',
    table: {
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
        [TransactionType.PAYMENT]: 'Payment',
        [TransactionType.TOPUP]: 'Top-up',
        [TransactionType.WITHDRAW]: 'Withdraw',
        [TransactionMethod.CRYPTO]: 'Crypto Transfer',
        [TransactionMethod.CARD]: 'Card',
      },
      status: {
        [TransactionStatus.FAILED]: 'Failed',
        [TransactionStatus.SUCCESS]: 'Success',
        [TransactionStatus.PROCESSING]: 'Processing',
      },
      action: {
        viewDetail: 'View Detail',
      },
    },
  },
  modals: {
    topup: {
      title: 'Top up Wallet',
      noteTitle:'Attention!',
      note: 'Please ensure that only USDT or USDC is sent to this deposit address. Transferring any other asset to this address may lead to the permanent loss of your funds',
      feePercent: 'Fee: {fee}%',
      feeFlat: 'Fee: {fee}',
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
}
