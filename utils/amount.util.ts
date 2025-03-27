interface FormatOptions {
  decimals?: number
  decimalSeparator?: string
  thousandSeparator?: string
}

export function formatAmount(amount: number, options: FormatOptions = {}): string {
  if (!amount) return ''
  const { decimals = undefined, decimalSeparator = '.', thousandSeparator = ',' } = options

  // Handle rounding if decimals is specified
  const formattedAmount = decimals !== undefined ? amount.toFixed(decimals) : amount.toString()

  const parts = formattedAmount.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)

  return parts.join(decimalSeparator)
}
