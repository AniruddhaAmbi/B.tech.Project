# To define the exact JSON request and response shapes expected by your frontend

from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ReportGenerateRequest(BaseModel):
    workspace_id: str
    dataset_id: str
    report_type: str  # "business_overview", "performance_report", "analysis_summary"
    query_context: Optional[str] = "Provide general business analysis based on latest data."

class MetricItem(BaseModel):
    label: str
    value: str
    trend: Optional[str] = None

class ReportResponse(BaseModel):
    id: Optional[str] = None
    workspace_id: str
    report_type: str
    title: str
    summary: str
    metrics: List[MetricItem]
    key_findings: List[str]
    recommendations: List[str]
    created_at: Optional[str] = None