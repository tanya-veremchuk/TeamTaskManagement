import type { GetToken, Task, TaskInput } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function fetchWithAuth<T>(
  endpoint: string,
  getToken: GetToken,
  options: RequestInit = {},
): Promise<T> {
  const token = await getToken()
  if (!token) {
    throw new ApiError('Not authenticated', 401)
  }

  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const detail = body?.detail
    const message = typeof detail === 'string' ? detail : 'Request failed'
    throw new ApiError(message, response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export function getTasks(getToken: GetToken): Promise<Task[]> {
  return fetchWithAuth<Task[]>('/api/tasks', getToken)
}

export function createTask(getToken: GetToken, task: TaskInput): Promise<Task> {
  return fetchWithAuth<Task>('/api/tasks', getToken, {
    method: 'POST',
    body: JSON.stringify(task),
  })
}

export function updateTask(
  getToken: GetToken,
  taskId: string,
  task: TaskInput,
): Promise<Task> {
  return fetchWithAuth<Task>(`/api/tasks/${taskId}`, getToken, {
    method: 'PUT',
    body: JSON.stringify(task),
  })
}

export function deleteTask(getToken: GetToken, taskId: string): Promise<void> {
  return fetchWithAuth<void>(`/api/tasks/${taskId}`, getToken, {
    method: 'DELETE',
  })
}