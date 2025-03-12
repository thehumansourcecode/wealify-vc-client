import type { ILoginRequestParams, ILoginResponseData, IRegisterRequestParams } from '~/types/auth'
import { BaseService } from './base.service'
import type { ICommonResponse } from '~/types/common'

export class AuthService extends BaseService {
  private static _instance: AuthService

  public static get instance(): AuthService {
    if (!AuthService._instance) {
      AuthService._instance = new AuthService()
    }
    return AuthService._instance
  }

  constructor() {
    const config = useRuntimeConfig()
    super(config.public.baseUrl + '/auth')
  }

  async login(payload: ILoginRequestParams): Promise<ICommonResponse<ILoginResponseData>> {
    console.log('[LOGIN DEBUG]', payload)
    const response = await this.post('/login', payload)
    return response
  }

  async register(payload: IRegisterRequestParams): Promise<ICommonResponse<any>> {
    console.log('[REGISTER DEBUG]', payload)
    const response = await this.post('/register', payload)
    return response
  }

  async verifyEmail(payload: any): Promise<ICommonResponse<any>> {
    const response = await this.post('/verify-email', payload)
    return response
  }
}

export const authService = new AuthService()
