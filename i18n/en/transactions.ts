import {
  TransactionCryptocurrency,
  TransactionMethod,
  TransactionNetwork,
  TransactionStatus,
  TransactionType,
} from '~/types/dashboard'

export default {
  button: {
    export: 'Export',
  },
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
  slideovers: {
    transaction: {
      to: 'to {destination}',
      topupAmount: 'Top up amount',
      amount: '{amount} USDT',
      rate: 'Rate',
      fee: 'Fee',
      rateValue: '{rateUSDT} USDT = {rateUSD} USD',
      feeValue: '{fee} USD',
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
