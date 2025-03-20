import type { Dayjs } from 'dayjs'
import { CommonCountry, CommonCurrency, PanelTab } from '~/types/common'
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

export const formatMoney = (amount: number | undefined, currency?: string) => {
  if (!amount) return 0
  return (
    Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
    (currency ? ` ${currency}` : '')
  )
}

export const formatMoneyWithoutDecimals = (amount: number | undefined, currency?: string) => {
  if (!amount) return 0.00
  return new Intl.NumberFormat('en-US').format(amount) + (currency ? ` ${currency}` : '')
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

export const formatYYYYMMDD = (input: Dayjs) => {
  if (!input) return ''
  return input.format('YYYY/MM/DD')
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

export const formatMMYYYY = (input: Dayjs) => {
  if (!input) return ''
  return input.format('MM/YYYY')
}

export const shortenAddress = (address: string, front = 4, back = 4) => {
  if (typeof address !== 'string' || !address) return ''
  if (address.length <= front + back) return address
  return address.slice(0, front) + '...' + address.slice(-back)
}

export const shortenString = (address: string, front = 20, back = 10) => {
  if (typeof address !== 'string' || !address) return ''
  if (address.length <= front + back) return address
  return address.slice(0, front) + '...'
}

export const getTabRoute = (tab: PanelTab) => {
  switch (tab) {
    case PanelTab.CARD_LIST:
      return '/cards'
    case PanelTab.DASHBOARD:
      return '/'
    case PanelTab.CONTACT_SUPPORT:
      return '/support'
    case PanelTab.HELP:
      return '/help'
    case PanelTab.SETTINGS:
      return '/settings'
    case PanelTab.TRANSACTIONS:
      return '/transactions'
    default:
      return '/'
  }
}

export const normalize = (val: string) => {
  return val.toLocaleLowerCase()
}

export const getCountryCode = (country: CommonCountry) => {
  switch (country) {
    case CommonCountry.INDONESIA:
      return '+62'
    case CommonCountry.MYANMAR:
      return '+95'
    case CommonCountry.THAILAND:
      return '+66'
    case CommonCountry.VIETNAM:
      return '+84'
    case CommonCountry.MALAYSIA:
      return '+60'
    case CommonCountry.PHILIPPINES:
      return '+63'
    case CommonCountry.LAOS:
      return '+856'
    case CommonCountry.CAMBODIA:
      return '+855'
    case CommonCountry.EAST_TIMOR:
      return '+670'
    case CommonCountry.BRUNEI:
      return '+673'
    case CommonCountry.SINGAPORE:
      return '+65'
    default:
      return ''
  }
}

export enum ToastType {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export function showToast(type: ToastType, title: string) {
  const toast = useToast()
  toast.clear()
  toast.add({
    title: title,
    avatar: { src: type === ToastType.SUCCESS ? '/icons/common/toast-success.svg' :  '/icons/common/toast-failed.svg'},
    timeout: 5000,
  })
}
