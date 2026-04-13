import Avatar from "@mui/joy/Avatar"
import Box from "@mui/joy/Box"
import Button from "@mui/joy/Button"
import Card from "@mui/joy/Card"
import Chip from "@mui/joy/Chip"
import Modal from "@mui/joy/Modal"
import ModalClose from "@mui/joy/ModalClose"
import ModalDialog from "@mui/joy/ModalDialog"
import Stack from "@mui/joy/Stack"
import Typography from "@mui/joy/Typography"
import {
  Children,
  FC,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from "react"

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
  const scrollable = useRef<HTMLDivElement>(null)

  const cardContent = (expanded: boolean) => (
    <Stack
      direction="row"
      spacing={2}
      sx={(theme) => ({
        width: "100%",
        [theme.breakpoints.down("sm")]: {
          height: expanded ? "100%" : "unset",
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
      />
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
            <Chip
              sx={{
                background: "rgba(201, 138, 42, 0.12)",
                color: "#c98a2a",
                border: "0.5px solid rgba(201, 138, 42, 0.35)",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              {company}
            </Chip>
          </Stack>
          <Typography level="body-sm">{title}</Typography>
        </Stack>
        <Box
          ref={expanded ? scrollable : undefined}
          sx={(theme) => ({
            maxHeight: expanded ? "100%" : "calc(1.5rem * 3)",
            overflowY: expanded ? "auto" : "hidden",
            scrollbarWidth: "thin",
            scrollbarColor: `${theme.palette.text.tertiary} transparent`,
            "&::-webkit-scrollbar": {
              width: theme.spacing(0.5),
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            textOverflow: !expanded ? "ellipsis" : "unset",
            width: "100%",
          })}
        >
          {expanded ? children : Children.toArray(children)[0]}
        </Box>
        {summarized && !expanded && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ marginTop: 1 }}
            justifyContent="flex-end"
          >
            <Button
              variant="plain"
              color="primary"
              size="sm"
              onClick={toggleOpen}
            >
              Read more
            </Button>
          </Stack>
        )}
      </Stack>
    </Stack>
  )

  return (
    <Box sx={{ minHeight: "191px" }}>
      <Card>{cardContent(false)}</Card>
      {summarized && (
        <Modal open={isOpen} onClose={toggleOpen}>
          <ModalDialog
            layout="center"
            sx={(theme) => ({
              maxWidth: "1200px",
              width: "90%",
              maxHeight: "90vh",
              overflow: "visible",
              padding: 0,
              [theme.breakpoints.down("sm")]: {
                width: "100%",
                maxHeight: "100vh",
                borderRadius: 0,
              },
            })}
          >
            <ModalClose
              sx={{
                position: "absolute",
                top: "-1rem",
                right: "-1rem",
                zIndex: 1,
                backgroundColor: "#9e9b91",
                color: "#1a1917",
                borderRadius: "50%",
                boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                "&:hover": {
                  backgroundColor: "#b0ada3",
                },
              }}
            />
            <Box
              sx={(theme) => ({
                overflow: "auto",
                maxHeight: "90vh",
                padding: theme.spacing(2),
                [theme.breakpoints.down("sm")]: {
                  maxHeight: "100vh",
                },
              })}
            >
              {cardContent(true)}
            </Box>
          </ModalDialog>
        </Modal>
      )}
    </Box>
  )
}

export default Recommendation
