export interface ILoginForm {
  email?: string
  username?: string
  password: string
  isRemember: boolean
}

export interface IRegisterForm {
  email?: string
  username?: string
  password: string
  confirmPassword: string
  referralCode?: string
}
export interface IRegisterRequestParams {
  email: string
  username: string
  password: string
  referralCode?: string
}

export interface ILoginRequestParams {
  credential: string
  password: string
}

export interface ILoginResponseData {
  accessToken: string
  accessTokenExpiresAt: string
  refreshToken: string
  refreshTokenExpiresAt: string
}

export enum AuthType {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
}

export enum TokenType {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  VERIFY_EMAIL_TOKEN = 'VERIFY_EMAIL_TOKEN',
  FORGOT_PASSWORD_TOKEN = 'FORGOT_PASSWORD_TOKEN',
}
