import {v1} from 'uuid'
import type {Todolist} from '../App'
import {
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    createTodolistAC,
    deleteTodolistAC,
    todolistsReducer
} from './todolists-reducer'
import { beforeEach, expect, test } from 'vitest'

let todolistId1: string
let todolistId2: string
let startState: Todolist[] = []

beforeEach(() => {
    todolistId1 = v1()
    todolistId2 = v1()

    startState = [
        { id: todolistId1, title: 'What to learn', filter: 'all' },
        { id: todolistId2, title: 'What to buy', filter: 'all' },
    ]
})

test('correct todolist should be deleted', () => {
    const endState = todolistsReducer(startState, deleteTodolistAC(todolistId1))

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be created', () => {
    const title = 'New todolist'
    const endState = todolistsReducer(startState, createTodolistAC(v1(), title))

    expect(endState.length).toBe(3)
    expect(endState[2].title).toBe(title) // Проверяем title
    expect(endState[2].id).not.toBe(title) // ✅ Важно! Проверяем, что id НЕ равен title
    expect(typeof endState[2].id).toBe('string') // ✅ Проверяем, что id - это строка
    expect(endState[2].id).not.toBe('') // ✅ Проверяем, что id не пустой
})


test('correct todolist should change its title', () => {
    const title = 'New title'
    const endState = todolistsReducer(startState,
        changeTodolistTitleAC(todolistId2, title))

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(title)
})


test('correct todolist should change its filter', () => {
    const filter = 'completed'
    // Передаем два аргумента вместо одного объекта
    const endState = todolistsReducer(startState, changeTodolistFilterAC(todolistId2, filter))

    expect(endState[0].filter).toBe('all') // Первый todolist не должен измениться
    expect(endState[1].filter).toBe(filter) // Второй todolist должен иметь новый фильтр
})
