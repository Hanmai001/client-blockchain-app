export const parseEnum = (
  enumInput: any,
  getType: 'KEYS' | 'VALUES' = 'KEYS'
) => {
  const arr = Object.keys(enumInput)
  if (getType === 'KEYS') return arr.slice(arr.length / 2, arr.length)
  if (getType === 'VALUES') return arr.slice(0, arr.length / 2)
  throw Error('INVALID')
}
