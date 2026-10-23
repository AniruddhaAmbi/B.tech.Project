from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class WorkspaceBase(BaseModel):
    name: str = Field(..., example="GreenLeaf Retail")
    description: Optional[str] = None

class WorkspaceCreate(WorkspaceBase):
    pass

class WorkspaceResponse(WorkspaceBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class DataSourceUploadResponse(BaseModel):
    file_id: str
    filename: str
    file_type: str
    status: str
    message: str

class DatasetQueryRequest(BaseModel):
    workspace_id: str
    dataset_name: str
    query: str