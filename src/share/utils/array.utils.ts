export class ArrayUtils {
  static replaceItemAtIndex(arr: any[], index: number, newValue: any) {
    return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)]
  }

  static removeItemAtIndex(arr: any[], index: number) {
    return [...arr.slice(0, index), ...arr.slice(index + 1)]
  }

  static getLastItems(arr: any[], limit: number) {
    if (arr.length <= limit) return arr
    return [...arr].slice(arr.length - limit, arr.length)
  }

  static findLastIndex<T>(
    array: Array<T>,
    predicate: (value: T, index: number, obj: T[]) => boolean
  ): number {
    let l = array.length
    while (l--) {
      if (predicate(array[l], l, array)) return l
    }
    return -1
  }

  static findMaxValue(array: any[], fieldName: string) {
    return Math.max.apply(
      Math,
      array.map(function (o) {
        return o[fieldName]
      })
    )
  }

  static shuffle(array: any[]) {
    let currentIndex = array.length,
      randomIndex

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--

      // And swap it with the current element.
      ;[array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ]
    }

    return array
  }

  static search(array: any[], key: string, input: string) {
    var re = new RegExp(input + '.+$', 'i')
    const res = (array = array.filter(function (e, i, a) {
      return e[key].search(re) != -1
    }))

    return res
  }

  static calReverseIndex(params: {
    total: number
    offset: number
    limit: number
  }) {
    const total = params.total
    const limit = params.limit > total ? total : params.limit
    let fromIndex = total - params.offset - limit
    let toIndex = fromIndex + limit - 1
    if (params.offset + params.limit >= total) {
      fromIndex = 0
      toIndex = total - params.offset - 1
    }
    return {
      fromIndex,
      toIndex,
      isValid: toIndex >= 0,
    }
  }

  static generateArray(configs: {
    total: number
    limit?: number
    startAt?: number
    page?: number
  }) {
    let arr = Array(configs.total)
      .fill(null)
      .map((_, i) => i + (configs.startAt || 0))
      .reverse()
    if (!!configs.limit && !!configs.page) {
      const indexOfLast = configs.page * configs.limit
      const indexOfFirst = indexOfLast - configs.limit

      return arr.slice(indexOfFirst, indexOfLast)
    }
    if (!!configs.limit) arr = arr.slice(0, configs.limit)

    return arr
  }
}
