import { RequestHandler } from 'express'

type HttpMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH'

declare function allowMethods(methods: HttpMethod[], errorMessage?: string): RequestHandler

export default allowMethods
