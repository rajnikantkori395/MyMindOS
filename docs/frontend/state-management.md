# State Management

## Strategy Overview
- **React Query** handles server state: fetching, caching, optimistic updates, and background refresh.
- **Zustand** manages UI state: modals, filters, layout preferences, ephemeral selections.
- **Context Providers** wrap app root for auth session and theme management.

## Data Fetching Guidelines
- Co-locate query hooks near feature directories.
- Use useQuery for reads, useMutation for writes, with proper invalidation.
- Normalize API responses via shared TypeScript types from libs/shared (planned).

## Caching Policies
- Memories/search results: staleTime tuned to avoid excessive refetching.
- Chat sessions: keep live query per session, rely on streaming updates.
- Tasks/analytics: prefetch dashboards on navigation when possible.

## Zustand Stores
- useUiStore: toggles, theme, sidebar state.
- useComposerStore: tracks chat composer input, attachments.
- useMemoryFiltersStore: active tags, date ranges, sort order.

## Server Components
- Favor server components for data-heavy pages (dashboard) to reduce client bundle.
- Wrap interactive sections in client components with hydration boundaries.

## Error Handling
- Global error boundary per layout.
- Query-level error states with retry/backoff.
- Toast/notification system for mutation outcomes.

## Testing
- Use React Testing Library + MSW to mock queries.
- Snapshot critical Zustand stores to ensure default state integrity.

## Future Enhancements
- Integrate websocket-based query invalidation for real-time updates.
- Explore RSC streaming for chat once stable.
