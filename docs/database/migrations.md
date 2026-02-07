# Migration Guidelines

## Tooling
- Prefer lightweight migration scripts written with Nest command line or standalone Node scripts using Mongoose.
- Evaluate migrate-mongo or umzug for structured migrations if complexity grows.

## Process
1. Design schema change and document impact.
2. Create migration script under pps/backend/src/migrations/ with up/down functions.
3. Test against local/dev databases using seed data.
4. Run migration in staging before production; verify dashboards and AI pipelines.

## Best Practices
- Favor additive changes; avoid destructive updates without backups.
- Use feature flags to guard code paths depending on new fields.
- Keep migrations idempotent where possible.
- Record migration metadata in schemaVersions collection.

## Rollback
- Provide down scripts that safely revert or compensate.
- For data migrations, export before re-running to prevent loss.

## Future Improvements
- Automate migrations in CI/CD with approval gates.
- Add lint rules or checklist to ensure docs updated with schema changes.
