/* global $ */

;(async () => {
  await $`npx shadcn add ${process.argv[3]}`
  await $`npx eslint --fix --ext .ts,.tsx ./src/components/ui`
})()
