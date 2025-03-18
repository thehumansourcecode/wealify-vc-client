import { defineStore } from 'pinia'
import type { ProfileData } from '~/types/profile'
export const useProfileStore = defineStore('profile', {
  state: (): { data: { id?: string; email?: string } | undefined } => ({
    data: undefined,
  }),
  actions: {
    setProfile(profile: ProfileData) {
      this.data = {
        id: profile.id,
        email: profile.email,
      }
    },
    async fetchProfile() {
      this.setProfile({
        id: '0',
        email: 'test@gmail.com',
      })
    },
    resetProfile() {
      this.$reset()
    },
  },
  getters: {
    profile: state => state.data,
  },
})
