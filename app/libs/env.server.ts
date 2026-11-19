function getEnv() {
  return {
    FLY: process.env.FLY,
    NODE_ENV: process.env.NODE_ENV,
  }
}

type ENV = ReturnType<typeof getEnv>

// App puts these on
declare global {
  var ENV: ENV
  interface Window {
    ENV: ENV
  }
}

export { getEnv }
