declare type ModuleName = Opaque<string, 'BuiltinModuleName'>

export interface Process {
  /** The system architecture which the Kaluma firmware is compiled. */
  arch: 'cortext-m0-plus'

  /** The OS system which the Kaluma firmware is running. */
  platform: 'rp2'

  /** Version number, semver format */
  version: `v${number}.${number}.${number}${`-${any}` | ''}`

  /** There's no need to use require before using the built-in module. */
  builtin_modules: ModuleName[]

  /** Load the builtin module and return the module as a function */
  getBuiltinModule(builtin_module_name: ModuleName): (...args: any[]) => any

  /**
   * Load a native module
   *
   * Has properties : binding has native module names as properties
   */
  binding(native_module_name: ModuleName): (...args: any[]) => any

  /** Returns an object describing memory usage. */
  memoryUsage(): { heapTotal: number; heapUsed: number; heapPeak: number }

  /**
   * - `<`[`Stream`](/docs/api/stream/#class-stream)`>`
   *
   * Returns a stream object connected to standard input.
   *
   * ```javascript
   * // reads 100 bytes from standard in
   * let size = 0
   * while (size < 100) {
   *   let chunk = process.stdin.read()
   *   if (chunk) {
   *     let s = String.fromCharCode.apply(null, chunk)
   *     console.log('data = ', s)
   *     size += chunk.length
   *   }
   * }
   * ```
   */
  stdin: import('stream').Stream

  /**
   * - `<`[`Stream`](/docs/api/stream/#class-stream)`>`
   *
   * Returns a stream object connected to standard output.
   *
   * ```javascript
   * let data = new Uint8Array([65, 66, 67, 68, 69]) // "ABCDE"
   * process.stdout.write(data)
   * ```
   */
  stdout: import('stream').Stream
}

/** - The `process` object provide the information about the process. */
declare const process: Process
