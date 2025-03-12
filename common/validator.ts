/* eslint-disable no-useless-escape */

import { CommonUSDTNetwork } from '~/types/common'

export const validator = {
  isURL: (url?: string): boolean => {
    if (!url) return false
    const regex = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-\.~:?#@!$&'()*+,;=\[\\\]\/%]*)*$/i
    return regex.test(url)
  },
  isDomain: (domain?: string): boolean => {
    if (!domain) return false
    const regex = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z]{2,})+$/
    return regex.test(domain)
  },
  isUsername: (username?: string): boolean => {
    if (!username) return false
    // Regular expression for valid username
    const regex = /^(?![_.])(?!.*[_.]{2})[A-Za-z0-9._]+(?<![._])$/
    return regex.test(username)
  },
  isEmail(email?: string): boolean {
    if (!email) return false
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return regex.test(email)
  },
  isPassword(password?: string): boolean {
    if (!password) return false
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return regex.test(password)
  },
  isSteamTradeUrl(url?: string): boolean {
    if (!url) return false
    const regex = /https?:\/\/steamcommunity.com\/tradeoffer\/new\/\?partner=(\d{1,10})&token=(.{8})$/
    return regex.test(url)
  },
  isExpireDate: (expireDate?: string): boolean => {
    if (!expireDate) return false
    const pattern = /^(0[1-9]|1[0-2])\/(\d{2})$/

    if (!pattern.test(expireDate)) {
      return false
    }

    // Extract month and year from the valid format
    const parts = expireDate.split('/')
    const month = parseInt(parts[0], 10)
    const year = parseInt(parts[1], 10)

    // Get the current date
    const now = new Date()
    const currentYear = now.getFullYear() % 100 // Get last two digits of current year
    const currentMonth = now.getMonth() + 1 // Months are zero-indexed in JavaScript

    // Validate the expiration date
    return year > currentYear || (year === currentYear && month >= currentMonth)
  },
  isDateOfBirth: (dateString?: string): boolean => {
    if (!dateString) return false
    // Define the regex pattern for DD/MM/YYYY
    const pattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/

    // Check if the dateString matches the pattern
    if (!pattern.test(dateString)) {
      return false
    }

    // Split the date string into components
    const parts = dateString.split('/')
    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10)
    const year = parseInt(parts[2], 10)

    // Create a Date object from the input
    const birthDate = new Date(year, month - 1, day) // Month is 0-indexed in JavaScript

    // Check if the date is valid
    if (birthDate.getFullYear() !== year || birthDate.getMonth() !== month - 1 || birthDate.getDate() !== day) {
      return false
    }

    // Get the current date
    const now = new Date()

    // Check if the birthDate is in the future
    return birthDate <= now
  },
  isEnum: (value: any, enumObj: object): boolean => {
    return Object.values(enumObj).includes(value)
  },
  isEmpty: (value: any): boolean => {
    // Check for undefined or null
    if (value == null) {
      // this checks both null and undefined
      return true
    }

    // Check for empty string
    if (typeof value === 'string') {
      return value.length === 0
    }

    // Check for empty array
    if (Array.isArray(value)) {
      return value.length === 0
    }

    // Check for empty object
    if (typeof value === 'object') {
      return Object.keys(value).length === 0
    }

    // Check for NaN
    if (typeof value === 'number' && isNaN(value)) {
      return true // Treat NaN as "empty"
    }

    // If none of the above conditions are met, it is not considered empty
    return false
  },
  isNumberString: (value?: string): boolean => {
    if (!value) return false
    // Check if the string is not empty and can be converted to a number
    return value.trim() !== '' && !isNaN(Number(value))
  },
  isTRC20Address: (value?: string): boolean => {
    if (!value) return false
    const regex = /T[A-Za-z1-9]{33}/
    return regex.test(value)
  },
  isBEP20Address: (value?: string): boolean => {
    if (!value) return false
    const regex = /^0x[a-fA-F0-9]{40}$/
    return regex.test(value)
  },
  isSOLAddress: (value?: string): boolean => {
    if (!value) return false
    const regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
    return regex.test(value)
  },
  isWildcardAddress: (network: CommonUSDTNetwork, value?: string): boolean => {
    if (!value) return false
    let regex
    if (network === CommonUSDTNetwork.TRC20) {
      regex = /T[A-Za-z1-9]{33}/
    }
    if (network === CommonUSDTNetwork.SOL) {
      regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
    }
    if (
      network === CommonUSDTNetwork.AVAXC ||
      network === CommonUSDTNetwork.BSC ||
      network === CommonUSDTNetwork.ERC20
    ) {
      regex = /^0x[a-fA-F0-9]{40}$/
    }
    if (!regex) return false
    return regex.test(value)
  },
  isOnlyValidLatinCharacters: (value?: string): boolean => {
    if (!value) return false
    const regex = /^[a-zA-Z0-9]{4,15}$/
    return regex.test(value)
  },
}
