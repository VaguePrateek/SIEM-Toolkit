from fastapi import APIRouter
from storage.repository import (
    get_total_events,
    get_alert_count,
    get_event_distribution,
    get_risk_distribution,
    get_top_ports,
    get_top_source_ips,
    get_alert_pages,
    get_alerts,
    get_events,
    get_total_pages
)
from fastapi import Query
from api.schemas import LogRequest
from core.pipeline import process_log

router = APIRouter()


@router.post("/analyze")
def analyze_log(request: LogRequest):

    event = process_log(request.raw_log)

    return event.to_dict()

@router.get("/stats")
def get_stats():

    return {
        "total_events": get_total_events(),
        "total_alerts": get_alert_count(),
        "event_types": get_event_distribution(),
        "risk_levels": get_risk_distribution(),
        "top_source_ips": get_top_source_ips(),
        "top_ports": get_top_ports()
    }

@router.get("/events")
def list_events(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100)
):

    total_events, total_pages = get_total_pages(limit)

    return {
        "page": page,
        "limit": limit,
        "total_events": total_events,
        "total_pages": total_pages,
        "events": get_events(page, limit)
    }

@router.get("/alerts")
def list_alerts(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100)
):

    total_alerts, total_pages = get_alert_pages(limit)

    return {
        "page": page,
        "limit": limit,
        "total_alerts": total_alerts,
        "total_pages": total_pages,
        "alerts": get_alerts(page, limit)
    }