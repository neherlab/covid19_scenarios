import { AlgorithmResult } from '../../algorithms/types/Result.types'
import { MessageData } from './worker.types'

export async function run(...args) {
  return new Promise<AlgorithmResult>((resolve, reject) => {
    const worker = new Worker('./worker.polyfilled.ts', { type: 'module' })

    worker.addEventListener('message', (message: MessageEvent) => {
      const { result, error }: MessageData = message.data

      if (result) {
        resolve(result)
        return
      }

      if (error) {
        reject(error)
      }
    })

    worker.addEventListener('error', (error) => {
      reject(error)
      console.error('Worker error:', error)
    })

    worker.postMessage(args)
  })
}
