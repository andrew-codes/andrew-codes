import Card from "@mui/joy/Card"
import Chip from "@mui/joy/Chip"
import Link from "@mui/joy/Link"
import Typography from "@mui/joy/Typography"
import { Link as RemixLink } from "@remix-run/react"
import { FC } from "react"
import { MdxPage } from "types"

const PostCard: FC<{ post: MdxPage }> = ({ post }) => {
  return (
    <Card
      key={post.slug}
      sx={(theme) => ({
        maxWidth: `calc(33% - ${theme.spacing(2)})`,
        [theme.breakpoints.down("md")]: {
          maxWidth: `calc(50% - ${theme.spacing(2)})`,
        },
        [theme.breakpoints.down("sm")]: {
          maxWidth: `100%`,
        },
      })}
    >
      <Chip>{post.frontmatter.category}</Chip>
      {post.frontmatter.date && (
        <Typography level="body-xs">
          <time>{new Date(post.frontmatter?.date).toLocaleDateString()}</time>
        </Typography>
      )}
      <Link component={RemixLink} to={`/posts/${post.slug}`}>
        <Typography level="h3" fontSize="lg">
          {post.frontmatter.title}
        </Typography>
      </Link>
      <Typography level="body-md">{post.frontmatter.description}</Typography>
    </Card>
  )
}

export default PostCard
