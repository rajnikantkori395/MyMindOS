# Deployment Guide

## Environments
- **Local Development:** Docker Compose for MongoDB, Redis, Qdrant, MinIO. Backend/frontend run via pnpm scripts.
- **Staging:** Frontend on Vercel, backend on AWS ECS Fargate, managed MongoDB Atlas, Redis Elasticache, Qdrant Cloud.
- **Production:** Hardened staging setup with autoscaling, CD pipelines, WAF, Secrets Manager.

## Prerequisites
- Container registry (ECR/GitHub Container Registry).
- Terraform or Pulumi scripts (future) to provision AWS infrastructure.
- CI/CD pipeline (GitHub Actions) with environment-specific workflows.

## Local Setup
1. Copy env templates and populate secrets.
2. Start infra: docker compose -f infra/docker/docker-compose.yml up.
3. Run backend and worker processes: pnpm run dev:backend and pnpm --filter backend start:worker (once worker implemented).
4. Start frontend: pnpm run dev:frontend.

## Staging Deployment Overview
- **Frontend:** pnpm --filter frontend build on CI → deploy to Vercel with environment variables.
- **Backend:** Build Docker image, push to registry, trigger ECS deployment using new task definition.
- **Database:** Use managed instances; apply migrations/seed scripts via CI job.
- **Secrets:** Stored in AWS Secrets Manager; injected via task definitions.

## Production Hardening Checklist
- Enable HTTPS everywhere (ACM certificates, CloudFront/CDN for frontend assets).
- Configure autoscaling policies for ECS services.
- Set up CloudWatch alarms + PagerDuty for critical metrics.
- Ensure S3 buckets enforce encryption, versioning, and access logging.
- Implement regular backups for MongoDB and vector store.
- Run security scans (Snyk, Dependabot, Trivy) in CI.

## Release Process
1. Merge PR into main with passing tests.
2. GitHub Actions builds artifacts, runs unit/e2e tests.
3. On success, deploy to staging automatically.
4. Manual QA sign-off triggers production workflow.
5. Post-deploy verification checklist for APIs, frontend, and monitoring.

## Rollback Strategy
- Maintain previous task definition revisions in ECS.
- Keep previous Vercel deployment alive until new deployment validated.
- Database migrations should be backwards compatible or feature-flag protected.

## Future Work
- Infrastructure-as-code templates in infra/terraform.
- Blue/green or canary deployment support.
- Automated load testing and chaos engineering practices.
