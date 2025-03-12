import { BaseService } from './base.service'
import type { ICommonListResponse, ICommonResponse } from '~/types/common'
import type { IOrder } from '~/types/order'

export class OrderService extends BaseService {
  private static _instance: OrderService

  public static get instance(): OrderService {
    if (!OrderService._instance) {
      OrderService._instance = new OrderService()
    }
    return OrderService._instance
  }

  constructor() {
    const config = useRuntimeConfig()
    super(config.public.baseUrl + '/orders')
  }

  async getOrderHistory(payload: any): Promise<ICommonListResponse<IOrder>> {
    const response = await this.get('/', {
      params: payload,
    })
    return response
  }
}

export const orderService = new OrderService()
