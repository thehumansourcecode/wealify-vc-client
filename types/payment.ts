import { HTTP_STATUS_CODE } from './common'

export interface WalletInfoResponse {
  code: HTTP_STATUS_CODE
  data: WalletData
  message: string
  success: boolean
}

interface NetworkAddresses {
  SOL: string
  TRX: string
  ETH: string
}

interface WalletData {
  network: string[]
  token: string[]
  address: NetworkAddresses
}