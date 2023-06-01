import { Link as RemixLink } from "@remix-run/react"
import type { FC } from "react"
import styled from "styled-components"

const StyledLink = styled(RemixLink)`
  text-decoration: underline !important;

  @media print {
    text-decoration: none !important;
  }
`

export default StyledLink
