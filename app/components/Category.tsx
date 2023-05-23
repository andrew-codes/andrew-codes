import styled from "styled-components"
import type { Category } from "~/libs/categories"
import { getBackgroundGradient } from "~/libs/categories"

const Header = styled.header<{ category: Category }>`
  background: ${({ category }) => getBackgroundGradient(category)};
  color: rgb(255, 255, 255);
`

export { Header }
