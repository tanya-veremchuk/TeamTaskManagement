import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { useOrganization } from '@clerk/clerk-react'
import TaskColumn from './TaskColumn'
import TaskForm from './TaskForm'
import { createTask, updateTask, deleteTask } from '../services/api'
import type { GetToken, Task, TaskInput, TaskStatus } from '../types'

const STATUSES: TaskStatus[] = ['pending', 'started', 'completed']

interface KanbanBoardProps {
  tasks: Task[]
  setTasks: Dispatch<SetStateAction<Task[]>>
  getToken: GetToken
}

function KanbanBoard({ tasks, setTasks, getToken }: KanbanBoardProps) {
  const { membership } = useOrganization()
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const role = membership?.role
  const canManage = role === 'org:admin' || role === 'org:editor'

  function getTasksByStatus(status: TaskStatus) {
    return tasks.filter((task) => task.status === status)
  }

  function handleEdit(task: Task) {
    setEditingTask(task)
    setShowForm(true)
  }

  async function handleDelete(taskId: string) {
    if (!window.confirm('Are you sure you want to delete this task?')) return

    const taskToDelete = tasks.find((t) => t.id === taskId)
    if (!taskToDelete) return

    setTasks((prev) => prev.filter((t) => t.id !== taskId))

    try {
      await deleteTask(getToken, taskId)
    } catch (err) {
      setTasks((prev) => [...prev, taskToDelete])
      console.error(err)
    }
  }

  async function handleSubmit(taskData: TaskInput) {
    if (editingTask) {
      const original = editingTask
      const updatedTask: Task = { ...original, ...taskData } as Task
      setTasks((prev) => prev.map((t) => (t.id === original.id ? updatedTask : t)))
      setShowForm(false)
      setEditingTask(null)

      try {
        await updateTask(getToken, original.id, taskData)
      } catch (err) {
        setTasks((prev) => prev.map((t) => (t.id === original.id ? original : t)))
        console.error(err)
      }
    } else {
      try {
        const newTask = await createTask(getToken, taskData)
        setTasks((prev) => [...prev, newTask])
        setShowForm(false)
      } catch (err) {
        console.error(err)
      }
    }
  }

  function handleCancel() {
    setShowForm(false)
    setEditingTask(null)
  }

  function handleAddTask() {
    setEditingTask(null)
    setShowForm(true)
  }

  return (
    <div className="kanban-wrapper">
      <div className="kanban-header">
        <h2 className="kanban-title">Tasks</h2>
        {canManage && (
          <button className="btn btn-primary" onClick={handleAddTask}>
            + Add Task
          </button>
        )}
      </div>

      <div className="kanban-board">
        {STATUSES.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={getTasksByStatus(status)}
            onEdit={canManage ? handleEdit : null}
            onDelete={canManage ? handleDelete : null}
          />
        ))}
      </div>

      {showForm && (
        <TaskForm task={editingTask} onSubmit={handleSubmit} onCancel={handleCancel} />
      )}
    </div>
  )
}

export default KanbanBoard