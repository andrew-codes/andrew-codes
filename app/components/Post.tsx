import type { FC } from "react"
import styled from "styled-components"
import StyledLink from "./Link"

const Link: FC<{ href: string }> = ({ href, ...props }) => (
  <StyledLink to={href} {...props} />
)

const H2 = styled.h2``
const H3 = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
`

const H4 = styled.h4``

const Table = styled.table`
  border-collapse: collapse;
  margin: 0 auto;
  width: 100%;

  thead tr {
    border-bottom: 1px solid black;
  }

  th {
    font-variant: all-small-caps;
    padding: 0 1rem;
  }

 th, td {
    padding: 0.25rem 0;
    &:first-child {
      padding-left: 2rem;
    }
    &:last-child {
      padding-right: 2rem;
    }
  }
`

const Paragraph = styled.p``
const Blockquote = styled.blockquote`
  color: rgb(80, 80, 80);
  background-color: rgb(218, 218, 218);
  position: relative;
  margin: 0 0 1.125rem 0;
  padding: 0.5rem 0.5rem 0.5rem 2.5rem;
  /* padding: 1.5rem 0 1.5rem 2.5rem; */

  p:last-child {
    margin-bottom: 0 !important;
  }

  &::before {
    content: "";
    left: 0rem;
    position: absolute;
    top: 0rem;
    bottom: 0rem;
    width: 0.375rem;
    background: rgb(167, 167, 167);
  }
`

const Posts = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
`

export { Blockquote, H2, H3, H4, Link, Paragraph, Posts, Table }
