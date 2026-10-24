# This endpoint receives the selected analysis type and returns structured metrics and chart data

from fastapi import APIRouter, Query

router = APIRouter(prefix="/api/analysis", tags=["Analysis"])

@router.get("/generate")
async def generate_analysis(
    workspace_id: str = Query("GreenLeaf Retail"),
    analysis_type: str = Query("overview") # overview, trends, products, customers
):
    # In a full run, this would query Pandas/MongoDB based on uploaded Excel/SQL data.
    # Here is a robust chart-ready structure for your frontend:
    
    if analysis_type == "overview":
        return {
            "title": "Business Performance Overview",
            "chart_type": "bar",
            "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            "datasets": [
                {"label": "Revenue (₹)", "data": [320000, 410000, 390000, 480000, 520000, 584320]}
            ],
            "summary": "Revenue has shown a steady upward trajectory with a 15% growth peak in Q2."
        }
    elif analysis_type == "trends":
        return {
            "title": "Monthly Growth Trends",
            "chart_type": "line",
            "labels": ["Week 1", "Week 2", "Week 3", "Week 4"],
            "datasets": [
                {"label": "Order Volume", "data": [1200, 1900, 1600, 2100]},
                {"label": "Customer Acquisition", "data": [300, 450, 400, 550]}
            ],
            "summary": "Spike in order volume during Week 4 corresponds to seasonal promotional campaigns."
        }
    elif analysis_type == "products":
        return {
            "title": "Top Performing Product Categories",
            "chart_type": "bar",
            "labels": ["Electronics", "Apparel", "Home & Kitchen", "Groceries"],
            "datasets": [
                {"label": "Sales Share (%)", "data": [45, 25, 20, 10]}
            ],
            "summary": "Electronics remain the primary revenue driver, accounting for nearly half of total sales."
        }
    else:  # customers
        return {
            "title": "Customer Segmentation by Value",
            "chart_type": "bar",
            "labels": ["High-Value", "Regular", "Occasional", "New"],
            "datasets": [
                {"label": "Customer Count", "data": [412, 850, 620, 302]}
            ],
            "summary": "High-value tier customers generate 60% of repeat orders."
        }