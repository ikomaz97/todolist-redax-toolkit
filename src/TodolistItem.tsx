import type {ChangeEvent} from 'react'
import type {FilterValues, Task, Todolist} from './App'
import {Button} from './Button'
import {CreateItemForm} from './CreateItemForm'
import {EditableSpan} from './EditableSpan'

type Props = {
  todolist: Todolist
  tasks: Task[]
  deleteTask: (todolistId: string, taskId: string) => void
  changeFilter: (todolistId: string, filter: FilterValues) => void
  createTask: (todolistId: string, title: string) => void
  changeTaskStatus: (todolistId: string, taskId: string, isDone: boolean) => void
  deleteTodolist: (todolistId: string) => void
  changeTaskTitle: (todolistId: string, taskId: string, title: string) => void
  changeTodolistTitle: (todolistId: string, title: string) => void
}

export const TodolistItem = (props: Props) => {
  const {
    todolist: {id, title, filter},
    tasks,
    deleteTask,
    changeFilter,
    createTask,
    changeTaskStatus,
    deleteTodolist,
    changeTaskTitle,
    changeTodolistTitle,
  } = props

  const changeFilterHandler = (filter: FilterValues) => {
    changeFilter(id, filter)
  }

  const deleteTodolistHandler = () => {
    deleteTodolist(id)
  }

  const changeTodolistTitleHandler = (title: string) => {
    changeTodolistTitle(id, title)
  }

  const createTaskHandler = (title: string) => {
    createTask(id, title)
  }

  return (
      <div>
        <div className={'container'}>
          <h3>
            <EditableSpan value={title} onChange={changeTodolistTitleHandler} />
          </h3>
          <Button title={'x'} onClick={deleteTodolistHandler}/>
        </div>
        <CreateItemForm onCreateItem={createTaskHandler}/>
        {tasks.length === 0 ? (
            <p>Тасок нет</p>
        ) : (
            <ul>
              {tasks.map(task => {
                const deleteTaskHandler = () => {
                  deleteTask(id, task.id)
                }

                const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
                  const newStatusValue = e.currentTarget.checked
                  changeTaskStatus(id, task.id, newStatusValue)
                }

                const changeTaskTitleHandler = (title: string) => {
                  changeTaskTitle(id, task.id, title)
                }

                return (
                    <li key={task.id} className={task.isDone ? 'is-done' : ''}>
                      <input type="checkbox" checked={task.isDone}
                             onChange={changeTaskStatusHandler}/>
                      <EditableSpan value={task.title} onChange={changeTaskTitleHandler} />
                      <Button title={'x'} onClick={deleteTaskHandler}/>
                    </li>
                )
              })}
            </ul>
        )}
        <div>
          <Button className={filter === 'all' ? 'active-filter' : ''}
                  title={'All'}
                  onClick={() => changeFilterHandler('all')}/>
          <Button className={filter === 'active' ? 'active-filter' : ''}
                  title={'Active'}
                  onClick={() => changeFilterHandler('active')}/>
          <Button className={filter === 'completed' ? 'active-filter' : ''}
                  title={'Completed'}
                  onClick={() => changeFilterHandler('completed')}/>
        </div>
      </div>
  )
}
