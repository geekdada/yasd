/* global $ */

;(async () => {
  await $`pnpm exec shadcn add ${process.argv.slice(3)}`
  await $`vp lint ./src/components/ui --fix`
})().catch((error) => {
  console.error(error)
  process.exit(1)
})
