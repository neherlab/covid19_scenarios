import { AlgorithmResult } from '../../algorithms/types/Result.types'

interface MessageData {
  result: AlgorithmResult
  error: String
}

export async function run(...args) {
  return new Promise<AlgorithmResult>((resolve, reject) => {
    const worker = new Worker('./worker.ts', { type: 'module' })

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
      reject(`Worker error: ${error.name} : ${error.message}`)
      console.error('Worker error:', error)
    })

    worker.postMessage(args)
  })
}
