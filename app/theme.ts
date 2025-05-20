import { extendTheme } from "@mui/joy/styles"

const theme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          plainColor: "#D24604",
          solidBg: "#D24604",
          solidHoverBg: "#FF5520",
          solidActiveBg: "#FF5520",
        },
        background: {
          body: "#0F1214",
          surface: "#1E1E1E",
        },
        neutral: {
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
          plainColor: "#D24604",
          solidBg: "#D24604",
          solidHoverBg: "#FF5520",
          solidActiveBg: "#FF5520",
        },
        background: {
          body: "#0F1214",
          surface: "#1E1E1E",
        },
        neutral: {
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
  },
  focus: {
    default: {
      outlineWidth: "3px",
      outlineColor: "#D24604",
    },
  },
  fontFamily: {
    display: "Lato-Bold, sans-serif",
    body: "Lato, sans-serif",
  },
  typography: {},
  components: {
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
                color: theme.palette.neutral.outlinedHoverColor,
              },
            }),
        }),
      },
    },
  },
})

export default theme
