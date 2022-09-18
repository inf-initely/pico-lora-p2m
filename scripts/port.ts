import { SerialPort } from 'serialport'

export async function findPort(portOrQuery: string) {
  const ports = await SerialPort.list()

  if (portOrQuery.startsWith('@')) {
    const query = portOrQuery.substring(1).toLowerCase()
    const [vid, pid] = query.split(':')
    return (
      ports.find(
        (port) =>
          port.vendorId?.toLowerCase() === vid &&
          (pid == null || port.productId === pid)
      ) ?? null
    )
  }

  return ports.find((port) => port.path === portOrQuery) ?? null
}

export function interceptHandler(
  interceptor: Record<number, () => void>,
  serial: SerialPort
) {
  return (data: Buffer) => {
    const callback = interceptor[data[0]]
    if (callback) return void callback()
    else {
      serial.write(data, 'utf-8', (e) => {
        // console.log(e, serial.port)
        // throw e
      })
    }
  }
}
