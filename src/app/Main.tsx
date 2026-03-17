// app/Main.tsx
import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import { useAddTodolistMutation } from "@/features/todolists/api/todolistsApi"
import { Todolists } from "@/features/todolists/ui/Todolists/Todolists"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"

export const Main = () => {
  const [addTodolist] = useAddTodolistMutation()

  const handleAddTodolist = async (title: string) => {
    try {
      await addTodolist(title).unwrap()
    } catch (error) {
      console.error("Failed to add todolist:", error)
    }
  }

  return (
    <Container maxWidth={"lg"}>
      <Box sx={{ mb: "30px" }}>
        <Box sx={{ width: "100%", maxWidth: 250, mx: "auto", transform: "translateX(-40px)" }}>
          <CreateItemForm onCreateItem={handleAddTodolist} placeholder="Enter todolist title" />
        </Box>
      </Box>
      <Grid container spacing={4}>
        <Todolists />
      </Grid>
    </Container>
  )
}
