export function createPromise(
  promise: Promise<any>[],
  processCallback?: (percent: number) => any
) {
  let count = 0
  if (processCallback) processCallback(0)
  for (const p of promise) {
    p.then(() => {
      count++
      if (processCallback) processCallback((count * 100) / promise.length)
    })
  }
  return Promise.all(promise)
}
