import { FC } from "react"
import styled from "styled-components"

const SmallContentDividerRoot = styled.span`
  margin: 0 8px;

  @media print {
    margin: 0 2pt;
  }
`
const SmallContentDivider: FC<{}> = () => (
  <SmallContentDividerRoot>∙</SmallContentDividerRoot>
)

export default SmallContentDivider
