import MuiLink from "@mui/joy/Link"
import List from "@mui/joy/List"
import ListItem from "@mui/joy/ListItem"
import ListItemContent from "@mui/joy/ListItemContent"
import { useTheme } from "@mui/joy/styles"
import styled from "@mui/joy/styles/styled"
import Typography from "@mui/joy/Typography"
import { Link as RemixLink } from "@remix-run/react"
import { FC, PropsWithChildren } from "react"

const Link: FC<PropsWithChildren<{ href: string }>> = (props) => {
  return (
    <MuiLink {...props} component={RemixLink} to={props.href}>
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
  return (
    <Typography
      {...props}
      level="body-lg"
      sx={(theme) => ({ marginBottom: theme.spacing(3) })}
    />
  )
}

const StyledBlockquote = styled("blockquote")({
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
  },
})

const Blockquote: FC<
  PropsWithChildren<{ children: Array<{ props: Record<string, any> }> }>
> = (props) => {
  if (props.children.length > 1) {
    return (
      <StyledBlockquote
        sx={{
          backgroundColor: "background.level1",
          "&::before": {
            backgroundColor: "primary.plainColor",
          },
        }}
      >
        {props.children
          .filter((child) => typeof child !== "string")
          .map((child, index) => {
            return (
              <Typography
                key={index}
                {...child.props}
                level="body-md"
                sx={{ marginBottom: 3 }}
              />
            )
          })}
      </StyledBlockquote>
    )
  }

  return (
    <blockquote>
      <Typography {...props} level="body-md" sx={{ marginBottom: 3 }} />
    </blockquote>
  )
}

const Image: FC<PropsWithChildren<{ src: string; alt: string }>> = (props) => {
  const theme = useTheme()

  return (
    <img
      {...props}
      src={props.src}
      alt={props.alt}
      style={{
        maxWidth: "100%",
        height: "auto",
        margin: "0 auto",
        display: "block",
        borderRadius: theme.radius.md,
        border: "4px solid rgba(0, 0, 0,0.8)",
        boxShadow: "0 0 0.5rem rgba(0, 0, 0, 0.3)",
        marginBottom: theme.spacing(1),
      }}
    />
  )
}

const UnorderedList: FC<{}> = (props: any) => {
  console.debug("ul", props)
  return (
    <List
      marker={"disc"}
      sx={{ marginBottom: props.root ? 2 : 0, marginTop: props.root ? -2 : 0 }}
    >
      {props.children
        .filter((child) => typeof child !== "string")
        .map((child: any, index: number) => {
          return (
            <ListItem key={index} nested={child.type !== "li"} {...child.props}>
              {child.type === "li" && (
                <ListItemContent>
                  <Typography level="body-md">
                    {child.props.children}
                  </Typography>
                </ListItemContent>
              )}
              {child.type === "ul" && (
                <UnorderedList {...child.props.children.props} />
              )}
              {child.type === "ul" && (
                <OrderedList {...child.props.children.props} />
              )}
            </ListItem>
          )
        })}
    </List>
  )
}
const OrderedList: FC<{}> = (props: any) => {
  return (
    <List marker={"decimal"} sx={{ marginBottom: props.root ? 2 : 0 }}>
      {props.children
        .filter((child) => typeof child !== "string")
        .map((child: any, index: number) => {
          return (
            <ListItem key={index} nested={child.type !== "li"} {...child.props}>
              {child.type === "li" && (
                <ListItemContent>
                  <Typography level="body-md">
                    {child.props.children}
                  </Typography>
                </ListItemContent>
              )}
              {child.type === "ul" && (
                <UnorderedList {...child.props.children.props} />
              )}
              {child.type === "ul" && (
                <OrderedList {...child.props.children.props} />
              )}
            </ListItem>
          )
        })}
    </List>
  )
}

export {
  Blockquote,
  H2,
  H3,
  H4,
  Image,
  Link,
  OrderedList,
  Paragraph,
  Table,
  UnorderedList,
}
