/* global $ */

import fs from 'fs-extra'
import { join } from 'path'
import get from 'lodash-es/get.js'

await (async () => {
  const baseline = await fs.readJson(
    join(__dirname, '../src/i18n/en/translation.json'),
  )
  const keys = walkKeys([], '', baseline)
  const langs = ['zh']

  for (const lang of langs) {
    const json = await fs.readJson(
      join(__dirname, `../src/i18n/${lang}/translation.json`),
    )

    for (const key of keys) {
      if (!get(json, key)) {
        throw new Error(`Cannot find '${key}' for translation '${lang}'.`)
      }
    }
  }

  console.info('🌎 Translation files are good to go!')
})()

function walkKeys(arr, currKey, obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      walkKeys(arr, currKey + key + '.', obj[key])
    } else {
      arr.push(currKey + key)
    }
  }

  return arr
}
