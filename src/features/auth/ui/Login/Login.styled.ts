import { styled } from "@mui/material/styles"
import TextField from "@mui/material/TextField"

export const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.mode === "light" ? "#FFFFFF" : "#1e3a4a",
    "& fieldset": {
      borderColor: theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.23)" : "rgba(255, 255, 255, 0.23)",
    },
    "&:hover fieldset": {
      borderColor: "#0288D1",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#0288D1",
    },
  },
  "& .MuiOutlinedInput-input": {
    color: theme.palette.mode === "light" ? "#01579B" : "#B3E5FC",
    "&::placeholder": {
      color: theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.5)",
      opacity: 1,
    },
  },
}))
