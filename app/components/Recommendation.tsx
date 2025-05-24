import Avatar from "@mui/joy/Avatar"
import Box from "@mui/joy/Box"
import Button from "@mui/joy/Button"
import Card from "@mui/joy/Card"
import Chip from "@mui/joy/Chip"
import Stack from "@mui/joy/Stack"
import Typography from "@mui/joy/Typography"
import { motion } from "motion/react"
import {
  Children,
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import useAnalytics from "../libs/useAnalytics"

const overlayVariants = {
  active: {
    opacity: 1,
  },
  inactive: {
    opacity: 0,
    display: "none",
  },
}
const Recommendation: FC<
  PropsWithChildren<{
    profileImage: string
    name: string
    title: string
    company: string
    summarized?: boolean
  }>
> = ({ profileImage, name, title, children, company, summarized }) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const handleKeyDown = (evt) => {
    if (summarized && isOpen && evt.key === "Escape") {
      toggleOpen()
    }
  }
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  const scrollable = useRef<HTMLDivElement>()
  useEffect(() => {
    window.document.body.style.overflow = isOpen ? "hidden" : "unset"
    if (!isOpen) {
      scrollable.current?.scroll({ top: 0 })
    }
  }, [isOpen])

  const { track } = useAnalytics()
  const timestamp = useRef<Date | undefined>()
  useEffect(() => {
    if (!isOpen && timestamp.current) {
      const now = new Date()
      const diff = now.getTime() - timestamp.current.getTime()
      const seconds = Math.floor(diff / 1000)
      track("recommendationViewed_time", {
        seconds,
        name,
        title,
        company,
      })

      return
    }

    timestamp.current = new Date()
    track("recommendationViewed", {
      name,
      title,
      company,
    })
  }, [isOpen])
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isOpen && timestamp.current) {
        const now = new Date()
        const diff = now.getTime() - timestamp.current.getTime()
        const seconds = Math.floor(diff / 1000)
        track("recommendationViewed_time", {
          seconds,
          name,
          title,
          company,
        })
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      handleBeforeUnload()
    }
  }, [])

  return (
    <Box sx={{ minHeight: "191px" }}>
      <motion.div
        style={{
          pointerEvents: "none",
          willChange: "opacity",
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.8)",
          zIndex: 100,
        }}
        variants={overlayVariants}
        animate={isOpen ? "active" : "inactive"}
        onClick={toggleOpen}
      ></motion.div>
      <Box
        sx={(theme) => ({
          margin: 0,
          zIndex: isOpen ? 101 : 0,
          position: isOpen ? "fixed" : "relative",
          top: isOpen ? 0 : "unset",
          left: isOpen ? 0 : "unset",
          width: isOpen ? "100%" : "unset",
          height: isOpen ? `calc(100vh - ${theme.spacing(2)})` : "unset",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        })}
      >
        <Card
          sx={(theme) => ({
            height: "100%",
            margin: summarized && isOpen ? 1 : 0,
            minWidth: "100%",
            [theme.breakpoints.up("sm")]: {
              width: summarized && isOpen ? "80%" : "unset",
              minWidth: "unset",
              maxWidth: "1200px",
              height: "unset",
            },
          })}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={(theme) => ({
              width: "100%",
              [theme.breakpoints.down("sm")]: {
                height: "100%",
              },
            })}
          >
            <Avatar
              alt={name}
              src={profileImage}
              sx={(theme) => ({
                width: 80,
                height: 80,
                [theme.breakpoints.down("sm")]: {
                  width: 45,
                  height: 45,
                },
              })}
              variant="plain"
            ></Avatar>
            <Stack
              direction="column"
              sx={{ textAlign: "left", width: "100%" }}
              spacing={1}
            >
              <Stack direction="column" spacing={0.25}>
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="space-between"
                >
                  <Typography level="h3" fontSize="lg">
                    {name}
                  </Typography>
                  <Chip>{company}</Chip>
                </Stack>
                <Typography level="body-sm">{title}</Typography>
              </Stack>
              <Box
                ref={scrollable}
                sx={(theme) => ({
                  maxHeight:
                    !summarized || isOpen ? "100%" : "calc(1.5rem * 3)",
                  overflowY: !summarized || isOpen ? "scroll" : "hidden",
                  scrollbarWidth: "thin",
                  scrollbarColor: `${theme.palette.text.tertiary} transparent`,
                  "&::-webkit-scrollbar": {
                    width: theme.spacing(0.5),
                  },
                  "&::--webkit-scrollbar-track": {
                    background: "transparent",
                  },
                  textOverflow: !summarized || !isOpen ? "unset" : "ellipsis",
                  width: "100%",
                  [theme.breakpoints.down("sm")]: {
                    height: summarized && isOpen ? `100%` : "unset",
                    width:
                      summarized && isOpen
                        ? `calc(100% + ${theme.spacing(12)})`
                        : `unset`,
                    marginLeft: `calc(-1 * ${theme.spacing(10)}) !important`,
                    marginTop: `${theme.spacing(1)} !important`,
                    "> * ": {
                      padding:
                        summarized && isOpen
                          ? theme.spacing(0, 4)
                          : theme.spacing(0, 2),
                    },
                  },
                  [theme.breakpoints.up("sm")]: {
                    // height: summarized && isOpen ? "100vh" : "unset",
                  },
                })}
              >
                {!summarized || isOpen
                  ? children
                  : Children.toArray(children)[0]}
              </Box>
              {summarized && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ marginTop: 1 }}
                  justifyContent={"flex-end"}
                >
                  <Button
                    variant="plain"
                    color="primary"
                    size="sm"
                    onClick={toggleOpen}
                  >
                    {isOpen ? "Close" : "Read more"}
                  </Button>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Card>
      </Box>
    </Box>
  )
}
export default Recommendation
