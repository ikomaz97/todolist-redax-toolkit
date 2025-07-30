
import type { FilterValues, Task } from './App';
import { Button } from './Button';
import { CreateItemForm } from './CreateItemForm';
import {EditableSpan} from "./EditableSpan.tsx";

type Props = {
    title: string;
    tasks: Task[];
    deleteTask: (taskId: string) => void;
    changeFilter: (filter: FilterValues) => void;
    createTask: (id: string, title: string) => void; // ✅ fixed type
    changeTaskStatus: (taskId: string, isDone: boolean) => void;
    filter: FilterValues;
    id: string;
    changeTaskTitle: (todolistId: string, taskId: string, title: string) => void
    changeTodolistTitle: (todolistId: string, title: string) => void
};

export const TodolistItem = ({
                                 title,
                                 tasks,
                                 deleteTask,
                                 changeFilter,
                                 createTask,
                                 changeTaskStatus,
                                 filter,
                                 id,
                                 changeTaskTitle,
                                 changeTodolistTitle,

                             }: Props) => {
    const createTaskHandler = (title: string) => {
        createTask(id, title);
    };

    const changeTaskStatusHandler = (taskId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        changeTaskStatus(taskId, e.currentTarget.checked);
    };

    const changeTodolistTitleHandler = (title: string) => {
        changeTodolistTitle(id, title)
    }

    return (
        <div>
            <h3>
                <EditableSpan value={title} onChange={changeTodolistTitleHandler} />
            </h3>
            <CreateItemForm onCreateItem={createTaskHandler} />

            {tasks.length === 0 ? (
                <p>Тасок нет</p>
            ) : (
                <ul>
                    {tasks.map((task) => {
                        const deleteTaskHandler = () => deleteTask(task.id);

                        const changeTaskTitleHandler = (title: string) => {
                            changeTaskTitle(id, task.id, title)
                        }

                        return (
                            <li key={task.id} className={task.isDone ? 'is-done' : ''}>
                                <input type="checkbox" checked={task.isDone} onChange={changeTaskStatusHandler(task.id)}/>
                                <EditableSpan value={task.title} onChange={changeTaskTitleHandler} />
                                <Button title={'x'} onClick={deleteTaskHandler}/>
                            </li>
                        );
                    })}
                </ul>
            )}

            <div>
                <Button
                    className={filter === 'All' ? 'active-filter' : ''}
                    title="All"
                    onClick={() => changeFilter('All')}
                />
                <Button
                    className={filter === 'Active' ? 'active-filter' : ''}
                    title="Active"
                    onClick={() => changeFilter('Active')}
                />
                <Button
                    className={filter === 'Completed' ? 'active-filter' : ''}
                    title="Completed"
                    onClick={() => changeFilter('Completed')}
                />
            </div>
        </div>
    );
};