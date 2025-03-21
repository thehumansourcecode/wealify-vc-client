export interface ProfileData {
  id: string
  email: string
  phone_number: string
  full_name: string
}

export interface ProfileResponse {
  code: number
  data: ProfileData
}
