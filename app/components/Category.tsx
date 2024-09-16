import styled from "@emotion/styled"
import { getBackgroundGradient } from "../libs/categories"
import type { Category } from "../types"

const Header = styled.header<{ category: Category | undefined | null }>`
  background: ${({ category }) => getBackgroundGradient(category)};
  color: ${({ category }) => (category ? `rgb(255, 255, 255)` : `rgb(0,0,0)`)};
`

export { Header }
