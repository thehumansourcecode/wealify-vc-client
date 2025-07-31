import { CommonCountry } from '~/types/common'
import { countryCodeOptions } from './constants'

export function getCountryFlag(countryCode: CommonCountry) {
  return countryCodeOptions.find(option => option.code === countryCode)?.image
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
    case CommonCountry.RUSSIA:
      return '+7'
    default:
      return ''
  }
}
