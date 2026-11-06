export type TaskStatus = 'pending' | 'started' | 'completed'

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  org_id: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface TaskInput {
  title: string
  description?: string | null
  status?: TaskStatus
}

export type GetToken = () => Promise<string | null>