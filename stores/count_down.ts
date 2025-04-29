import { defineStore } from 'pinia'
import { useCookie } from '#app'

export const useCountDownStore = defineStore('countDown', () => {
  const cookieSeconds = useCookie<number>('countdown-seconds', { default: () => 0 })
  const cookieStartTime = useCookie<number>('countdown-start-at', { default: () => 0 })

  const totalSeconds = ref(0)
  let interval: ReturnType<typeof setInterval> | null = null

  function getRemainingSeconds(): number {
    const now = Math.floor(Date.now() / 1000)
    const elapsed = now - (cookieStartTime.value || 0)
    const remaining = (cookieSeconds.value || 0) - elapsed
    return Math.max(remaining, 0)
  }

  function start(seconds: number) {
    cookieSeconds.value = seconds
    cookieStartTime.value = Math.floor(Date.now() / 1000)
    totalSeconds.value = seconds
    runInterval()
  }

  function resume() {
    const remaining = getRemainingSeconds()
    if (remaining > 0) {
      totalSeconds.value = remaining
      runInterval()
    } else {
      stop()
    }
  }

  function runInterval() {
    if (interval) clearInterval(interval)
    interval = setInterval(() => {
      if (totalSeconds.value > 0) {
        totalSeconds.value--
      } else {
        stop()
      }
    }, 1000)
  }

  function stop() {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
    cookieSeconds.value = 0
    cookieStartTime.value = 0
  }

  return {
    totalSeconds,
    start,
    resume,
    stop,
  }
})