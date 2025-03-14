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
        [TransactionMethod.USDT]: 'USDT',
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
  slideovers: {
    transaction: {
      to: 'to {destination}',
      topupAmount: 'Top up amount',
      amount: 'USDT {amount}',
      rate: 'Rate',
      fee: 'Fee',
      rateValue: 'USDT {rateUSDT} = USD {rateUSD}',
      feeValue: 'USD {fee}',
      account: 'Top up account',
      address: 'Received address',
      txhash: 'TxHash',
      id: 'Top up ID',
      createdAt: 'Created at',
      successAt: 'Success at',
      newTopup: 'Create new top up',
      contact:
        'If you find any errors or omissions in this statement, please contact Wealify’s customer service emailing at ',
      label: {
        [TransactionType.PAYMENT]: 'Wallet Payment',
        [TransactionType.TOPUP]: 'Wallet Top up',
        [TransactionType.WITHDRAW]: 'Wallet Withdraw',
      },
    },
  },
}
