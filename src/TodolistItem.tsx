import type {Task} from './App'
import {Button} from './Button'

type Props = {
  title: string
  tasks: Task[]
}

export const TodolistItem = ({title, tasks}: Props) => {
  return (
      <div>
        <h3>{title}</h3>
        <div>
          <input/>
          <Button title={'+'} />
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
                    </li>
                )
              })}
            </ul>
        )}
        <div>
          <Button title={'All'} />
          <Button title={'Active'} />
          <Button title={'Completed'} />
        </div>
      </div>
  )
}
