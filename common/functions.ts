import type { Dayjs } from 'dayjs'
import { CommonCurrency } from '~/types/common'
import { ItemExterior, ItemQuality } from '~/types/market'

export const trimNumber = (input: number, precision: number) => {
  return input.toPrecision(precision)
}

export const floorNumber = (input: number, toFixed: number) => {
  return Math.floor(input * 10 ** toFixed) / 10 ** toFixed
}

export const roundNumber = (input: number | undefined, toFixed: number) => {
  if (!input) return undefined
  return Math.round(input * 10 ** toFixed) / 10 ** toFixed
}

export const ceilNumber = (input: number, toFixed: number) => {
  return Math.ceil(input * 10 ** toFixed) / 10 ** toFixed
}

export const formatMoney = (amount: number, currency?: string) => {
  return (
    Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
    (currency ? ` ${currency}` : '')
  )
}

export const formatSmallNumber = (input: number) => {
  if (input <= 0) return 0
  if (input > 1e-4) return +input
  const exp = -Math.floor(Math.log10(input))
  const dec = Math.round(input * 10 ** (exp + 3))
  return [exp - 1, dec]
}

export const formatLargeNumber = (input: number) => {
  if (input > 1e9) return roundNumber(input / 1e9, 3) + 'B'
  if (input > 1e6) return roundNumber(input / 1e6, 3) + 'M'
  if (input > 1e3) return roundNumber(input / 1e3, 3) + 'K'
  return roundNumber(input, 3) + ''
}

export const formatDDMMYYYY = (input: Dayjs) => {
  if (!input) return ''
  return input.format('DD/MM/YYYY')
}

export const formatDDMMYYYYHHMM = (input: Dayjs) => {
  if (!input) return ''
  return input.format('DD/MM/YYYY HH:mm')
}

export const formatYYYYMMDDhmmA = (input: Dayjs) => {
  if (!input) return ''
  return input.format('YYYY/MM/DD | h:mm A')
}

export const shortenAddress = (address: string, front = 4, back = 4) => {
  if (typeof address !== 'string' || !address) return ''
  if (address.length <= front + back) return address
  return address.slice(0, front) + '...' + address.slice(-back)
}
