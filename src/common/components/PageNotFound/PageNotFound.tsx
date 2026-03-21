import { Path } from "@/common/routing"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import { Link } from "react-router"

export const PageNotFound = () => (
  <Container
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      height: "100vh",
      pt: "25vh", // ⬅️ двигает вверх/вниз
    }}
  >
    <Typography
      sx={{
        textAlign: "center",
        lineHeight: 1.2,
        fontSize: {
          xs: "1.2rem", // мобилка
          sm: "1.5rem", // планшет
          md: "2rem", // десктоп
        },
      }}
    >
      Пожалуйста, <br />
      авторизуйтесь
    </Typography>

    <Button
      variant="contained"
      component={Link}
      to={Path.Main}
      sx={{
        mt: 3,
        width: {
          xs: "100%", // на мобилке во всю ширину
          sm: "350px",
          md: "500px",
        },
        fontSize: {
          xs: "0.9rem",
          sm: "1.1rem",
          md: "1.3rem",
        },
        padding: {
          xs: "10px",
          sm: "12px",
          md: "14px",
        },
      }}
    >
      Вернуться на страницу авторизации
    </Button>
  </Container>
)
