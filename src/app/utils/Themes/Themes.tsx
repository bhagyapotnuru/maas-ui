import { createTheme } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

const customDrutTheme: Theme = createTheme({
  typography: {
    fontFamily: [
      "Ubuntu",
      "-apple-system",
      '"Segoe UI"',
      "Roboto",
      "Oxygen",
      "Cantarell",
      "Fira",
      "Sans",
      "Droid Sans",
      '"Helvetica Neue"',
      "sans-serif",
    ].join(","),
    fontWeightRegular: 300,
  },
});

export default customDrutTheme;
