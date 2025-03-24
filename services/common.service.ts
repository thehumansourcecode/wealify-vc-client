import type { LoginCredentials, LoginResponse } from '~/types/auth'
import { BaseService } from './base.service'
import type { CardCategory, ICardData, IGetDropdownCardListParams, IIssueCardParams } from '~/types/cards'
import type { ICommonListResponse, ICommonResponse, IDropdownCardData } from '~/types/common'
import type { TransactionCategory } from '~/types/transactions'

export class CommonService extends BaseService {
  private static _instance: CommonService

  public static get instance(): CommonService {
    if (!CommonService._instance) {
      CommonService._instance = new CommonService()
    }
    return CommonService._instance
  }

  constructor() {
    const config = useRuntimeConfig()
    super(config.public.baseUrl)
  }

  async getDropdownCategoryList(): Promise<ICommonListResponse<CardCategory>> {
    return this.get('/dropdown/categories')
  }

  async getDropdownCardList(payload: IGetDropdownCardListParams): Promise<ICommonListResponse<IDropdownCardData>> {
    return this.get('/dropdown/cards', {
      params: payload,
    })
  }

  async getDropdownTransactionCategoryList(): Promise<ICommonListResponse<TransactionCategory>> {
    return this.get('/dropdown/categories')
  }

  async issueCard(params: IIssueCardParams): Promise<ICommonResponse<any>> {
    return this.post('/card', {
      ...params,
    })
  }
}

export const commonService = new CommonService()
