import jsurl from 'jsurl'

export function encode(obj: Record<string, unknown>): string {
  return jsurl.stringify(obj)
}

export function decode(str: string) {
  return jsurl.parse(str) as Record<string, unknown>
}

export default { encode, decode }
