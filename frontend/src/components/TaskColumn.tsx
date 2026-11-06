import TaskCard from "./TaskCard";
import type { Task, TaskStatus } from '../types'

const STATUS_LABELS = {
    pending: "To Do",
    started: "In Progress",
    completed: "Done"
}

interface TaskColumnProps {
  status: TaskStatus
  tasks: Task[]
  onEdit: ((task: Task) => void) | null
  onDelete: ((taskId: string) => void) | null
}

function TaskColumn({status, tasks, onEdit, onDelete}: TaskColumnProps) {
    return <div className={"kanban-column"}>
        <div className={`kanban-column-header kanban-column-header-${status}`}>
            <h3 className={"kanban-column-title"}>{STATUS_LABELS[status]}</h3>
            <span className={"kanban-column-count"}>{tasks.length}</span>
        </div>
        <div className={"kanban-column-body"}>
            {tasks.map(task =>
                (<TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />))}
        </div>
    </div>
}

export default TaskColumn