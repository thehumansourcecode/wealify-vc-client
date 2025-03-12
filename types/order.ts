export enum OrderStatus {
  SUCCESS = 'SUCCESS',
  PENDING_BUYER = 'PENDING_BUYER',
  PENDING_SELLER = 'PENDING_SELLER',
  CANCELLED_BUYER = 'CANCELLED_BUYER',
  CANCELLED_SELLER = 'CANCELLED_SELLER',
}

export interface IProductDetail {
  commodityId: number
  commodityHashName: string
  commodityTemplateId: number
  abrade: string
  actions: string
  iconUrl: string
  sellerSteamId: string
  createOrderTime: number
  finishOrderTime: number | null
}
export interface IOrder {
  cancelOrderTime: number
  createdBy: string | null
  updatedBy: string | null
  userId: string
  finalAmount: number
  finalAmountUsd: number
  commodityId: string
  tradeUrl: string
  orderNo: string
  depositAmount: number
  createdAt: string
  updatedAt: string
  confirmOfferEndTime: number
  createOrderTime: number
  cs2AgentStatus: string
  delayedTransferEndTime: number | null
  finishOrderTime: number
  orderStatus: string
  payEndTime: number
  paySuccessTime: number
  pendingEndTime: number | null
  productDetail: IProductDetail
  sendOfferEndTime: number
  sendOfferSuccessTime: number
  isRefunded: boolean
  refundAmount: number
  refundAmountUsd: number
  presenterSteamId: string
  presenterTradeLinks: string
  receiveOfferSteamId: string
  id: string
}
