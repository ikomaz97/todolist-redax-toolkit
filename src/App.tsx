import './App.css';
import { TodolistItem } from './TodolistItem';
import { useState } from 'react';
import { v1 } from 'uuid';

export type FilterValues = 'All' | 'Active' | 'Completed';

export type Task = {
    id: string;
    title: string;
    isDone: boolean;
};

type Todolist = {
    id: string;
    title: string;
    filter: FilterValues;
};

export const App = () => {
    // ✅ Стейт для тудулистов
    const [todolists, setTodolists] = useState<Todolist[]>([
        { id: v1(), title: 'What to learn', filter: 'All' }
    ]);

    // ✅ Стейт для задач (ключ - id тудулиста)
    const [tasks, setTasks] = useState<{ [key: string]: Task[] }>({
        [todolists[0].id]: [
            { id: v1(), title: 'HTML&CSS', isDone: true },
            { id: v1(), title: 'JS', isDone: true },
            { id: v1(), title: 'ReactJS', isDone: false }
        ]
    });

    // ✅ Добавление нового тудулиста
    const createTodolist = (title: string) => {
        const todolistId = v1();
        const newTodolist: Todolist = { id: todolistId, title, filter: 'All' };
        setTodolists([newTodolist, ...todolists]);
        setTasks({ ...tasks, [todolistId]: [] });
    };

    // ✅ Удаление задачи
    const deleteTask = (todolistId: string, taskId: string) => {
        setTasks({
            ...tasks,
            [todolistId]: tasks[todolistId].filter(task => task.id !== taskId)
        });
    };

    // ✅ Создание задачи
    const createTask = (todolistId: string, title: string) => {
        const newTask: Task = { id: v1(), title, isDone: false };
        setTasks({
            ...tasks,
            [todolistId]: [newTask, ...tasks[todolistId]]
        });
    };

    // ✅ Изменение статуса задачи
    const changeTaskStatus = (todolistId: string, taskId: string, isDone: boolean) => {
        setTasks({
            ...tasks,
            [todolistId]: tasks[todolistId].map(task =>
                task.id === taskId ? { ...task, isDone } : task
            )
        });
    };

    // ✅ Изменение фильтра для конкретного тудулиста
    const changeFilter = (todolistId: string, filter: FilterValues) => {
        setTodolists(
            todolists.map(tl => (tl.id === todolistId ? { ...tl, filter } : tl))
        );
    };

    return (
        <div className="app">

            <button onClick={() => createTodolist('New Todolist')}>+</button>

            <div style={{ display: 'flex', gap: '20px' }}>
                {todolists.map(tl => {
                    const filteredTasks =
                        tl.filter === 'Active'
                            ? tasks[tl.id].filter(task => !task.isDone)
                            : tl.filter === 'Completed'
                                ? tasks[tl.id].filter(task => task.isDone)
                                : tasks[tl.id];

                    return (
                        <TodolistItem
                            key={tl.id}
                            title={tl.title}
                            tasks={filteredTasks}
                            deleteTask={taskId => deleteTask(tl.id, taskId)}
                            changeFilter={filter => changeFilter(tl.id, filter)}
                            createTask={title => createTask(tl.id, title)}
                            changeTaskStatus={(taskId, isDone) => changeTaskStatus(tl.id, taskId, isDone)
                            }
                            filter={tl.filter}
                            id={tl.id}
                        />
                    );
                })}
            </div>
        </div>
    );
};