import { Link as RemixLink } from "@remix-run/react"
import styled from "styled-components"

const Link = styled(RemixLink)`
  text-decoration: underline !important;

  @media print {
    text-decoration: none !important;
  }
`

export default Link
