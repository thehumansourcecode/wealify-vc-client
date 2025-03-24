import { TransactionStatus } from '~/types/transactions'

export function getStatusColor(status: TransactionStatus) {
  if (status === TransactionStatus.CANCELLED || status == TransactionStatus.REJECTED) {
    return '#ED2C38'
  }
  if (status === TransactionStatus.APPROVED) {
    return '#2EA518'
  }
  if (
    status === TransactionStatus.PENDING ||
    status == TransactionStatus.PROCESS ||
    status == TransactionStatus.WAITING
  ) {
    return '#02076F'
  }
}
