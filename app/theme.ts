import { extendTheme } from "@mui/joy/styles"

const theme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          plainColor: "#c97a58",
          solidBg: "#b85c38",
          solidHoverBg: "#c97a58",
          solidActiveBg: "#b85c38",
          mainChannel: "210 70 4",
        },
        background: {
          body: "#1a1917",
          surface: "#222120",
          level1: "#1a1917",
        },
        neutral: {
          plainColor: "#ffffff",
          plainHoverBg: "rgba(201, 122, 88, 0.12)",
          outlinedColor: "#fff",
          outlinedHoverColor: "rgb(26, 25, 23)",
          outlinedHoverBg: "#ffffff",
          solidBg: "#222120",
          solidDisabledBg: "#B0B0B0",
        },
        text: {
          primary: "#e2e0d8",
          secondary: "#9e9b91",
          tertiary: "#f0ede4",
        },
      },
    },
    light: {
      palette: {
        primary: {
          plainColor: "#c97a58",
          solidBg: "#b85c38",
          solidHoverBg: "#c97a58",
          solidActiveBg: "#b85c38",
        },
        background: {
          body: "#1a1917",
          surface: "#222120",
          level1: "#1a1917",
        },
        neutral: {
          plainColor: "#ffffff",
          plainHoverBg: "rgba(201, 122, 88, 0.12)",
          outlinedColor: "#fff",
          outlinedHoverColor: "rgb(26, 25, 23)",
          outlinedHoverBg: "#ffffff",
          solidBg: "#222120",
          solidDisabledBg: "#B0B0B0",
          outlinedBorder: "#9e9b91",
        },
        text: {
          primary: "#e2e0d8",
          secondary: "#f0ede4",
          tertiary: "#9e9b91",
        },
      },
    },
  },
  focus: {
    default: {
      outlineWidth: "3px",
      outlineColor: "#b85c38",
    },
  },
  fontFamily: {
    display: "Lato-Bold, sans-serif",
    body: "Lato, sans-serif",
  },
  typography: {},
  components: {
    JoyCard: {
      styleOverrides: {
        root: {
          border: "none",
        },
      },
    },
    JoyListItem: {
      styleOverrides: {
        root: {
          "&::marker": { color: "#ffffff" },
        },
      },
    },
    JoyLink: {
      styleOverrides: {
        root: {
          color: "#ffffff",
          textDecorationColor: "#c97a58",
          "&:hover": {
            color: "#c97a58",
          },
          "&:active": {
            color: "#b85c38",
          },
        },
      },
    },
    JoyMenu: {
      styleOverrides: {
        root: {
          backgroundColor: "#222120",
          border: "1px solid #9e9b91",
          "--ListItem-minHeight": "48px",
          "--joy-palette-text-primary": "#e2e0d8",
          "--joy-palette-neutral-plainHoverBg": "#2e2c2b",
          "--joy-palette-neutral-plainActiveBg": "#3a3836",
        },
      },
    },
    JoyMenuItem: {
      styleOverrides: {
        root: {
          color: "#e2e0d8",
        },
      },
    },
    JoyButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          boxShadow: "0 1px 0 0 rgba(27, 31, 35, 0.04)",
          transition: "80ms cubic-bezier(0.33, 1, 0.68, 1)",
          transitionProperty: "color,background-color,box-shadow,border-color",
          // neutral outlined: solid bg on hover with dark text (e.g. header CTA buttons)
          ...(ownerState.color === "neutral" &&
            ownerState.variant === "outlined" && {
              "&:active": { boxShadow: "none" },
              "&:hover": {
                backgroundColor: "#ffffff",
                color: "rgb(26, 25, 23)",
              },
            }),
          // plain variant (any color): warm orange tint on hover (e.g. "View All", "Read more" buttons)
          ...(ownerState.variant === "plain" && {
            "&:hover": {
              backgroundColor: "rgba(201, 122, 88, 0.12)",
              color: "#c97a58",
            },
          }),
        }),
      },
    },
  },
})

export default theme
