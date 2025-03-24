import type { LoginCredentials, LoginResponse } from '~/types/auth'
import { BaseService } from './base.service'
import type { ICommonListResponse, ICommonResponse } from '~/types/common'
import type { IUserBalance, IUserProfile } from '~/types/user'

export class UserService extends BaseService {
  private static _instance: UserService

  public static get instance(): UserService {
    if (!UserService._instance) {
      UserService._instance = new UserService()
    }
    return UserService._instance
  }

  constructor() {
    const config = useRuntimeConfig()
    super(config.public.baseUrl + '/users')
  }

  async getProfile(): Promise<ICommonResponse<IUserProfile>> {
    return this.get('/profile')
  }

  async getBalance(): Promise<ICommonResponse<IUserBalance>> {
    return this.get('/balance')
  }
}

export const userService = new UserService()
