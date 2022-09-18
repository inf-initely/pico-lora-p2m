import { infer as Infer, nativeEnum, number, object } from 'zod'
import {
  Assertable,
  assertEnum,
  assertPrimitive,
  assertRange,
} from '../../validator.js'

export enum Header {
  /** Save parameters when power-down */
  persist = 0xc0,
  /** Don't save parameters when power-down. `DEFAULT` */
  temporary = 0xc2,
}

export module Speed {
  // prettier-ignore
  export enum Parity {
    AND       = 0b11000000,
    /** `DEFAULT` */
    '8N1'     = 0b00000000,
    '8O1'     = 0b01000000,
    '8E1'     = 0b10000000,
    '8N1_a'   = 0b11000000,
  }

  // prettier-ignore
  export enum BaudRate {
    AND       = 0b00111000,
    '1.2k'    = 0b00000000,
    '2.4k'    = 0b00001000,
    '4.8k'    = 0b00010000,
    /** `DEFAULT` */
    '9.6k'    = 0b00011000,
    '19.2k'   = 0b00100000,
    '38.4k'   = 0b00101000,
    '57.6k'   = 0b00110000,
    '115.2k'  = 0b00111000,
  }

  // prettier-ignore
  export enum AirRate {
    AND       = 0b00000111,
    '0.3k'    = 0b00000000,
    '1.2k'    = 0b00000001,
    /** `DEFAULT` */
    '2.4k'    = 0b00000010,
    '4.8k'    = 0b00000011,
    '9.6k'    = 0b00000100,
    '19.2k'   = 0b00000101,
    '19.2k_a' = 0b00000110,
    '19.2k_b' = 0b00000111,
  }
}

export module Option {
  // prettier-ignore
  export enum TransmissionMode {
    AND             = 0b10000000,
    /** `DEFAULT` */
    transparent     = 0b00000000,
    fixed           = 0b10000000,
  }

  // prettier-ignore
  export enum DriveMode {
    AND             = 0b01000000,
    open_collector  = 0b00000000,
    /** `DEFAULT` */
    push_pull       = 0b01000000,
  }

  // prettier-ignore
  export enum WakeTime {
    AND             = 0b00111000,
    /** `DEFAULT` */
    '250ms'         = 0b00000000,
    '500ms'         = 0b00001000,
    '750ms'         = 0b00010000,
    '1000ms'        = 0b00011000,
    '1250ms'        = 0b00100000,
    '1500ms'        = 0b00101000,
    '1750ms'        = 0b00110000,
    '2000ms'        = 0b00111000,
  }

  // prettier-ignore
  export enum FEC {
    AND             = 0b00000100,
    on              = 0b00000000,
    /** `DEFAULT` */
    off             = 0b00000100,
  }

  // prettier-ignore
  export enum TransmissionPower {
    AND             = 0b00000011,
    /** `DEFAULT` */
    '20dbm'         = 0b00000000,
    '17dbm'         = 0b00000001,
    '14dbm'         = 0b00000010,
    '10dbm'         = 0b00000011,
  }
}

// export const Config = object({
//   /**
//    * Whether the current configuration is saved when power down or not.
//    *
//    * Must be 0xC0 or 0xC2
//    *
//    * - `C0`: Save the parameters when power-down
//    * - `C2`: Do not save the parameters when power-down
//    */
//   header: nativeEnum(Header),

//   /** High address byte of the module. `0x00 ~ 0xff`. Default: `0x00` */
//   highAddress: number().min(0x00).max(0xff),

//   /** Low address byte of the module. `0x00 ~ 0xff`. Default: `0x00` */
//   lowAddress: number().min(0x00).max(0xff),

//   /**
//    * UART parity bit.
//    *
//    * UART mode can be different between communication parties
//    */
//   parityBit: nativeEnum(Speed.Parity),

//   /**
//    * UART baud rate can be different between communication parties.
//    *
//    * The UART baud rate has nothing to do with wireless transmission parameters
//    * & won’t affect the wireless transmit / receive features
//    */
//   baudRate: nativeEnum(Speed.BaudRate),

//   /**
//    * Air data rate.
//    *
//    * The lower the air data rate, the longer the transmitting distance, better
//    * anti-interference performance and longer transmitting time
//    *
//    * The air data rate must keep the same for both communication parties.
//    */
//   airRate: nativeEnum(Speed.AirRate),

//   /**
//    * Frequency channel
//    *
//    * Channel (862M + CHAN*1M), default 06H（868MHz）
//    *
//    * 00H-45H, correspond to 862~931MHz
//    */
//   channel: number().min(0x00).max(0x45),

//   /**
//    * This bit is used to the module internal pull-up resistor. It also increases
//    * the level’s adaptability in case of open drain. But in some cases, it may
//    * need external pull-up resistor.
//    */
//   driveMode: nativeEnum(Option.DriveMode),

//   /**
//    * The transmit & receive module work in mode 0, whose delay time is invalid &
//    * can be arbitrary value.
//    *
//    * The transmitter works in mode 1 can transmit the preamble code of the
//    * corresponding time continuously.
//    *
//    * When the receiver works in mode 2, the time means the monitor interval time
//    * (wireless wake-up). Only the data from transmitter that works in mode 1 can
//    * be received.
//    */
//   wakeUpTime: nativeEnum(Option.WakeTime),

//   /**
//    * After turn off FEC, the actual data transmission rate increases while
//    * anti-interference ability decreases. Also the transmission distance is
//    * relatively short.
//    *
//    * Both communication parties must keep on the same pages about turn-on or turn-off FEC.
//    */
//   FEC: nativeEnum(Option.FEC),

//   /**
//    * The external power must make sure the ability of current output more than
//    * 250mA and ensure the power supply ripple within 100mV.
//    *
//    * Low power transmission is not recommended due to its low power supply efficiency.
//    */
//   transmissionPower: nativeEnum(Option.TransmissionPower),

//   /**
//    * In fixed transmission mode, the first three bytes of each user's data frame
//    * can be used as high/low address and channel. The module changes its address
//    * and channel when transmit. And it will revert to original setting after
//    * complete the process.
//    */
//   transmissionMode: nativeEnum(Option.TransmissionMode),
// })
// export type Config = Infer<typeof Config>

export class Config implements Assertable {
  /*
   * Whether the current configuration is saved when power down or not.
   *
   * Must be 0xC0 or 0xC2
   *
   * - `C0`: Save the parameters when power-down
   * - `C2`: Do not save the parameters when power-down
   */
  header: Header

  /** High address byte of the module. `0x00 ~ 0xff`. Default: `0x00` */
  highAddress: number

  /** Low address byte of the module. `0x00 ~ 0xff`. Default: `0x00` */
  lowAddress: number

  /**
   * UART parity bit.
   *
   * UART mode can be different between communication parties
   */
  parityBit: Speed.Parity

  /**
   * UART baud rate can be different between communication parties.
   *
   * The UART baud rate has nothing to do with wireless transmission parameters
   * & won’t affect the wireless transmit / receive features
   */
  baudRate: Speed.BaudRate

  /**
   * Air data rate.
   *
   * The lower the air data rate, the longer the transmitting distance, better
   * anti-interference performance and longer transmitting time
   *
   * The air data rate must keep the same for both communication parties.
   */
  airRate: Speed.AirRate

  /**
   * Frequency channel
   *
   * Channel (862M + CHAN*1M), default 06H（868MHz）
   *
   * 00H-45H, correspond to 862~931MHz
   */
  channel: number

  /**
   * This bit is used to the module internal pull-up resistor. It also increases
   * the level’s adaptability in case of open drain. But in some cases, it may
   * need external pull-up resistor.
   */
  driveMode: Option.DriveMode

  /**
   * The transmit & receive module work in mode 0, whose delay time is invalid &
   * can be arbitrary value.
   *
   * The transmitter works in mode 1 can transmit the preamble code of the
   * corresponding time continuously.
   *
   * When the receiver works in mode 2, the time means the monitor interval time
   * (wireless wake-up). Only the data from transmitter that works in mode 1 can
   * be received.
   */
  wakeUpTime: Option.WakeTime
  /**
   * After turn off FEC, the actual data transmission rate increases while
   * anti-interference ability decreases. Also the transmission distance is
   * relatively short.
   *
   * Both communication parties must keep on the same pages about turn-on or
   * turn-off FEC.
   */
  FEC: Option.FEC

  /**
   * The external power must make sure the ability of current output more than
   * 250mA and ensure the power supply ripple within 100mV.
   *
   * Low power transmission is not recommended due to its low power supply
   * efficiency.
   */
  transmissionPower: Option.TransmissionPower

  /**
   * In fixed transmission mode, the first three bytes of each user's data frame
   * can be used as high/low address and channel. The module changes its address
   * and channel when transmit. And it will revert to original setting after
   * complete the process.
   */
  transmissionMode: Option.TransmissionMode

  assert() {
    assertRange(this.highAddress, 0xff)
    assertRange(this.lowAddress, 0xff)
    assertRange(this.channel, 0x45)
    assertEnum(this.header, Header)
    assertEnum(this.parityBit, Speed.Parity)
    assertEnum(this.baudRate, Speed.BaudRate)
    assertEnum(this.airRate, Speed.AirRate)
    assertEnum(this.driveMode, Option.DriveMode)
    assertEnum(this.wakeUpTime, Option.WakeTime)
    assertEnum(this.FEC, Option.FEC)
    assertEnum(this.transmissionPower, Option.TransmissionPower)
    assertEnum(this.transmissionMode, Option.TransmissionMode)
    return this
  }

  static from(raw: Uint8Array): Config {
    if (raw.byteLength !== 6)
      throw new TypeError(`Parameters didn't return exactly 6 bytes`)
    const [bHeader, highAddress, lowAddress, bSpeed, channel, bOption] =
      Array.from(raw) as BuildTuple<6, [], number>

    const config = {
      header: bHeader,
      parityBit: bSpeed & Speed.Parity.AND,
      airRate: bSpeed & Speed.AirRate.AND,
      baudRate: bSpeed & Speed.BaudRate.AND,
      highAddress,
      lowAddress,
      channel,
      transmissionMode: bOption & Option.TransmissionMode.AND,
      transmissionPower: bOption & Option.TransmissionPower.AND,
      wakeUpTime: bOption & Option.WakeTime.AND,
      FEC: bOption & Option.FEC.AND,
      driveMode: bOption & Option.DriveMode.AND,
    }

    return Object.assign(new Config(), config)
  }

  toReadableObject() {
    return {
      highAddress: this.highAddress.toString(16),
      lowAddress: this.lowAddress.toString(16),
      parityBit: Speed.Parity[this.parityBit],
      baudRate: Speed.BaudRate[this.baudRate],
      airRate: Speed.AirRate[this.airRate],
      channel: this.channel.toString(16),
      transmissionMode: Option.TransmissionMode[this.transmissionMode],
      transmissionPower: Option.TransmissionPower[this.transmissionPower],
      FEC: Option.FEC[this.FEC],
      header: Header[this.header],
      driveMode: Option.DriveMode[this.driveMode],
      wakeUpTime: Option.WakeTime[this.wakeUpTime],
    }
  }
}

export interface FixedAddress {
  highAddress: number
  lowAddress: number
  channel: number
}

export interface Version {
  version: number
  features: number
  model: 32
  header: 0xc3
}

export enum Mode {
  NORMAL,
  WAKE_UP,
  POWER_SAVING,
  SLEEP,
}
