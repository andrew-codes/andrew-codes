import { createContext, useContext } from "react"

const ctx = createContext<string>("")

const Provider = ctx.Provider
const useDeploymentUrlPrefix = () => useContext(ctx)

export { Provider, useDeploymentUrlPrefix }
