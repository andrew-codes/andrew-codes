import { createContext } from "react"

export interface ClientStyleContextData {
  reset: () => void
}

const ctx = createContext<ClientStyleContextData>({
  reset: () => {},
})

export default ctx
