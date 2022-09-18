import { program } from 'commander'
import { createWriteStream } from 'fs'
import { DateTime } from 'luxon'
import { SerialPort } from 'serialport'
import stripAnsi from 'strip-ansi'
import { findPort, interceptHandler } from './port.js'

program
  .version('0.0.1')
  .description('Script to run test unit')
  .argument('<log path>')
  .option('-p, --port <port>', 'Port to connect to', '@2e8a')
  .option('-n, --no-time', 'Should not print time?')

program.parse()
const opts = program.opts()
const args = program.args

async function main() {
  const { port: _port_ } = opts
  const port = await findPort(_port_)

  const serial = new SerialPort({
    autoOpen: true,
    baudRate: 115200,
    path: port?.path ?? 'COM3',
  })

  const log = createWriteStream(args[0], {
    encoding: 'utf-8',
    flags: 'as',
  })
  serial.on('data', (chunk) => {
    log.write(stripAnsi(chunk.toString()))
    process.stdout.write(chunk)
  })
  serial.write(`clock.adjust(${Date.now()})\r\n`, 'utf-8')
  const handler = interceptHandler({ 0x1a: () => process.exit() }, serial)
  process.stdin.setRawMode(true)
  process.stdin.on('data', handler)
}

main()
