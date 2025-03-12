export default defineNuxtPlugin(() => {
  return {
    provide: {
      authToken: () => {
        // Example: Retrieve token from localStorage
        return localStorage.getItem('accessToken')
      },
    },
  }
})
