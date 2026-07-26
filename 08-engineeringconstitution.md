# Kapsule Engineering Constitution

Purpose

This document defines how Kapsule is built.

Every engineering decision should reinforce:

Quality

Maintainability

Performance

Scalability

Consistency

Developer Experience

---

Core Stack

React

TypeScript

Vite

TailwindCSS

shadcn/ui

React Bits

Framer Motion

Lucide Icons

Supabase

React Hook Form

Zod

TanStack Query

React Router

---

Core Philosophy

Readable code over clever code.

Simple solutions over complex abstractions.

Composition over inheritance.

Small components over giant files.

Predictability over magic.

Performance by default.

Accessibility by default.

---

Architecture

Feature-first architecture.

Each feature owns:

components

hooks

services

types

utils

validation

No massive shared folder.

Keep ownership obvious.

---

Folder Structure

src/

app/

features/

components/

layouts/

hooks/

services/

types/

utils/

constants/

styles/

assets/

lib/

providers/

routes/

---

Component Rules

One responsibility.

One purpose.

One exported component.

Avoid giant components.

Prefer composition.

Maximum readability.

---

State Management

Local state first.

Context only when necessary.

Server state belongs to TanStack Query.

Never duplicate server state.

Avoid unnecessary global state.

---

API Layer

Every request goes through services.

Components never call Supabase directly.

Separate business logic.

Separate UI.

---

Validation

Every form uses Zod.

Never trust client input.

Validate everything.

---

Forms

React Hook Form only.

No uncontrolled complexity.

Reusable inputs.

Clear validation.

---

Error Handling

Graceful.

Consistent.

Human-readable.

Never expose stack traces.

---

Loading

Skeletons preferred.

Optimistic updates when appropriate.

Avoid blocking UI.

---

Performance

Lazy load routes.

Lazy load heavy components.

Memoize only when needed.

Avoid premature optimization.

---

Accessibility

Keyboard navigation.

ARIA labels.

Focus management.

Readable contrast.

Screen reader friendly.

Accessibility is mandatory.

---

Icons

Lucide only.

Consistent size.

Consistent stroke.

No mixed icon libraries.

---

Styling

Tailwind only.

No inline styles.

No CSS duplication.

Reusable utility classes.

Design tokens first.

---

Animations

Framer Motion only.

Respect Motion Constitution.

No decorative animation.

---

Naming

Descriptive.

Readable.

Predictable.

Avoid abbreviations.

Avoid generic names.

---

Types

Strong typing.

No unnecessary any.

Interfaces where appropriate.

Shared types centralized.

---

Security

Never expose secrets.

Environment variables only.

RLS enabled.

Authentication required where needed.

Validate permissions.

---

Database

Normalized.

Simple.

Predictable.

No unnecessary joins.

Meaningful naming.

---

Testing

Critical business logic tested.

Core flows tested.

Reusable utilities tested.

---

Git

Small commits.

Clear commit messages.

Feature branches.

Pull requests required.

---

Code Reviews

Readable.

Consistent.

Simple.

No hidden complexity.

---

Developer Experience

Fast startup.

Fast builds.

Fast HMR.

Minimal configuration.

Excellent documentation.

---

Final Rule

Future developers should immediately understand the codebase.

The code should feel as calm as the interface.