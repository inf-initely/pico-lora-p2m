import type { ClassConstructor } from 'class-transformer'

export class AssertionError extends Error {}

export interface Assertable {
  assert(): void
}

/** Assert condition, will throw when condition is false */
export function assert(condition: boolean, message?: string) {
  if (condition == false)
    throw new AssertionError(message ?? 'Failed on assertion')
}

type ValueOf<T> = T[keyof T]

type EnumLike = {
  [k: string]: string | number
  [nu: number]: string
}

type AcceptedType =
  | 'string'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'symbol'
  | 'undefined'
  | 'object'
  | 'function'

export module assertPrimitive {
  type TypeAssertion<T> = (input: unknown) => asserts input is T
  type InstanceAssertion = <T>(
    input: unknown,
    instance: ClassConstructor<T>
  ) => asserts input is T

  const test = (expectedType: AcceptedType) => (input: any) =>
    assert(
      typeof input === expectedType,
      `Expecting ${input} to be of type ${expectedType}, instead got ${typeof input}`
    )

  export const string: TypeAssertion<string> = test('string')
  export const number: TypeAssertion<number> = test('number')
  export const bigint: TypeAssertion<bigint> = test('bigint')
  export const boolean: TypeAssertion<boolean> = test('boolean')
  export const symbol: TypeAssertion<symbol> = test('symbol')
  export const undefined: TypeAssertion<undefined> = test('undefined')
  export const object: TypeAssertion<object> = test('object')
  export const fn: TypeAssertion<Function> = test('function')
  export const instance: InstanceAssertion = (input, instance) =>
    assert(
      input instanceof instance,
      `Expected ${input} to be of instance ${instance}, instead got ${
        // @ts-ignore
        input.prototype ?? typeof input
      }`
    )
}

export function assertRange(input: any, max: number): void
export function assertRange(input: any, min: number, max: number): void
export function assertRange(input: any, ...args: [number, number?]) {
  const min = args.length === 1 ? 0 : args[0]
  const max = args.length === 1 ? args[0] : args[1]

  assertPrimitive.number(max)
  assertPrimitive.number(input)
  assert(
    input >= min && input <= max,
    `${input} is outside of range {${min}, ${max}}`
  )
}

export function assertEnum<T extends EnumLike>(
  input: any,
  enumDef: T
): asserts input is ValueOf<T> {
  assert(
    Object.values(enumDef).includes(input),
    `${input} is not inside possible enum values (${Object.values(enumDef).join(
      ', '
    )})`
  )
}
