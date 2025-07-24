import type {FilterValues, Task} from './App'
import {Button} from './Button'

type Props = {
  title: string,
  tasks: Task[],
  deleteTask: (taskId: string) => void,
    onClick?: () => void
    changeFilter: (filter: FilterValues) => void,
    createTask: () => void
}

export const TodolistItem = ({title, tasks, deleteTask, changeFilter, createTask }: Props) => {
  return (
      <div>
        <h3>{title}</h3>
        <div>
          <input/>
            <Button title={'+'} onClick={createTask} />
        </div>
        {tasks.length === 0 ? (
            <p>Тасок нет</p>
        ) : (
            <ul>
              {tasks.map(task => {
                return (
                    <li key={task.id}>
                      <input type="checkbox" checked={task.isDone} />
                      <span>{task.title}</span>
                        <Button title={'x'} onClick={() => deleteTask(task.id)} />
                    </li>
                )
              })}
            </ul>
        )}
        <div>
          <Button title={'All'} onClick={()=> changeFilter('all')} />
          <Button title={'Active'} onClick={()=> changeFilter('active')} />
          <Button title={'Completed'} onClick={()=> changeFilter('completed')} />
        </div>
      </div>
  )
}
