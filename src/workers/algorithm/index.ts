import { AlgorithmResult } from '../../algorithms/types/Result.types'
import { MessageData } from './worker.types'

import { RunParams } from '../../algorithms/run'

const worker = new Worker('./worker.ts', { type: 'module', name: 'algorithm' })

export async function run(args: RunParams) {
  return new Promise<AlgorithmResult>((resolve, reject) => {
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
    })

    worker.postMessage(args)
  })
}
