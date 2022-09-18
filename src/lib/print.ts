type LogType = 'log' | 'warn' | 'info' | 'error'

interface Context {
  prefixes: any[]
  suffixes: any[]
}

export function print(condition: () => boolean) {
  return function (this: Partial<Context>, ...args: any[]) {
    if (condition() == false) return
    const { prefixes = [], suffixes = [] } = this ?? {}
    console.log(...prefixes, ...args, ...suffixes)
  }
}

export module Base {
  // @ts-expect-error
  export const log = print(() => globalThis['ALLOW_PRINT_LOG'])
  // @ts-expect-error
  export const warn = print(() => globalThis['ALLOW_PRINT_WARN'])
  // @ts-expect-error
  export const info = print(() => globalThis['ALLOW_PRINT_INFO'])
  // @ts-expect-error
  export const error = print(() => globalThis['ALLOW_PRINT_ERROR'])
}

function createPrint(context: Record<LogType, Partial<Context>>) {
  return {
    log: Base.log.bind(context.log),
    warn: Base.warn.bind(context.warn),
    info: Base.info.bind(context.info),
    error: Base.error.bind(context.error),
  }
}

// export const Print = createPrint({})
// const lnSuffix = { suffixes: ['\n'] }
// export const Println = {
//   ...createPrint(lnSuffix),
//   prefix: (...args: any[]) => createPrint({ prefixes: args, ...lnSuffix }),
// }

const createRecord = (prefixes: any[] = [], suffixes: any[] = []) => ({
  log: { suffixes: [...suffixes], prefixes: [`[LOG]`, ...prefixes] },
  warn: { suffixes: [...suffixes], prefixes: [`[WRN]`, ...prefixes] },
  info: { suffixes: [...suffixes], prefixes: [`[INF]`, ...prefixes] },
  error: { suffixes: [...suffixes], prefixes: [`[ERR]`, ...prefixes] },
})
export const Print = {
  ...createPrint(createRecord()),
  prefix: (...prefixes: any[]) => createPrint(createRecord(prefixes)),
}

//   export const log = Base.log.bind(ctxRecord.log)
//   export const warn = Base.warn.bind(ctxRecord.warn)
//   export const info = Base.info.bind(ctxRecord.info)
//   export const error = Base.error.bind(ctxRecord.error)

//   export const prefix = (...prefixes: any[]) => ({
//     log: (...args: any[]) => log(...prefixes),
//   })
// }
