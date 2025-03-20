import type { LoginCredentials, LoginResponse } from '~/types/auth'
import { BaseService } from './base.service'
import type { CardCategory, ICardData, IGetCardListParams, IIssueCardParams } from '~/types/cards'
import type { ICommonListResponse, ICommonResponse } from '~/types/common'

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

  async getCategoryList(): Promise<ICommonListResponse<CardCategory>> {
    return this.get('/dropdown/categories')
  }

  async getCardList(payload: IGetCardListParams): Promise<ICommonListResponse<ICardData>> {
    return this.get('/dropdown/cards', {
      params: payload,
    })
  }

  async issueCard(params: IIssueCardParams): Promise<ICommonResponse<any>> {
    return this.post('/card', {
      ...params,
    })
  }
}

export const commonService = new CommonService()
