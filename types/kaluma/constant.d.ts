// import type { Opaque } from 'type-fest'
declare type Opaque<Type, Token = unknown> = import('type-fest').Opaque<
  Type,
  Token
>

declare namespace PinState {
  type Type<T extends number> = Opaque<T, 'pinState'>

  type LOW = Type<0>
  type HIGH = Type<1>

  type All = LOW | HIGH
}

declare namespace PinMode {
  type Type<T extends number> = Opaque<T, 'pinMode'>

  type INPUT = Type<0>
  type OUTPUT = Type<1>
  type INPUT_PULLUP = Type<2>
  type INPUT_PULLDOWN = Type<3>

  type All = INPUT | OUTPUT | INPUT_PULLUP | INPUT_PULLDOWN
}

declare namespace SignalEvent {
  type Type<T extends number> = Opaque<T, 'signalEvent'>

  type LOW_LEVEL = Type<1>
  type HIGH_LEVEL = Type<2>
  type FALLING = Type<4>
  type RISING = Type<8>
  type CHANGE = Type<12>

  type All = LOW_LEVEL | HIGH_LEVEL | FALLING | RISING | CHANGE
}

// state
declare const LOW: PinState.LOW
declare const HIGH: PinState.HIGH

// pin mode
declare const INPUT: PinMode.INPUT
declare const OUTPUT: PinMode.OUTPUT
declare const INPUT_PULLUP: PinMode.INPUT_PULLUP
declare const INPUT_PULLDOWN: PinMode.INPUT_PULLDOWN

// signal event
declare const LOW_LEVEL: SignalEvent.LOW_LEVEL
declare const HIGH_LEVEL: SignalEvent.HIGH_LEVEL
declare const FALLING: SignalEvent.FALLING
declare const RISING: SignalEvent.RISING
declare const CHANGE: SignalEvent.CHANGE

declare type Data = Uint8Array | string
