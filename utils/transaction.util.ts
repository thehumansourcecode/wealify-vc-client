import { TransactionVCStatus } from '~/types/transactions'

export function getStatusColor(status: TransactionVCStatus) {
  if (status === TransactionVCStatus.FAILURE) {
    return '#ED2C38'
  }
  if (status === TransactionVCStatus.SUCCESS) {
    return '#2EA518'
  }
  if (status === TransactionVCStatus.PROCESSING) {
    return '#02076F'
  }
}
