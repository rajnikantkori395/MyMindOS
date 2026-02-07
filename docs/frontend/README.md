# Frontend Guide

This section documents conventions and architecture for the MyMindOS Next.js application.

## Goals
- Deliver responsive, accessible UI for capturing, browsing, and conversing with personal knowledge.
- Maintain clear separation between server state (API data) and client state (UI controls).
- Enable rapid iteration through component reuse and design tokens.

## Key Tools
- Next.js App Router with Server Components where beneficial.
- Tailwind CSS 4 utility-first styling.
- React Query for server state, Zustand for lightweight UI state.
- Framer Motion (optional) for transitions.

## Structure
- pp/ routes with nested layouts for auth/dashboard.
- components/ for shared UI primitives.
- eatures/ for domain-specific UI (memories, chat, tasks).
- lib/ for API clients, hooks, and utilities.

## Additional Docs
- [State Management](state-management.md)
- [UI Guidelines](ui/style.md)
