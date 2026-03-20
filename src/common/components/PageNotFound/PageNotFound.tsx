import { Path } from "@/common/routing"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import { Link } from "react-router"
import styles from "./PageNotFound.module.css"

export const PageNotFound = () => (
  <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

    <h6 className={styles.subtitle}>Пожалйста, авторизуйтесь</h6>
    <Button variant="contained" component={Link} to={Path.Main} sx={{ width: "330px", mt: "20px" }}>
      Вернуться на страницу авторизации
    </Button>
  </Container>
)
