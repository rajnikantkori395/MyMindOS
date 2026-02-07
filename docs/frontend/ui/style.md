# UI Style Guide

## Design Principles
- Clarity over complexity; prioritize readable information density.
- Dark/light theme support with accessible contrast ratios.
- Leverage Tailwind design tokens for spacing, typography, and colors.

## Components
- **Primitives:** buttons, inputs, badges, cards defined in components/ui/.
- **Layout:** responsive grid and flex utilities for dashboard sections.
- **Charts:** reuse charting wrapper (Recharts/Visx TBD) with shared palette.

## Typography
- Base font: Inter (or system fallback).
- Heading scale defined via Tailwind --font-size-xl tokens.
- Maintain consistent line-heights for readability.

## Colors
- Primary: brand accent for actions.
- Secondary: neutral tones for backgrounds and surfaces.
- Semantic colors for status (success, warning, danger) aligned with Tailwind config.

## Accessibility
- Focus states visible on all interactive elements.
- Use aria labels for complex components (charts, toggles).
- Provide keyboard navigation for modal/dialog interactions.

## Motion
- Keep animations subtle (<200ms) using Framer Motion.
- Reduce motion option for accessibility preferences.

## Asset Management
- Icons via phosphor/react or lucide-react (TBD) with consistent sizing.
- Illustrations stored under public/assets/ with optimized SVG/PNG.

## Future Work
- Establish design tokens exported via Tailwind config.
- Document component usage examples and Storybook (planned).
