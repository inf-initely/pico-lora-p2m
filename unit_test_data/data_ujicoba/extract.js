import { readdir, readFile, writeFile } from 'fs/promises';
import { basename, join, relative } from 'path'
import { fileURLToPath } from 'url'
import { trim } from 'lodash-es'

const dirname = fileURLToPath(new URL('.', import.meta.url))

async function getAllFiles() {
  const root = await readdir(dirname, { withFileTypes: true })
  const dirs = root
    .filter(dirent => dirent.isDirectory())
    .map(dirent => new Promise(async (res, rej) => {
      const files = await readdir(join(dirname, dirent.name))
      res({ dirname: dirent.name, files })
    }))
  
  const dirsWithFiles = await Promise.all(dirs)
  return dirsWithFiles
    .map(dir => dir.files.map(filename => join(dirname, dir.dirname, filename)))
    .flat()
    .filter(file => file.endsWith('.json') == false)
}

async function readLog(path) {
  const file = await readFile(path, { encoding: 'utf-8' })
  const regex = /(?:\[([\w \d]+)\] \[(\d+)\] ([^:]+): ([^\r\n]*))|(?:total: (\d+), occupied: (\d+), peak: (\d+))/
  const lines = file.split('\r\n')
    .map(string => regex.exec(string))
    .filter(v => v != null)
    .map(arr => {
      // console.log(arr)
      if(arr[5] != null && arr[6] != '') return ({
        type: 'memory',
        ms: -1,
        context: {
          total: arr[5],
          occupied: arr[6],
          peak: arr[7]
        }
      })

      return ({
        type: 'log',
        ms: arr[2],
        context: {
          from:  arr[1],
          message: arr[3],
          data: arr[4]
        }
      })
    })

  // const jsonPath = path.replace(/\.txt$/, '.json')
  // await writeFile(jsonPath, JSON.stringify(lines))
  return lines
}

let time = Date.now()
console.log('Starting data processing...')
const filenames = await getAllFiles()
await Promise.all(filenames.map(filename => new Promise(async (res, rej) => {
  const output = await readLog(filename)
  console.log('Done parsing:', relative('./', filename))
  const jsonPath = filename.replace(/\.txt$/, '.json')
  
  // await writeFile(jsonPath, JSON.stringify(output))
})))
console.log(`Finished data processing in.`)
