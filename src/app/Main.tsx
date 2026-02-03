import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import { Todolists } from "@/features/todolists/ui/Todolists/Todolists"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import { useAddTodolistMutation } from "@/features/todolists/api/todolistsApi"

export const Main = () => {
    const [addTodolist] = useAddTodolistMutation()

    const addTodolistHandler = (title: string) => {
        addTodolist(title)
    }

    return (
        <Container maxWidth="lg">
            <Grid container sx={{ mb: "30px" }}>
                <CreateItemForm onCreateItem={addTodolistHandler} />
            </Grid>

            <Grid container spacing={4}>
                <Todolists />
            </Grid>
        </Container>
    )
}
