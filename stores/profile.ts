import { defineStore } from 'pinia'
import { CommonLogger } from '~/common/logger'
import { ProfileService } from '~/services/profile.service'
import type { ProfileData } from '~/types/profile'
export const useProfileStore = defineStore('profile', {
  state: (): { data: { id?: string; email?: string } | undefined } => ({
    data: undefined,
  }),
  actions: {
    setProfile(profile: ProfileData) {
      this.data = profile
    },
    async fetchProfile() {
      try {
        const response = await ProfileService.instance.getProfile()
        if (response.code === 200) {
          this.setProfile(response.data)
          return true
        }
        return false
      } catch (error) {
        CommonLogger.instance.error('Fetch profile failed:', error)
        this.resetProfile()
        return false
      }
    },
    resetProfile() {
      this.$reset()
    },
  },
  getters: {
    profile: state => state.data,
  },
})
