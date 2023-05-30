import { Link as RemixLink } from "@remix-run/react"
import type { RemixLinkProps } from "@remix-run/react/dist/components"
import type { FC } from "react"
import styled from "styled-components"
import { useDeploymentUrlPrefix } from "./DeploymentEnvironment"

const StyledLink = styled(RemixLink)`
  text-decoration: underline !important;

  @media print {
    text-decoration: none !important;
  }
`

const Link: FC<RemixLinkProps & React.RefAttributes<HTMLAnchorElement>> = ({
  to,
  ...props
}) => {
  const linkPrefix = useDeploymentUrlPrefix()

  return <StyledLink {...props} to={`${linkPrefix}${to}`} />
}

export default Link
