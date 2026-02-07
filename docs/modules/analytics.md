# Analytics Module

## Purpose
Collect usage metrics, event telemetry, and product analytics to drive insights and monitor system health.

## Responsibilities
- Capture key user interactions (uploads, searches, chats).
- Aggregate metrics for dashboards (retention, engagement).
- Forward logs/metrics to external observability stack (Grafana, Sentry).

## Key Endpoints / Services
- AnalyticsService.track(event) – internal event ingestion.
- GET /analytics/summary – admin dashboard data.
- Webhook emitters to third-party analytics connectors.

## Data Models
- AnalyticsEvent: actor, type, payload, timestamp.
- MetricSnapshot: derived aggregates for dashboards.
- ExperimentAssignment: A/B testing metadata (future).

## Dependencies
- Consumes events from other modules via Nest event emitters or message bus.
- Uses TaskModule for scheduled report generation.
- Writes to dedicated analytics collections/warehouses (ClickHouse optional).

## Background Jobs
- Daily/weekly summary generation.
- Anomaly detection on key metrics.

## Security & Privacy
- Pseudonymize user identifiers where possible.
- Respect opt-out preferences and regulatory requirements (GDPR/CCPA).

## Observability
- Metrics about metrics: ingestion throughput, queue lag, error rates.
- Alerts for drops in usage or spikes in failures.

## TODOs / Open Questions
- Decide on warehouse solution (Mongo vs. dedicated columnar DB).
- Integrate product analytics platforms (PostHog, Amplitude) if needed.
- Define KPI dashboards for leadership.
