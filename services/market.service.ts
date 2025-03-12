import type { IUpdateUserProfileParams, IUpdateUserReferralCodeParams, IUserProfileData } from '~/types/user'
import { BaseService } from './base.service'
import type { ICommonListResponse, ICommonResponse, IExchangeRateData } from '~/types/common'
import type {
  ICheckoutParams,
  IDopplerItemData,
  IGetItemListParams,
  IGetPreviewItemListParams,
  IPreviewItemData,
} from '~/types/market'
import type {
  IDiscountCodeData,
  IItemData,
  IItemGeneralDetail,
  IItemGeneralDetailResponse,
  IItemGiftPriceData,
  ISteamUserData,
} from '~/types/item'

export class MarketService extends BaseService {
  private static _instance: MarketService

  public static get instance(): MarketService {
    if (!MarketService._instance) {
      MarketService._instance = new MarketService()
    }
    return MarketService._instance
  }

  constructor() {
    const config = useRuntimeConfig()
    super(config.public.baseUrl)
  }

  async getDopplerItemList(): Promise<ICommonListResponse<IDopplerItemData>> {
    const response = await this.get('/public/items/doppler', {})
    return response
  }

  async getPreviewItemList(params: IGetPreviewItemListParams): Promise<ICommonListResponse<IPreviewItemData>> {
    const response = await this.get('/items/preview/list', {
      params: params,
    })
    return response
  }

  async getItemListById(params: IGetItemListParams): Promise<ICommonResponse<IItemData[]>> {
    const response = await this.get('/w/items/list-by-id', {
      params: params,
    })
    return response
  }

  async getItemDetailById(id: number): Promise<ICommonResponse<IItemGeneralDetailResponse>> {
    const response = await this.get(`/w/items/preview/${id}`)
    return response
  }

  async verifyTradeUrl(tradeUrl: string): Promise<ICommonResponse<ISteamUserData>> {
    const response = await this.post('/orders/verify-trade-url', {
      tradeUrl: tradeUrl,
    })
    return response
  }

  async verifyDiscountCode(code: string): Promise<ICommonResponse<IDiscountCodeData>> {
    const response = await this.post('/coupons/check', {
      code: code,
    })
    return response
  }

  async getGiftingPrice(commodityId: number): Promise<ICommonResponse<IItemGiftPriceData>> {
    const response = await this.post('/orders/get-gifting-price', {
      commodityId: commodityId,
    })
    return response
  }

  async getExchangeRates(): Promise<ICommonResponse<IExchangeRateData[]>> {
    const response = await this.get(`/admin/rates`)
    return response
  }

  async checkout(payload: ICheckoutParams): Promise<ICommonResponse<any>> {
    const response = await this.post('/orders/checkout', payload)
    return response
  }
}

export const marketService = new MarketService()
