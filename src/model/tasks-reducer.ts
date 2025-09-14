import { createAction, createReducer, nanoid } from '@reduxjs/toolkit';
import type { TasksState } from '../app/App.tsx';

const initialState: TasksState = {};

// Action creators
export const deleteTaskAC = createAction<{todolistId: string;taskId: string;}>('tasks/deleteTask');
export const createTaskAC = createAction<{todolistId: string;title: string;}>('tasks/createTask');
export const changeTaskStatusAC = createAction<{todolistId: string;taskId: string;isDone: boolean;}>('tasks/changeTaskStatus');
export const changeTaskTitleAC = createAction<{todolistId: string;taskId: string;title: string;}>('tasks/changeTaskTitle');
export const createTodolistAC = createAction<{id: string;}>('tasks/createTodolist');
export const deleteTodolistAC = createAction<{id: string;}>('tasks/deleteTodolist');

// Reducer
export const tasksReducer = createReducer(initialState, builder => {
    builder
        // Удаление таски с помощью метода массива splice
        .addCase(deleteTaskAC, (state, action) => {
            const tasks = state[action.payload.todolistId];
            const taskId = action.payload.taskId;

            if (tasks) {
                // Находим индекс таски для удаления
                const index = tasks.findIndex(t => t.id === taskId);
                if (index !== -1) {
                    // Удаляем таску мутабельно с помощью splice
                    tasks.splice(index, 1);
                }
            }
        })
        // Создание таски с помощью метода массива unshift
        .addCase(createTaskAC, (state, action) => {
            const { todolistId, title } = action.payload;

            // Если тудулист не существует, создаем пустой массив для него
            if (!state[todolistId]) {
                state[todolistId] = [];
            }

            // Добавляем новую таску в начало массива с помощью unshift
            state[todolistId].unshift({
                id: nanoid(),
                title: title.trim(),
                isDone: false,

            });
        })
        // Изменение статуса таски с помощью метода массива find
        .addCase(changeTaskStatusAC, (state, action) => {
            const { todolistId, taskId, isDone } = action.payload;
            const tasks = state[todolistId];

            if (tasks) {
                // Находим таску с помощью find
                const task = tasks.find(t => t.id === taskId);
                if (task) {
                    // Мутабельно изменяем статус таски
                    task.isDone = isDone;
                }
            }
        })
        // Изменение названия таски с помощью метода массива find
        .addCase(changeTaskTitleAC, (state, action) => {
            const { todolistId, taskId, title } = action.payload;
            const tasks = state[todolistId];

            if (tasks) {
                // Находим таску с помощью find
                const task = tasks.find(t => t.id === taskId);
                if (task) {
                    // Мутабельно изменяем название таски
                    task.title = title.trim();
                }
            }
        })
        .addCase(createTodolistAC, (state, action) => {
            const { id } = action.payload;
            // Создаем пустой массив для нового тудулиста
            state[id] = [];
        })
        .addCase(deleteTodolistAC, (state, action) => {
            const { id } = action.payload;
            // Удаляем тудулист из состояния
            delete state[id];
        });
});