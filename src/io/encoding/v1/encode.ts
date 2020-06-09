import jsurl from 'jsurl'

export function encode(obj: object): string {
  return jsurl.stringify(obj)
}

export function decode(str: string): object {
  return jsurl.parse(str)
}

export default { encode, decode }
