import MuiLink from "@mui/joy/Link"
import styled from "@mui/joy/styles/styled"
import Typography from "@mui/joy/Typography"
import { Link as RemixLink } from "@remix-run/react"
import { FC, PropsWithChildren } from "react"

const Link: FC<PropsWithChildren<{ href: string }>> = (props) => {
  return (
    <MuiLink {...props} component={RemixLink} color="primary" to={props.href}>
      {props.children}
    </MuiLink>
  )
}

const H2: FC<PropsWithChildren<{}>> = (props) => {
  return <Typography {...props} level="h2" fontSize="xl" fontWeight={700} />
}
const H3: FC<PropsWithChildren<{}>> = (props) => {
  return <Typography {...props} level="h3" fontSize="lg" fontWeight={700} />
}

const H4: FC<PropsWithChildren<{}>> = (props) => {
  return (
    <Typography
      {...props}
      level="h2"
      fontSize="xl"
      fontWeight={700}
      sx={{ marginBottom: 1 }}
    />
  )
}

const Table = styled("table")({
  borderCollapse: "collapse",
  margin: "0 auto",
  width: "100%",

  "& thead tr": {
    borderBottom: "1px solid black",
  },

  th: {
    fontVariant: "all-small-caps",
    padding: "0 1rem",
  },

  td: {
    padding: "0.25rem 0",
    "&:first-child": {
      paddingLeft: "2rem",
    },
    "&:last-child": {
      paddingRight: "2rem",
    },
  },
})

const Paragraph: FC<PropsWithChildren<{}>> = (props) => {
  return <Typography {...props} level="body-lg" sx={{ marginBottom: 3 }} />
}

const Blockquote2 = styled("blockquote")({
  color: "rgb(80, 80, 80)",
  backgroundColor: "rgb(218, 218, 218)",
  position: "relative",
  margin: "0 0 1.125rem 0",
  padding: "0.5rem 0.5rem 0.5rem 2.5rem",

  "p:last-child": {
    marginBottom: "0 !important",
  },

  "&::before": {
    content: '""',
    left: "0rem",
    position: "absolute",
    top: "0rem",
    bottom: "0rem",
    width: "0.375rem",
    background: "rgb(167, 167, 167)",
  },
})

const Blockquote: FC<PropsWithChildren<{}>> = (props) => {
  if (props.children.length > 1) {
    return (
      <blockquote>
        {props.children
          .filter((child) => typeof child !== "string")
          .map((child) => {
            return (
              <Typography
                {...child.props}
                level="body-md"
                sx={{ marginBottom: 3 }}
              >
                {child}
              </Typography>
            )
          })}
      </blockquote>
    )
  }

  return (
    <blockquote>
      <Typography {...props} level="body-md" sx={{ marginBottom: 3 }} />
    </blockquote>
  )
}

export { Blockquote, H2, H3, H4, Link, Paragraph, Table }
