export function readFile(file: File): Promise<string> {
  const reader = new FileReader()

  return new Promise((resolve, reject) => {
    reader.addEventListener('error', () => {
      reader.abort()
      reject(new Error(`Error: file "${file.name}" cannot be read.`))
    })

    reader.addEventListener('load', () => {
      resolve(reader.result as string) // HACK
    })

    reader.readAsText(file)
  })
}
