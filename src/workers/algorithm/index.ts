import { AlgorithmResult } from '../../algorithms/types/Result.types'

export async function run(...args) {
  return new Promise<AlgorithmResult>((resolve, reject) => {
    const worker = new Worker('./worker.ts', { type: 'module' })

    worker.addEventListener('message', (message: MessageEvent) => {
      const { result: AlgorithmResult, error: String } = message.data

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
