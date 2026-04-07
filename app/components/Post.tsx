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
  return (
    <Typography
      {...props}
      level="h2"
      fontSize="xl"
      fontWeight={700}
      sx={{ lineHeight: 1.3, marginTop: "2.5rem", marginBottom: "0.6rem" }}
    />
  )
}
const H3: FC<PropsWithChildren<{}>> = (props) => {
  return (
    <Typography
      {...props}
      level="h3"
      fontSize="lg"
      fontWeight={700}
      sx={{ lineHeight: 1.3, marginTop: "2rem", marginBottom: "0.6rem" }}
    />
  )
}

const H4: FC<PropsWithChildren<{}>> = (props) => {
  return (
    <Typography
      {...props}
      level="h2"
      fontSize="xl"
      fontWeight={700}
      sx={{ lineHeight: 1.3, marginTop: "2rem", marginBottom: "0.6rem" }}
    />
  )
}

const TableWrapper = styled("div")({
  position: "relative",
  left: "50%",
  transform: "translateX(-50%)",
  width: "calc(100vw - 6rem)",
  maxWidth: "calc(960px - 6rem)",
  margin: "1.5rem 0",
  "@media (max-width: 640px)": {
    position: "static",
    width: "100%",
    left: "unset",
    transform: "none",
    overflowX: "auto",
  },
})

const Table = styled("table")({
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "14px",
  lineHeight: 1.6,

  "& thead th": {
    textAlign: "left",
    padding: "10px 16px",
    fontSize: "11px",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#9e9b91",
    borderBottom: "1px solid #2e2b28",
    whiteSpace: "nowrap",
  },

  "& tbody td": {
    padding: "12px 16px",
    color: "#e2e0d8",
    verticalAlign: "top",
    borderBottom: "0.5px solid #2a2724",
  },

  "& tbody tr:nth-child(even) td": {
    background: "rgba(255, 255, 255, 0.03)",
  },

  "& tbody tr:hover td": {
    background: "rgba(201, 122, 88, 0.06)",
  },

  "& tbody td:first-child": {
    color: "#f0ede4",
    fontWeight: 500,
    whiteSpace: "nowrap",
  },
})

const Paragraph: FC<PropsWithChildren<{}>> = (props) => {
  return (
    <Typography
      {...props}
      level="body-lg"
      sx={(theme) => ({
        lineHeight: 1.8,
        marginBottom: "1.5rem",
      })}
    />
  )
}

const StyledBlockquote = styled("blockquote")({
  position: "relative",
  margin: "1.5rem 0",
  padding: "0.75rem 1.25rem",
  background: "rgba(184, 92, 56, 0.15)",
  borderLeft: "3px solid #b85c38",
  borderRadius: "0 6px 6px 0",
  color: "#f0d4c4",

  "p:last-child": {
    marginBottom: "0 !important",
  },

  "&::before": {
    display: "none",
  },
})

const Blockquote: FC<
  PropsWithChildren<{ children: Array<{ props: Record<string, any> }> }>
> = (props) => {
  if (props.children.length > 1) {
    return (
      <StyledBlockquote>
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

const TableContainer: FC<PropsWithChildren<{}>> = ({ children }) => (
  <TableWrapper>
    <Table>{children}</Table>
  </TableWrapper>
)

export {
  Blockquote,
  H2,
  H3,
  H4,
  Image,
  Link,
  OrderedList,
  Paragraph,
  TableContainer as Table,
  UnorderedList,
}
