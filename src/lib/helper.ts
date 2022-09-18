export function formatByte(data: Uint8Array) {
  return Array.from(data)
    .map((v) => v.toString(16).padStart(2, '0'))
    .join(' ')
}

export function int2u8(i: number) {
  if (i === 0) return Uint8Array.of(0)
  const array = [
    (i & 0xff000000) >> 24,
    (i & 0x00ff0000) >> 16,
    (i & 0x0000ff00) >> 8,
    (i & 0x000000ff) >> 0,
  ]
  const start = array.findIndex((n) => n !== 0)
  return Uint8Array.of(...array.slice(start))
}

export function u82int(arr: Uint8Array) {
  if (arr.byteLength > 4)
    throw new Error('Integer cannot contain more than 32 bytes')
  let n = 0
  for (const byte of arr.values()) n = (n << 8) | byte
  return n
}

export function randomNumber(max: number): number
export function randomNumber(min: number, max: number): number
export function randomNumber(...args: [number] | [number, number]) {
  const isSingle = args.length === 1

  const min = isSingle ? 0 : args[0]
  const max = isSingle ? args[0] : args[1]
  return Math.floor(Math.random() * (max - min + 1) + min)
}
