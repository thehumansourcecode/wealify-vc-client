import type { Dayjs } from 'dayjs'
import { CommonCurrency } from '~/types/common'
import { ItemExterior, ItemQuality } from '~/types/market'

export function mapCurrencyToSymbol(currency: CommonCurrency): string {
  switch (currency) {
    case CommonCurrency.USD:
      return '$'
    case CommonCurrency.VND:
      return 'đ'
    case CommonCurrency.RMB:
      return '¥'
  }
}

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

export const formatLargeMoney = (currency: CommonCurrency, input: number) => {
  const symbol = mapCurrencyToSymbol(currency)
  return currency === CommonCurrency.VND
    ? input.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + symbol
    : symbol + input.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
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

export const getExteriorColor = (exterior: ItemExterior) => {
  if (!exterior) return '#FFF'
  switch (exterior) {
    case ItemExterior.FACTORY_NEW:
      return '#397439'
    case ItemExterior.MINIMAL_WEAR:
      return '#488B48'
    case ItemExterior.FIELD_TESTED:
      return '#F1AD4D'
    case ItemExterior.WELL_WORN:
      return '#B7625F'
    case ItemExterior.BATTLE_SCARRED:
      return '#993A38'
    case ItemExterior.NOT_PAINTED:
      return '#33353b'
    default:
      return '#FFF'
  }
}

export const getQualityColor = (quality: ItemQuality) => {
  if (!quality) return '#FFF'
  switch (quality) {
    case ItemQuality.NORMAL:
      return '#b2b2b2'
    case ItemQuality.TOURNAMENT:
      return 'gold'
    case ItemQuality.STRANGE:
      return '#cf6a32'
    case ItemQuality.UNUSUAL:
      return '#8650ac'
    case ItemQuality.UNUSUAL_STRANGE:
      return '#8650ac'
    default:
      return '#FFF'
  }
}

export function fixAmount(event, amount: number) {
  const input = event.target.value
  if (!/^\d*$/.test(input) || Number(input) > amount) {
    // event.target.value = input.slice(0, -1) // Revert the last character
    event.target.value = amount
  }
}

export const formatDDMMYYYY = (input: Dayjs) => {
  if (!input) return ''
  return input.format('DD/MM/YYYY')
}

export const formatDDMMYYYYHHMM = (input: Dayjs) => {
  if (!input) return ''
  return input.format('DD/MM/YYYY HH:mm')
}
