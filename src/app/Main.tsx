// app/Main.tsx - исправленный
import { Todolists } from "@/features/todolists/ui/Todolists/Todolists"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"

export const Main = () => {
  return (
    <Container maxWidth={"lg"}>
      <Grid container spacing={4}>
        <Todolists />
      </Grid>
    </Container>
  )
}
