from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.models.task import RunStatus
from typing import Optional

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: RunStatus = RunStatus.PENDING

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[RunStatus] = None

class RunStatusUpdate(BaseModel):
    status: RunStatus

class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    title: str
    description: Optional[str] = None
    status: RunStatus
    org_id: str
    created_by: str
    created_at: datetime
    updated_at: datetime
