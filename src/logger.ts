import debug from 'debug'

const log = debug('json-http-client')

const logger = (context: string): { [key: string]: CallableFunction } => {
  const levels: Array<string> = ['debug', 'info', 'warn', 'error']

  return levels.reduce(
    (logs: { [key: string]: CallableFunction }, level: string) => {
      const extend = `${context} [${level.toUpperCase()}]`
      const binding = log.extend(extend)
      // TODO: unable to find how to type `console` else than with `any`
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      binding.log = (console as any)[level].bind(console)

      return { ...logs, [level]: binding }
    },
    {},
  )
}

export default logger
