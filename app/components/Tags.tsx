import styled from "@emotion/styled"
import Link from "@mui/joy/Link"
import { Link as RemixLink } from "@remix-run/react"
import type { FC } from "react"
import { Fragment } from "react"
import SmallContentDivider from "./SmallContentDivider"

const TagList = styled.ul`
  display: block;
  margin: 0;
  padding: 0;
  > li {
    display: inline-block;
  }
`

const Tags: FC<{ tags: string[] }> = ({ tags, ...props }) => (
  <TagList {...props}>
    {tags.map((tag: string, index: number) =>
      index === 0 ? (
        <li key={tag}>
          <Link component={RemixLink} to={`/tags/${tag}`}>
            {tag}
          </Link>
        </li>
      ) : (
        <Fragment key={tag}>
          <li key={`${tag}-divider`}>
            <SmallContentDivider />
          </li>
          <li key={tag}>
            <Link component={RemixLink} to={`/tags/${tag}`}>
              {tag}
            </Link>
          </li>
        </Fragment>
      ),
    )}
  </TagList>
)

export default Tags
