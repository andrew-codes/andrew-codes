import { extendTheme } from "@mui/joy/styles"

const theme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          plainColor: "#6C63FF",
          solidBg: "#6C63FF",
          solidHoverBg: "#825CFF",
          solidActiveBg: "#825CFF",
          mainChannel: "210 70 4",
        },
        background: {
          body: "#0F1214",
          surface: "#1E1E1E",
          level1: "#0F1214",
        },
        neutral: {
          plainColor: "#ffffff",
          outlinedColor: "#fff",
          outlinedHoverColor: "#0F1214",
          solidBg: "#1E1E1E",
          solidDisabledBg: "#B0B0B0",
        },
        text: {
          primary: "#ffffff",
          secondary: "#b0b0b0",
          tertiary: "#e8e2db",
        },
      },
    },
    light: {
      palette: {
        primary: {
          plainColor: "#6C63FF",
          solidBg: "#6C63FF",
          solidHoverBg: "#825CFF",
          solidActiveBg: "#825CFF",
        },
        background: {
          body: "#0F1214",
          surface: "#1E1E1E",
          level1: "#0F1214",
        },
        neutral: {
          plainColor: "#ffffff",
          outlinedColor: "#fff",
          outlinedHoverColor: "#0F1214",
          solidBg: "#1E1E1E",
          solidDisabledBg: "#B0B0B0",
          outlinedBorder: "#b0b0b0",
        },
        text: {
          primary: "#ffffff",
          secondary: "#e8e2db",
          tertiary: "#b0b0b0",
        },
      },
    },
  },
  focus: {
    default: {
      outlineWidth: "3px",
      outlineColor: "#6C63FF",
    },
  },
  fontFamily: {
    display: "Lato-Bold, sans-serif",
    body: "Lato, sans-serif",
  },
  typography: {},
  components: {
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
