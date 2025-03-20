import type { LoginCredentials, LoginResponse } from '~/types/auth'
import { BaseService } from './base.service'
import type { CardCategory, ICardData, IGetCardListParams, IIssueCardParams } from '~/types/cards'
import type { ICommonListResponse } from '~/types/common'

export class CardsService extends BaseService {
  private static _instance: CardsService

  public static get instance(): CardsService {
    if (!CardsService._instance) {
      CardsService._instance = new CardsService()
    }
    return CardsService._instance
  }

  constructor() {
    const config = useRuntimeConfig()
    super(config.public.baseUrl + '/auth')
  }
}

export const cardsService = new CardsService()
