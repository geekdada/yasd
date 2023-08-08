/* global $ */

;(async () => {
  await $`npx shadcn-ui add ${process.argv[3]}`
  await $`npx eslint --fix --ext .ts,.tsx ./src/components/ui`
})()
