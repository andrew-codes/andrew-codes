import styled from "@emotion/styled"
import { styled as muiStyled } from "@mui/joy/styles"
import type { FC, HTMLProps, ReactNode } from "react"
import { Children } from "react"
import SmallContentDivider from "./SmallContentDivider"

type WrappedStyledComponent<Props = {}> = FC<
  {
    as?: string | React.ComponentType<any>
    children: ReactNode | ReactNode[]
  } & Props
>

const ContactCardStyled = styled.header``
const ContactCard: WrappedStyledComponent = ({ as, children }) => (
  <ContactCardStyled as={as} className="vcard">
    {children}
  </ContactCardStyled>
)

const FullNameStyled = muiStyled("h1")({
  fontWeight: 600,
  lineHeight: "2rem",
})
const FullName: WrappedStyledComponent = ({ as, children, sx }) => (
  <FullNameStyled as={as} className="fn" sx={sx}>
    {children}
  </FullNameStyled>
)

const JobTitleStyled = styled.span`
  @media print {
    line-height: 1.375rem;
  }
`
const JobTitle: WrappedStyledComponent = ({ as, children }) => (
  <JobTitleStyled as={as} className="title">
    {children}
  </JobTitleStyled>
)

const ContactInformationStyled = styled.div``

const ContactInformation: WrappedStyledComponent = ({ as, children }) => (
  <ContactInformationStyled as={as}>{children}</ContactInformationStyled>
)

const AddressStyled = styled.address``
const Address: WrappedStyledComponent = ({ as, children }) => (
  <AddressStyled as={as} className="address">
    {children}
  </AddressStyled>
)

const Abbr = styled.abbr``
const Text = styled.span``
const Locality: WrappedStyledComponent = ({ as, children }) => (
  <Text as={as} className="locality">
    {children}
  </Text>
)
const Region: WrappedStyledComponent<{ title: string }> = ({
  as,
  children,
  title,
}) => (
  <Abbr as={as} className="region" title={title}>
    {children}
  </Abbr>
)

const Link = styled.a``
const Email: WrappedStyledComponent<HTMLProps<HTMLAnchorElement>> = ({
  as,
  children,
  ...props
}) => (
  <Link as={as} className="email" {...props}>
    {children}
  </Link>
)
const Telephone: WrappedStyledComponent<HTMLProps<HTMLAnchorElement>> = ({
  as,
  children,
  ...props
}) => (
  <Link as={as} className="tel" {...props}>
    {children}
  </Link>
)
const Url: WrappedStyledComponent<HTMLProps<HTMLAnchorElement>> = ({
  as,
  children,
  ...props
}) => (
  <Link as={as} className="url" {...props}>
    {children}
  </Link>
)

const NotesStyled = styled.div``
const Notes: WrappedStyledComponent = ({ as, children }) => (
  <NotesStyled as={as} className="note">
    {children}
  </NotesStyled>
)

const ConnectionOrderedList = styled.ol`
  padding: 0;
  margin: 0;
  display: block;

  @media print {
    line-height: 15px;
  }
`
const ConnectionListItem = styled.li`
  padding: 0;
  margin: 0;
  display: inline;
`

const ConnectionList: WrappedStyledComponent = ({ children }) => (
  <ConnectionOrderedList>
    <ConnectionListItem>
      {Children.map(children, (child, index) => {
        if (index === 0) {
          return child
        }

        return (
          <>
            <SmallContentDivider />
            {child}
          </>
        )
      })}
    </ConnectionListItem>
  </ConnectionOrderedList>
)

export {
  Address,
  ConnectionList,
  ContactCard,
  ContactInformation,
  Email,
  FullName,
  JobTitle,
  Locality,
  Notes,
  Region,
  Telephone,
  Url,
}
