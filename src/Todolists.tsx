import {useAppSelector} from "@/common/hooks/useAppSelector.ts";
import {selectTodolists} from "@/model/todolists-selectors.ts";
import {FilterValues} from "@/app/App.tsx";
import {changeTodolistFilterAC, changeTodolistTitleAC, deleteTodolistAC} from "@/model/todolists-reducer.ts";
import {changeTaskStatusAC, changeTaskTitleAC, createTaskAC, deleteTaskAC} from "@/model/tasks-reducer.ts";
import {useAppDispatch} from "@/common/hooks/useAppDispatch.ts";
import {TodolistItem} from "@/TodolistItem.tsx";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import {selectTasks} from "@/model/tasks-selectors.ts";


export const Todolists = () => {
    const dispatch = useAppDispatch()
    const todolists = useAppSelector(selectTodolists)
    const tasks = useAppSelector(selectTasks)


    const changeFilter = (todolistId: string, filter: FilterValues) => {
        dispatch(changeTodolistFilterAC({id: todolistId, filter}))
    }

    const deleteTodolist = (todolistId: string) => {
        dispatch(deleteTodolistAC({id: todolistId}))
    }

    const changeTodolistTitle = (todolistId: string, title: string) => {
        dispatch(changeTodolistTitleAC({id: todolistId, title}))
    }

    const deleteTask = (todolistId: string, taskId: string) => {
        dispatch(deleteTaskAC({todolistId, taskId}))
    }

    const createTask = (todolistId: string, title: string) => {
        dispatch(createTaskAC({todolistId, title}))
    }

    const changeTaskStatus = (todolistId: string, taskId: string, isDone: boolean) => {
        dispatch(changeTaskStatusAC({todolistId, taskId, isDone}))
    }

    const changeTaskTitle = (todolistId: string, taskId: string, title: string) => {
        dispatch(changeTaskTitleAC({todolistId, taskId, title}))
    }


    return (
        <div>
            {todolists.map(todolist => {


                return (
                    <Grid key={todolist.id}>
                        <Paper sx={{p: '0 20px 20px 20px'}}>
                            <TodolistItem todolist={todolist}
                                          tasks={tasks[todolist.id]}
                                          deleteTask={deleteTask}
                                          changeFilter={changeFilter}
                                          createTask={createTask}
                                          changeTaskStatus={changeTaskStatus}
                                          deleteTodolist={deleteTodolist}
                                          changeTaskTitle={changeTaskTitle}
                                          changeTodolistTitle={changeTodolistTitle}/>
                        </Paper>
                    </Grid>
                )
            })}
        </div>
    )
}