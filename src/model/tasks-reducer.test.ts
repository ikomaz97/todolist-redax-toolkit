import { beforeEach, expect, test } from 'vitest'
import type {TasksState} from '../App'
import {changeTaskStatusAC, createTaskAC, deleteTaskAC, tasksReducer} from "./tasks-reducer.ts";

let startState: TasksState = {}

beforeEach(() => {
    startState = {
        todolistId1: [
            {id: '1', title: 'CSS', isDone: false},
            {id: '2', title: 'JS', isDone: true},
            {id: '3', title: 'React', isDone: false},
        ],
        todolistId2: [
            {id: '1', title: 'bread', isDone: false},
            {id: '2', title: 'milk', isDone: true},
            {id: '3', title: 'tea', isDone: false},
        ],
    }
})



test('correct task should be deleted', () => {
    const endState = tasksReducer(
        startState,
        deleteTaskAC({ todolistId: 'todolistId2', taskId: '2' })
    )

    expect(endState).toEqual({
        todolistId1: [
            { id: '1', title: 'CSS', isDone: false },
            { id: '2', title: 'JS', isDone: true },
            { id: '3', title: 'React', isDone: false },
        ],
        todolistId2: [
            { id: '1', title: 'bread', isDone: false },
            { id: '3', title: 'tea', isDone: false },
        ],
    })
})


test('correct task should be created at correct array', () => {
    const endState = tasksReducer(
        startState,
        createTaskAC({
            todolistId: 'todolistId2',
            title: 'juice',
        })
    )

    expect(endState.todolistId1.length).toBe(3)         // список 1 не изменился
    expect(endState.todolistId2.length).toBe(4)         // в списке 2 стало на 1 задачу больше
    expect(endState.todolistId2[0].id).toBeDefined()    // id сгенерирован
    expect(endState.todolistId2[0].title).toBe('juice') // название совпадает
    expect(endState.todolistId2[0].isDone).toBe(false)  // новая задача не выполнена
})

test('correct task should change its status', () => {
    const endState = tasksReducer(
        startState,
        changeTaskStatusAC({ todolistId: 'todolistId2', taskId: '2', isDone: false })
    )

    // Проверяем, что статус изменился
    expect(endState.todolistId2[1].isDone).toBe(false)

    // Проверяем, что другие задачи остались неизменными
    expect(endState.todolistId2[0].isDone).toBe(false)
    expect(endState.todolistId2[2].isDone).toBe(false)
    expect(endState.todolistId1[1].isDone).toBe(true)
})