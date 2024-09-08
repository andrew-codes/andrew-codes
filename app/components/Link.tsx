import styled from "@emotion/styled"
import { Link as RemixLink } from "@remix-run/react"

const StyledLink = styled(RemixLink)`
  text-decoration: underline !important;

  @media print {
    text-decoration: none !important;
  }
`

export default StyledLink
