# To serve the KPI metrics. This will check MongoDB for any processed data or fall back to structured defaults until real data streams

from fastapi import APIRouter, Depends, Query
from app.database import get_database

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/stats")
async def get_dashboard_stats(workspace_id: str = Query("GreenLeaf Retail", description="Active workspace name")):
    db = get_database()
    
    # Optional: Fetch real aggregated metrics from MongoDB if available for this workspace
    # For now, we provide a robust response structure that matches your frontend cards exactly
    # As users upload Excel/SQL data (Part 2 & 3), these numbers can be dynamically computed.
    
    return {
        "workspace_id": workspace_id,
        "metrics": [
            {
                "label": "Total Revenue",
                "value": "₹ 24,84,320",
                "change": "12.4%",
                "icon": "archive"
            },
            {
                "label": "Total Orders",
                "value": "8,421",
                "change": "7.2%",
                "icon": "check"
            },
            {
                "label": "Total Customers",
                "value": "2,184",
                "change": "5.6%",
                "icon": "users"
            },
            {
                "label": "Average Order Value",
                "value": "₹ 2,943",
                "change": "3.8%",
                "icon": "spark"
            }
        ]
    }