import Box from "@mui/joy/Box"
import Button from "@mui/joy/Button"
import Dropdown from "@mui/joy/Dropdown"
import Menu from "@mui/joy/Menu"
import MenuButton from "@mui/joy/MenuButton"
import MenuItem from "@mui/joy/MenuItem"
import Stack from "@mui/joy/Stack"
import { Link as RemixLink } from "react-router"
import { FC, MouseEventHandler, useEffect, useRef, useState } from "react"
import { profile } from "../data/profile"

const CONNECT_PATH = "/connect-with-me"
const resumeHref = encodeURI(profile.resumeUrl)

type Action = string | MouseEventHandler

// A single call to action. `file` actions are plain anchors (never client-side
// routed) so the browser handles the PDF itself.
type Item = {
  title: string
  action?: Action
  file?: { newTab?: boolean; download?: boolean }
  href?: string
}

// "default" is every page except /connect-with-me: the desktop primary button
// is "Connect / Resume" and the phone dropdown gains a "Connect with Me" link.
// "connect" is the /connect-with-me page itself, where that spot offers the
// resume instead of a link back to itself.
const CallToAction: FC<{
  variant?: "default" | "connect"
  primaryTitle?: string
  primaryAction?: string | MouseEventHandler
  secondaryTitle: string
  secondaryAction: string | MouseEventHandler
  tertiaryTitle?: string
  tertiaryAction?: string | MouseEventHandler
}> = ({ variant = "default", primaryTitle, primaryAction, secondaryAction, secondaryTitle, tertiaryTitle, tertiaryAction }) => {
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [menuWidth, setMenuWidth] = useState<number | undefined>()

  useEffect(() => {
    if (menuButtonRef.current) {
      setMenuWidth(menuButtonRef.current.offsetWidth)
    }
  }, [])

  const downloadResume: Item = { title: "Download Resume", href: resumeHref, file: { download: true } }
  const viewResume: Item = { title: "View Resume", href: resumeHref, file: { newTab: true } }
  const connect: Item = { title: "Connect / Resume", action: CONNECT_PATH }

  let primary: Item
  const phoneOnly: Item[] = []
  const afterPrimary: Item[] = []
  if (primaryAction) {
    primary = { title: primaryTitle ?? "", action: primaryAction }
  } else if (variant === "connect") {
    primary = downloadResume
    afterPrimary.push(viewResume)
  } else {
    primary = connect
    // Phones list both the link and the resume download in the dropdown.
    phoneOnly.push({ title: "Connect with Me", action: CONNECT_PATH }, downloadResume)
  }

  const items: Item[] = [primary, ...afterPrimary, { title: secondaryTitle, action: secondaryAction }]
  if (tertiaryTitle && tertiaryAction) {
    items.push({ title: tertiaryTitle, action: tertiaryAction })
  }
  const phoneItems = phoneOnly.length > 0 ? [...phoneOnly, ...items.slice(1)] : items

  const linkProps = (item: Item) => {
    if (item.file) {
      return {
        component: "a",
        href: item.href,
        ...(item.file.download && { download: "" }),
        ...(item.file.newTab && { target: "_blank", rel: "noopener noreferrer" }),
      }
    }
    if (typeof item.action === "string") {
      return { component: RemixLink, to: item.action }
    }
    return { onClick: item.action as MouseEventHandler | undefined }
  }
  const menuLinkProps = (item: Item) => {
    const props = linkProps(item) as Record<string, unknown>
    if (props.component === "a") return props
    if (props.component) return { ...props, component: RemixLink as any }
    return props
  }

  return (
    <>
      {/* Phone: full-width dropdown */}
      <Box sx={{ display: { xs: "block", sm: "none" }, mt: 2 }}>
        <Dropdown>
          <MenuButton ref={menuButtonRef} size="lg" sx={{ width: "100%" }}>
            Navigation
          </MenuButton>
          <Menu sx={{ minWidth: menuWidth }}>
            {phoneItems.map((item) => (
              <MenuItem key={item.title} {...(menuLinkProps(item) as object)}>
                {item.title}
              </MenuItem>
            ))}
          </Menu>
        </Dropdown>
      </Box>

      {/* Tablet+: button row */}
      <Stack direction="row" alignItems="center" justifyContent="center" flexWrap="wrap" sx={{ display: { xs: "none", sm: "flex" }, mt: 2, gap: 2 }}>
        {items.map((item, index) => (
          <Button
            key={item.title}
            color={index === 0 ? "primary" : "neutral"}
            variant={index === 0 ? "solid" : "outlined"}
            size="lg"
            {...(linkProps(item) as object)}
          >
            {item.title}
          </Button>
        ))}
      </Stack>
    </>
  )
}

export default CallToAction
