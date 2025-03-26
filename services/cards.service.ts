import type { LoginCredentials, LoginResponse } from '~/types/auth'
import { BaseService } from './base.service'
import type {
  CardCategory,
  ICardDetail,
  IEditCardParams,
  IGetCardListParams,
  IIssueCardParams,
  ITopupCardParams,
} from '~/types/cards'
import type { ICommonListResponse, ICommonResponse } from '~/types/common'

export class CardService extends BaseService {
  private static _instance: CardService

  public static get instance(): CardService {
    if (!CardService._instance) {
      CardService._instance = new CardService()
    }
    return CardService._instance
  }

  constructor() {
    const config = useRuntimeConfig()
    super(config.public.baseUrl + '/cards')
  }

  async getCardList(payload: IGetCardListParams): Promise<ICommonListResponse<ICardDetail>> {
    return this.get('/', {
      params: payload,
    })
  }
  async getCardDetailById(id: string): Promise<ICommonResponse<ICardDetail>> {
    return this.get(`/${id}`)
  }

  async issueCard(params: IIssueCardParams): Promise<ICommonResponse<any>> {
    return this.post('/issue', {
      ...params,
    })
  }

  async editCard(params: IEditCardParams, id: string): Promise<ICommonResponse<any>> {
    return this.put(`/${id}`, {
      ...params,
    })
  }

  async freezeCard(id: string): Promise<ICommonResponse<any>> {
    return this.put(`/${id}/freeze`)
  }

  async cancelCard(id: string): Promise<ICommonResponse<any>> {
    return this.put(`/${id}/cancel`)
  }

  async unfreezeCard(id: string): Promise<ICommonResponse<any>> {
    return this.put(`/${id}/unfreeze`)
  }

  async topup(params: ITopupCardParams): Promise<ICommonResponse<any>> {
    return this.post(`${params.id}/top-up`, {
      amount: params.amount,
    })
  }
}

export const cardService = new CardService()
