export const formatNumber = (
  value: number
): {value: number; suffix: string} => {
  if (value < 1000) return {value, suffix: ''}

  const formatter = Intl.NumberFormat('en', {notation: 'compact'})

  return {
    value: +formatter.format(value).slice(0, -1),
    suffix: formatter.format(value).slice(-1),
  }
}
