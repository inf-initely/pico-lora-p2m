interface KalumaStorage {
  /**
   * - `<number>`
   *
   * Returns the number of data items in the storage.
   *
   * ```javascript
   * storage.setItem('key1', 'value1')
   * storage.setItem('key2', 'value2')
   * console.log(storage.length) // 2
   * ```
   */
  length: number

  /**
   * - **`key`** `<string>`
   *
   * Return the value associated with the given key.
   *
   * ```javascript
   * storage.setItem('key1', 'value1')
   * var value1 = storage.getItem('key1')
   * var value2 = storage.getItem('key2') // null
   * console.log(value) // "value1"
   * ```
   */
  getItem(key: string): string | null

  /**
   * - `key` `<string>`
   * - `value` `<string>`
   *
   * Add the key with the value to the storage.
   *
   * ```javascript
   * storage.setItem('key1', 'value1')
   * var value1 = storage.getItem('key1') // "value1"
   * storage.setItem('key1', 'new value')
   * value1 = storage.getItem('key1') // "new value"
   * ```
   */
  setItem(key: string, value: string): void

  /**
   * - **`key`** `<string>`
   *
   * Remove the data item associated with the given key.
   *
   * ```javascript
   * storage.setItem('key1', 'value1')
   * storage.removeItem('key1')
   * var value1 = storage.getItem('key1') // null
   * ```
   */
  removeItem(key: string): void

  /**
   * Remove all the data items in the storage.
   *
   * ```javascript
   * storage.setItem('key1', 'value1')
   * storage.setItem('key2', 'value2')
   * storage.clear()
   * var value1 = storage.getItem('key1') // null
   * var value2 = storage.getItem('ket2') // null
   * ```
   */
  clear(): void

  /**
   * - **`index`** `<number>`
   * - **Returns:** `<string>`
   *
   * Returns the key string of the given index.
   *
   * ```javascript
   * storage.setItem('key1', 'value1')
   * storage.setItem('key2', 'value2')
   * console.log(storage.length) // 2
   * console.log(storage.key(0)) // "key1"
   * console.log(storage.key(1)) // "key2"
   * ```
   */
  key(index: number): string
}

declare global {
  /**
   * The `storage` object provide the functions for storing key-value items in
   * local persistent storage.
   *
   * @prettier-ignore > Please note that typically internal flash memory is used to store data
   * > items. As you know flash memory has finite number of write/erase cycles
   * > (less than tens of thousands), so please do not use this storage API for
   * > the jobs need frequently write/erase cycles.
   */
  const storage: KalumaStorage
}

export {}
