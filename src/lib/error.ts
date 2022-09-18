export class TimeoutError extends Error {
  constructor(timeout: number, context?: string) {
    super(
      `Response timeout after ${timeout}ms` +
        (context != null && context != '' ? `: ${context}` : '')
    )
  }
}

export class IllegalOperationError extends Error {
  constructor(operation: string) {
    super(`Illegal: ${operation}`)
  }
}
