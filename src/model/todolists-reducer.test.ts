import {v1} from 'uuid'
import type {Todolist} from '../App'
import {createTodolistAC, deleteTodolistAC, todolistsReducer} from './todolists-reducer'
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

