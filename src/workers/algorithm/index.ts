import { AlgorithmResult } from '../../algorithms/types/Result.types'
import { MessageData } from './worker.types'

import { RunParams } from '../../algorithms/run'

let runImpl = async (args: RunParams): Promise<AlgorithmResult> => {
  return Promise.reject(new Error('Web workers are not supported'))
}

if (typeof Worker !== 'undefined') {
  const worker = new Worker('./worker.ts', { type: 'module', name: 'algorithm' })

  runImpl = async (args: RunParams) => {
    return new Promise<AlgorithmResult>((resolve, reject) => {
      worker.addEventListener('message', (message: MessageEvent) => {
        const { result, error }: MessageData = message.data as { result: AlgorithmResult; error: string }

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
}

export async function run(args: RunParams) {
  return runImpl(args)
}
