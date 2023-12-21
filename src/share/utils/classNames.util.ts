export function ClassNames(obj: {[fieldName: string]: any}) {
  return Object.keys(obj)
    .reduce((output: string, fieldName: string) => {
      if (!!obj[fieldName]) output += ` ${fieldName}`
      return output
    }, '')
    .substring(1)
}
