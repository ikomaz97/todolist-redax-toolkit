// app/Main.tsx
import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import { useAddTodolistMutation } from "@/features/todolists/api/todolistsApi"
import { Todolists } from "@/features/todolists/ui/Todolists/Todolists"
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
      <Grid container sx={{ mb: "30px" }}>
        <CreateItemForm onCreateItem={handleAddTodolist} placeholder="Enter todolist title" />
      </Grid>
      <Grid container spacing={4}>
        <Todolists />
      </Grid>
    </Container>
  )
}
