import * as React from "react"

export interface ClientStyleContextData {
  reset: () => void
}

const ctx = React.createContext<ClientStyleContextData>({
  reset: () => {},
})

export default ctx
