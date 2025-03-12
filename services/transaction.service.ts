import type { IDepositForm, IDepositParams, IDepositResponseData, ITransactionData, IUpdateUserProfileParams, IUserProfileData, IWithdrawParams, IWithdrawResponseData } from '~/types/user'
import { BaseService } from './base.service'
import type { ICommonListResponse, ICommonResponse } from '~/types/common'

export class TransactionService extends BaseService {
  private static _instance: TransactionService

  public static get instance(): TransactionService {
    if (!TransactionService._instance) {
      TransactionService._instance = new TransactionService()
    }
    return TransactionService._instance
  }

  constructor() {
    const config = useRuntimeConfig()
    super(config.public.baseUrl + '/transactions')
  }

  async deposit(payload: IDepositForm): Promise<ICommonResponse<IDepositResponseData>> {
    console.log('[DEPOSIT DEBUG]', payload)
    const response = await this.post('/deposit', payload)
    return response
  }

  async withdraw(payload: IDepositForm): Promise<ICommonResponse<IWithdrawResponseData>> {
    console.log('[DEPOSIT DEBUG]', payload)
    const response = await this.post('/withdraw', payload)
    return response
  }

  async getTransactionHistory(payload: any): Promise<ICommonListResponse<ITransactionData>> {
    const response = await this.get('/', {
      params: payload,
    })
    return response
  }
}

export const transactionService = new TransactionService()
