export async function run(...args) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js', { type: 'module' })
    worker.addEventListener('message', (message) => {
      const { result, error } = message.data

      if (result) {
        resolve(result)
        return
      }

      if (error) {
        reject(error)
      }
    })

    worker.addEventListener('error', (error) => console.error('Worker error:', error))

    worker.postMessage(args)
  })
}
