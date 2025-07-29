import './App.css'
import {TodolistItem} from './TodolistItem'
import {useState} from "react";
import {v1} from "uuid";

export type FilterValues = 'All' | 'Active' | 'Completed';

export type Task = {
    id: string
    title: string
    isDone: boolean
}

export const App = () => {
    const [filter, changeFilter] = useState<FilterValues>('All')
    const [tasks, setTasks] = useState<Task[]>([
        {id: v1(), title: 'HTML&CSS', isDone: true},
        {id: v1(), title: 'JS', isDone: true},
        {id: v1(), title: 'ReactJS', isDone: false},
    ])

    const deleteTask = (taskId: string) => {
        setTasks(tasks.filter(task => task.id !== taskId))
    }

    const createTask = (title: string) => {
        setTasks([{id: v1(), title, isDone: false}, ...tasks])
    }

    const changeTaskStatus = (taskId: string, isDone: boolean) => {
        const newState = tasks.map(task => task.id == taskId ? { ...task, isDone } : task)
        setTasks(newState)
    }

    const filteredTasks = filter === 'Active'
        ? tasks.filter(task => !task.isDone)
        : filter === 'Completed'
            ? tasks.filter(task => task.isDone)
            : tasks

    return (
        <div className="app">
            <TodolistItem
                title="What to learn"
                tasks={filteredTasks}
                deleteTask={deleteTask}
                changeFilter={changeFilter}
                createTask={createTask}
                changeTaskStatus={changeTaskStatus}
                filter={filter} id={''}            />
        </div>
    )
}