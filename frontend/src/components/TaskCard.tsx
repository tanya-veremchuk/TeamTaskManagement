import type { Task } from '../types'

interface TaskCardProps {
  task: Task
  onEdit: ((task: Task) => void) | null
  onDelete: ((taskId: string) => void) | null
}

function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <div
      className={`task-card ${onEdit ? 'task-card-clickable' : ''}`}
      onClick={onEdit ? () => onEdit(task) : undefined}
    >
      <div className="task-card-header">
        <h4 className="task-card-title">{task.title}</h4>
        {onDelete && (
          <button
            className="task-card-btn task-card-btn-delete"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(task.id)
            }}
            title="Delete Task"
          >
            x
          </button>
        )}
      </div>
      {task.description && (
        <p className="task-card-description">{task.description}</p>
      )}
    </div>
  )
}

export default TaskCard