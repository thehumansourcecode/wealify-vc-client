import { BaseService } from './base.service'
import type { ITransactionData, IGetTransactionListParams } from '~/types/transactions'
import type { ICommonListResponse } from '~/types/common'

export class TransactionsService extends BaseService {
  private static _instance: TransactionsService

  public static get instance(): TransactionsService {
    if (!TransactionsService._instance) {
      TransactionsService._instance = new TransactionsService()
    }
    return TransactionsService._instance
  }

  constructor() {
    const config = useRuntimeConfig()
    super(config.public.baseUrl + '/transactions')
  }

  async getTransactionList(payload: IGetTransactionListParams): Promise<ICommonListResponse<ITransactionData>> {
    return this.get('/', {
      params: payload,
    })
  }
}

export const cardsService = new TransactionsService()
