import styled from "@emotion/styled"
import type { FC } from "react"

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
