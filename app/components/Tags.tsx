import styled from "styled-components"
import Link from "./Link"
import SmallContentDivider from "./SmallContentDivider"

const Tag = styled(Link)`
  color: rgb(255, 255, 255);
  font-size: 0.75rem;
`

const TagList = styled.ul`
  display: block;
  margin: 0;
  padding: 0;
  > li {
    display: inline-block;
  }
`

const Tags: FC<{ tags: string[] }> = ({ tags }) => (
  <TagList>
    {tags.map((tag: string, index: number) =>
      index === 0 ? (
        <li key={tag}>
          <Tag to={`/tags/${tag}`}>{tag}</Tag>
        </li>
      ) : (
        <>
          <li key={`${tag}-divider`}>
            <SmallContentDivider />
          </li>
          <li key={tag}>
            <Tag to={`/tags/${tag}`}>{tag}</Tag>
          </li>
        </>
      ),
    )}
  </TagList>
)

export default Tags
