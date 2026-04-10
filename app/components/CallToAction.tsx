import Box from "@mui/joy/Box"
import Button from "@mui/joy/Button"
import Dropdown from "@mui/joy/Dropdown"
import Menu from "@mui/joy/Menu"
import MenuButton from "@mui/joy/MenuButton"
import MenuItem from "@mui/joy/MenuItem"
import Stack from "@mui/joy/Stack"
import { Link as RemixLink } from "@remix-run/react"
import React, { FC, MouseEventHandler, useEffect, useRef, useState } from "react"

const CallToAction: FC<{
  primaryTitle?: string
  primaryAction?: string | MouseEventHandler
  secondaryTitle: string
  secondaryAction: string | MouseEventHandler
  tertiaryTitle?: string
  tertiaryAction?: string | MouseEventHandler
}> = ({ primaryTitle, primaryAction, secondaryAction, secondaryTitle, tertiaryTitle, tertiaryAction }) => {
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [menuWidth, setMenuWidth] = useState<number | undefined>()

  useEffect(() => {
    if (menuButtonRef.current) {
      setMenuWidth(menuButtonRef.current.offsetWidth)
    }
  }, [])

  const handlePrimaryAction = (evt: React.MouseEvent) => {
    if (typeof primaryAction === "function") {
      primaryAction(evt)
    }
  }

  const handleSecondaryAction = (evt: React.MouseEvent) => {
    if (typeof secondaryAction === "function") {
      secondaryAction(evt)
    }
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
            {!primaryAction ? (
              <MenuItem component="a" href={encodeURI("/James Andrew Smith - Resume.pdf")}>
                Download Resume
              </MenuItem>
            ) : typeof primaryAction === "string" ? (
              <MenuItem component={RemixLink as any} to={primaryAction}>
                {primaryTitle}
              </MenuItem>
            ) : (
              <MenuItem onClick={handlePrimaryAction}>
                {primaryTitle}
              </MenuItem>
            )}
            {typeof secondaryAction === "string" ? (
              <MenuItem component={RemixLink as any} to={secondaryAction}>
                {secondaryTitle}
              </MenuItem>
            ) : (
              <MenuItem onClick={handleSecondaryAction}>
                {secondaryTitle}
              </MenuItem>
            )}
            {tertiaryTitle && tertiaryAction && (
              typeof tertiaryAction === "string" ? (
                <MenuItem component={RemixLink as any} to={tertiaryAction}>
                  {tertiaryTitle}
                </MenuItem>
              ) : (
                <MenuItem onClick={tertiaryAction as MouseEventHandler}>
                  {tertiaryTitle}
                </MenuItem>
              )
            )}
          </Menu>
        </Dropdown>
      </Box>

      {/* Tablet+: button row */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ display: { xs: "none", sm: "flex" }, mt: 2, gap: 2 }}
      >
        {!primaryAction ? (
          <Button
            color="primary"
            variant="solid"
            href={encodeURI("/James Andrew Smith - Resume.pdf")}
            component="a"
            size="lg"
          >
            Download Resume
          </Button>
        ) : typeof primaryAction === "string" ? (
          <Button
            color="primary"
            variant="solid"
            to={primaryAction}
            component={RemixLink}
            size="lg"
          >
            {primaryTitle}
          </Button>
        ) : (
          <Button
            color="primary"
            variant="solid"
            onClick={handlePrimaryAction}
            size="lg"
          >
            {primaryTitle}
          </Button>
        )}
        {typeof secondaryAction === "string" ? (
          <Button
            color="neutral"
            variant="outlined"
            component={RemixLink}
            to={secondaryAction}
            size="lg"
          >
            {secondaryTitle}
          </Button>
        ) : (
          <Button
            color="neutral"
            variant="outlined"
            size="lg"
            onClick={handleSecondaryAction}
          >
            {secondaryTitle}
          </Button>
        )}
        {tertiaryTitle && tertiaryAction && (
          typeof tertiaryAction === "string" ? (
            <Button
              color="neutral"
              variant="outlined"
              component={RemixLink}
              to={tertiaryAction}
              size="lg"
            >
              {tertiaryTitle}
            </Button>
          ) : (
            <Button
              color="neutral"
              variant="outlined"
              size="lg"
              onClick={tertiaryAction as MouseEventHandler}
            >
              {tertiaryTitle}
            </Button>
          )
        )}
      </Stack>
    </>
  )
}

export default CallToAction
