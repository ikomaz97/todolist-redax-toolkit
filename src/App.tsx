import './App.css'
import {TodolistItem} from './TodolistItem'
import {useState} from "react";
import {v1} from "uuid";

export type FilterValues = 'all' | 'active' | 'completed'

export type Task = {
  id: string
  title: string
  isDone: boolean
}

export const App = () => {
  const [filter, changeFilter] = useState<FilterValues>('all')
  const [tasks, setTasks] = useState<Task[]>([
    { id: v1(), title: 'HTML&CSS', isDone: true },
    { id: v1(), title: 'JS', isDone: true },
    { id: v1(), title: 'ReactJS', isDone: false },
  ])

  const deleteTask = (taskId: string) => {
    const filteredTasks = tasks.filter(task => {
      return task.id !== taskId
    })
    setTasks(filteredTasks)
  }

  let filteredTasks = tasks
  if (filter === 'active') {
    filteredTasks = tasks.filter(task => !task.isDone)
  }
  if (filter === 'completed') {
    filteredTasks = tasks.filter(task => task.isDone)
  }

  return (
      <div className="app">
        <TodolistItem title="What to learn"
                      tasks={filteredTasks}
                      deleteTask={deleteTask}
                      changeFilter={changeFilter}
        />
      </div>
  )
}
