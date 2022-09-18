import { EventEmitter } from 'events'

const Event = {
  'low-level': LOW_LEVEL,
  'high-level': HIGH_LEVEL,
  rising: RISING,
  falling: FALLING,
  change: CHANGE,
}

type EventName = keyof typeof Event

export class Pin extends EventEmitter {
  constructor(public pin: number) {
    super()
  }

  /** @see {@link pinMode} */
  setMode(mode: PinMode.All) {
    return pinMode(this.pin, mode)
  }

  /** @see {@link digitalRead} */
  digitalRead() {
    return digitalRead(this.pin)
  }

  /** @see {@link digitalWrite} */
  digitalWrite(value: PinState.All) {
    return digitalWrite(this.pin, value)
  }

  /** @see {@link digitalToggle} */
  digitalToggle() {
    return digitalToggle(this.pin)
  }

  /** @see {@link pulseRead} */
  pulseRead(...args: DropFirstElement<Parameters<typeof pulseRead>>) {
    return pulseRead(this.pin, ...args)
  }

  pulseWrite(...args: DropFirstElement<Parameters<typeof pulseWrite>>) {
    return pulseWrite(this.pin, ...args)
  }

  /** @see {@link analogRead} */
  analogRead() {
    return analogRead(this.pin)
  }

  /** @see {@link analogRead} */
  analogWrite(...args: DropFirstElement<Parameters<typeof analogWrite>>) {
    return analogWrite(this.pin, ...args)
  }

  /** @see {@link tone} */
  tone(...args: DropFirstElement<Parameters<typeof tone>>) {
    return tone(this.pin, ...args)
  }

  /** @see {@link noTone} */
  noTone() {
    return noTone(this.pin)
  }

  private emitters: Record<string, number> = {}
  static getEventName = (name: EventName, debounce?: number) => {
    return name + (debounce == null ? '' : `:${debounce}`)
  }

  private watch(eventName: EventName, debounce?: number) {
    const name = Pin.getEventName(eventName, debounce)
    if (this.emitters[name] != null) return
    const id = setWatch(
      (pin) => {
        super.emit(name)
      },
      this.pin,
      Event[eventName],
      debounce ?? 0
    )
    this.emitters[name] = id
  }

  private closeWatch(eventName: EventName, debounce?: number) {
    const name = Pin.getEventName(eventName, debounce)
    if (this.emitters[name] == null) return
    clearWatch(this.emitters[name]!)
    delete this.emitters[name]
  }

  override addListener(
    eventName: EventName,
    listener: () => void,
    debounce?: number
  ) {
    const name = Pin.getEventName(eventName, debounce)
    if (this.emitters[name] == null) {
      this.watch(eventName, debounce)
    }

    // store.listeners.add(listener)
    super.addListener(name, listener)
  }

  override removeListener = (
    eventName: EventName,
    listener: () => void,
    debounce?: number
  ) => {
    const name = Pin.getEventName(eventName, debounce)
    super.removeListener(name, listener)

    if (super.listeners(name).length === 0) {
      this.closeWatch(eventName, debounce)
    }
  }

  override removeAllListeners(eventName: EventName, debounce?: number): void {
    const name = Pin.getEventName(eventName, debounce)
    this.closeWatch(eventName, debounce)
    super.removeAllListeners(name)
  }

  override on = this.addListener
  override off = this.removeListener

  override once = (
    eventName: EventName,
    listener: () => void,
    debounce?: number
  ) => {
    const name = Pin.getEventName(eventName, debounce)
    if (this.emitters[name] == null) {
      this.watch(eventName, debounce)
    }

    const $listener = () => {
      if (
        this.listeners.length === 0 ||
        (this.listeners.length === 1 && this.listeners[0] === $listener)
      )
        this.closeWatch(eventName, debounce)

      listener()
    }

    super.once(name, $listener)
  }
}
