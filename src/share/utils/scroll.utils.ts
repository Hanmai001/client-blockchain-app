export const listenerElScroll = (configs: {
  id: string
  onIn: (e: HTMLElement) => any
  onOut: (e: HTMLElement) => any
  offsetTop?: number
}) => {
  let isInSection: any = null
  const {id, onIn, onOut} = configs
  const element = document.getElementById(id)
  const start = element!.offsetTop + (configs.offsetTop || 0)
  const stop =
    element!.offsetTop + element!.offsetHeight + (configs.offsetTop || 0)

  if (!element) throw Error('Cannot find element')

  const listner = function () {
    const st = window.pageYOffset || document.documentElement.scrollTop
    const newCheck = st >= start && st <= stop
    if (newCheck && isInSection !== true) onIn(element!)
    if (!newCheck && isInSection !== false) onOut(element!)
    isInSection = newCheck
  }

  window.addEventListener('scroll', listner)
  return listner
}

export const removeListenerElScroll = (listner: any) => {
  try {
    window.removeEventListener('scroll', listner)
  } catch (error) {}
}
