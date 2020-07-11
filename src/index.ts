import axios from 'axios'

import type { RequestArgs, ClientOptions, Client } from './types'

import logger from './logger'

const client = (options: ClientOptions): Client => {
  const singletonClient = axios.create({
    baseURL: options.uri,
    headers: {
      common: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    },
  })

  const request = async (args: RequestArgs): Promise<unknown> => {
    const { auth, data, headers, method, path, querystring, token } = args
    const log = logger('request')

    const config = {
      method,
      url: path,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
      ...(['POST', 'PUT', 'PATCH'].includes(method) && data && { data }),
      ...(querystring && { params: querystring }),
      ...(auth && { auth }),
    }

    log.debug('full config', config)
    log.info('calling', method, path)

    if (auth) log.debug('with basic auth', auth)
    if (querystring) log.debug('querystring', querystring)
    if (data) log.debug('with data', data)

    try {
      const response = await singletonClient(config)
      log.info('response status', response.status)
      log.debug('response data', response.data)

      return response.data
    } catch (error) {
      log.error('error', error.message)
      if (error.response) log.error('error context', error.response?.data)
      throw error
    }
  }

  return {
    request,
  }
}

export default client
