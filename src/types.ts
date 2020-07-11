export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ClientOptions {
  uri: string
  headers?: Record<string, string>
}

export interface RequestArgs {
  method: Method
  path: string
  data?: Record<string, any>
  querystring?: Record<string, any>
  token?: string
  headers?: Record<string, string>
  auth?: {
    username: string
    password: string
  }
}

export interface Client {
  request: (args: RequestArgs) => Promise<unknown>
}
