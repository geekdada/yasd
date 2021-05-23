const envs = {
  REACT_APP_SHOW_AD: 'REACT_APP_SHOW_AD',
  REACT_APP_HASH_ROUTER: 'REACT_APP_HASH_ROUTER',
}

await (async () => {
  const { argv } = process
  const target = argv[3]
  const validTargets = ['release-vercel', 'release-ci', 'surge']

  if (!validTargets.includes(target)) {
    throw new Error('Invalid build target.')
  }

  switch (target) {
    case 'release-vercel':
      process.env.NODE_ENV = 'production'
      await $`craco build`

      break

    case 'release-ci':
      process.env.NODE_ENV = 'production'
      process.env.REACT_APP_SHOW_AD = 'true'
      process.env.REACT_APP_HASH_ROUTER = 'true'
      await $`craco build`

      break

    case 'surge':
      process.env.NODE_ENV = 'production'
      process.env.REACT_APP_HASH_ROUTER = 'true'
      process.env.REACT_APP_RUN_IN_SURGE = 'true'
      await $`craco build`

      break
  }
})()
