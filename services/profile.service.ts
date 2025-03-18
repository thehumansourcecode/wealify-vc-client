import type {
  IBalanceHistory,
  IBalanceHistoryParams,
  IReferralEarning,
  IReferredUser,
  IUpdateUserProfileParams,
  IUpdateUserReferralCodeParams,
  IUserProfileData,
} from '~/types/profile'
import { BaseService } from './base.service'
import type { ICommonListResponse, ICommonResponse } from '~/types/common'

export class ProfileService extends BaseService {
  private static _instance: ProfileService

  public static get instance(): ProfileService {
    if (!ProfileService._instance) {
      ProfileService._instance = new ProfileService()
    }
    return ProfileService._instance
  }

  constructor() {
    const config = useRuntimeConfig()
    super(config.public.baseUrl + '/profile')
  }

  async getUserProfile(): Promise<ICommonResponse<IUserProfileData>> {
    const response = await this.get('/')
    return response
  }

  async updateProfile(payload: IUpdateUserProfileParams): Promise<ICommonResponse<any>> {
    console.log('[REGISTER DEBUG]', payload)
    const response = await this.put('/', payload)
    return response
  }

  async changePassword(): Promise<ICommonResponse<any>> {
    const response = await this.put('/change-password')
    return response
  }

  async getReferredUserList(): Promise<ICommonListResponse<IReferredUser>> {
    const response = await this.get('/referred-users')
    return response
  }

  async getEarnings(): Promise<ICommonResponse<IReferralEarning>> {
    const response = await this.post('/check-referral-bonus', {})
    return response
  }

  async updateReferralCode(payload: IUpdateUserReferralCodeParams): Promise<ICommonResponse<IUserProfileData>> {
    console.log('[UPDATE REFERRAL CODE DEBUG]', payload)
    const response = await this.put('/referral-code', payload)
    return response
  }

  async claimEarnings(): Promise<ICommonResponse<any>> {
    const response = await this.post('/claim-referral', {})
    return response
  }

  async getBalanceHistory(payload: IBalanceHistoryParams): Promise<ICommonListResponse<IBalanceHistory>> {
    const response = await this.get('/balance-change-logs', {
      params: payload,
    })
    return response
  }
}

export const profileService = new ProfileService()
