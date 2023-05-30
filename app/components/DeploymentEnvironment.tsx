import { createContext, useContext } from "react"

const ctx = createContext<null | string>("")

const Provider = ctx.Provider
const useDeploymentUrlPrefix = () => useContext(ctx)

export { Provider, useDeploymentUrlPrefix }
