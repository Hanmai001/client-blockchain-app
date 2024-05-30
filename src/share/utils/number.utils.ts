export class NumberUtils {
  static isNumber(plain: any) {
    return !isNaN(plain)
  }

  static isCoordinates(plain: any) {
    return (
      /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,15}/g.test(plain) ||
      /^-?(([-+]?)([\d]{1,3})((\.)(\d+))?)/g.test(plain)
    )
  }

  static toCurrency(num: number, suffix: string = 'đ') {
    if (typeof num !== 'number' || Number.isNaN(num)) return '--'
    let output = new Intl.NumberFormat('en-GB').format(num)
    if (suffix) output = `${output}${suffix}`
    return output
  }

  static roundNumber(num: number, scale: number) {
    if (!('' + num).includes('e')) {
      return +(Math.round(+(num + 'e+' + scale)) + 'e-' + scale)
    } else {
      var arr = ('' + num).split('e')
      var sig = ''
      if (+arr[1] + scale > 0) {
        sig = '+'
      }
      return +(
        Math.round(+(+arr[0] + 'e' + sig + (+arr[1] + scale))) +
        'e-' +
        scale
      )
    }
  }

  static round(num: number, fractionDigits = 2) {
    return +`${num.toFixed(fractionDigits)}`
  }

  static bytesToSize(bytes: number) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes == 0) return '0 Byte'
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)) as any)
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
  }

  static randomInt(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  static isEven(n: number) {
    return n % 2 == 0
  }

  static isOdd(n: number) {
    return Math.abs(n % 2) == 1
  }

  static calcPercentChange(newValue: number, oldValue: number) {
    if (oldValue === 0) return 0;
    
    const percent = ((newValue - oldValue) / oldValue) * 100;
    return parseFloat(percent.toFixed(2));
  }
}
