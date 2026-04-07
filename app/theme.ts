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
          outlinedColor: "#fff",
          outlinedHoverColor: "#1a1917",
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
          outlinedColor: "#fff",
          outlinedHoverColor: "#1a1917",
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
        root: ({ theme }) => ({
          "&::marker": { color: theme.palette.neutral.plainColor },
        }),
      },
    },
    JoyLink: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.neutral.plainColor,
          textDecorationColor: theme.palette.primary.plainColor,
          "&:hover": {
            color: theme.palette.primary.solidHoverBg,
          },
          "&:active": {
            color: theme.palette.primary.solidActiveBg,
          },
        }),
      },
    },
    JoyButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          // borderRadius: "6px",
          boxShadow: "0 1px 0 0 rgba(27, 31, 35, 0.04)",
          transition: "80ms cubic-bezier(0.33, 1, 0.68, 1)",
          transitionProperty: "color,background-color,box-shadow,border-color",
          ...(ownerState.color === "neutral" &&
            ownerState.variant === "outlined" && {
              "&:active": {
                boxShadow: "none",
              },
              "&:hover": {
                color: `${theme.palette.neutral.outlinedHoverColor} !important`,
              },
            }),
        }),
      },
    },
  },
})

export default theme
