import Button from "@mui/joy/Button"
import Card from "@mui/joy/Card"
import CardContent from "@mui/joy/CardContent"
import Divider from "@mui/joy/Divider"
import Link from "@mui/joy/Link"
import Stack from "@mui/joy/Stack"
import Typography from "@mui/joy/Typography"
import { Link as RemixLink } from "react-router"
import { FC } from "react"
import { MdxPage } from "types"
import { tryFormatDate } from "../libs/utils"

const PostCard: FC<{ post: MdxPage }> = ({ post }) => {
  return (
    <Card
      key={post.slug}
      sx={(theme) => ({
        maxWidth: `calc(33% - ${theme.spacing(2)})`,
        display: "flex",
        flexDirection: "column",
        [theme.breakpoints.down("md")]: {
          maxWidth: `calc(50% - ${theme.spacing(2)})`,
        },
        [theme.breakpoints.down("sm")]: {
          maxWidth: `100%`,
        },
      })}
    >
      <CardContent sx={{ flex: 1 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography level="body-xs" sx={{ color: "neutral.500", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {post.frontmatter.category}
          </Typography>
          {post.frontmatter.date && (
            <Typography level="body-xs">
              <time>{tryFormatDate(post.frontmatter.date)}</time>
            </Typography>
          )}
        </Stack>
        <Link component={RemixLink} to={`/posts/${post.slug}`} sx={{ mt: 1, display: "block" }}>
          <Typography level="h3" fontSize="lg">
            {post.frontmatter.title}
          </Typography>
        </Link>
        <Typography level="body-md">{post.frontmatter.description}</Typography>
      </CardContent>
      <Divider />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          mx: "calc(-1 * var(--Card-padding))",
          my: "calc(-1 * var(--Card-padding))",
          px: "var(--Card-padding)",
          py: "var(--Card-padding)",
        }}
      >
        {post.readTime && (
          <Typography level="body-xs" sx={{ color: "neutral.500" }}>
            {post.readTime.text}
          </Typography>
        )}
        <Button component={RemixLink} to={`/posts/${post.slug}`} variant="plain" color="primary" size="sm" sx={{ ml: "auto", "&:hover": { backgroundColor: "rgba(201, 122, 88, 0.12)" } }}>
          Read more
        </Button>
      </Stack>
    </Card>
  )
}

export default PostCard
