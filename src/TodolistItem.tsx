import type {FilterValues, Task} from './App'
import {Button} from './Button'
import {ChangeEvent, type KeyboardEvent, useState} from 'react'


type Props = {
    title: string,
    tasks: Task[],
    deleteTask: (taskId: string) => void,
    onClick?: () => void
    changeFilter: (filter: FilterValues) => void,
    createTask: (title: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean) => void
    filter: FilterValues,
    id: string
}

export const TodolistItem = ({title, tasks, deleteTask,
                                 changeFilter, createTask,
                                 changeTaskStatus, filter,}: Props) => {
    const [taskTitle, setTaskTitle] = useState('')
    const [error, setError] = useState<string | null>(null)

    const createTaskHandler = () => {
        const trimmedTitle = taskTitle.trim()
        if (trimmedTitle !== '') {
            createTask(trimmedTitle)
            setTaskTitle('')
        } else {
            setError('Title is required')
        }
    }

    const changeTaskTitleHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setTaskTitle(event.currentTarget.value)
        setError(null)
    }

    const createTaskOnEnterHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            createTaskHandler()
        }
    }

    const changeTaskStatusHandler = (taskId: string) => (e: ChangeEvent<HTMLInputElement>) => {
        changeTaskStatus(taskId, e.currentTarget.checked)
    }




    return (
        <div>
            <h3>{title}</h3>
            <div>
                <input className={error ? 'error' : ''}
                       value={taskTitle}
                       onChange={changeTaskTitleHandler}
                       onKeyDown={createTaskOnEnterHandler}/>

                <Button title={'+'} onClick={createTaskHandler}/>
                {error && <div className={'error-message'}>{error}</div>}
            </div>
            {tasks.length === 0 ? (
                <p>Тасок нет</p>
            ) : (
                <ul>
                    {tasks.map(task => {
                        const deleteTaskHandler = () => {
                            deleteTask(task.id)
                        }

                        return (
                            <li key={task.id} className={task.isDone ? 'is-done' : ''}>
                                <input type="checkbox" checked={task.isDone} onChange={changeTaskStatusHandler(task.id)} />
                                <span>{task.title}</span>
                                <Button title={'x'} onClick={deleteTaskHandler} />
                            </li>
                        )
                    })}
                </ul>
            )}
            <div>
                <div>
                    <Button className={filter === 'All' ? 'active-filter' : ''}
                            title={'All'}
                            onClick={() => changeFilter('All')}/>
                    <Button className={filter === 'Active' ? 'active-filter' : ''}
                            title={'Active'}
                            onClick={() => changeFilter('Active')}/>
                    <Button className={filter === 'Completed' ? 'active-filter' : ''}
                            title={'Completed'}
                            onClick={() => changeFilter('Completed')}/>
                </div>
            </div>
        </div>
    )
}