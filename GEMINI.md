# Gemini Application Context

This document summarizes key information about the 'doe-planejamento' application to facilitate faster and more accurate assistance from the Gemini CLI.

## 1. Project Overview
- **Name:** doe-planejamento
- **Purpose:** Operational planning and management tool.
- **Key Features:**
    - User Management (CRUD)
    - Operational Planning (CRUD, PDF generation)
    - Functions Management (CRUD)
    - Vehicles Management (CRUD)
    - Authentication & Authorization (Role-based permissions)
    - Dashboard (implied, but not fully implemented yet)

## 2. Technology Stack
- **Frontend:** Next.js (App Router), React, TypeScript
- **UI/Styling:** Shadcn/ui (Radix UI, Tailwind CSS), Lucide React (icons), Recharts (charts)
- **Form Management:** React Hook Form, Zod (validation)
- **PDF Generation:** @react-pdf/renderer
- **Backend:** Next.js API Routes (Node.js environment)
- **Database:** PostgreSQL (local via Docker)
- **ORM:** Prisma
- **Authentication:** bcryptjs (password hashing)
- **Package Manager:** pnpm
- **Linting/Formatting:** Biome

## 3. Project Structure Highlights
- `app/`: Next.js App Router pages and routes.
- `components/`: Reusable React components (UI, specific features).
- `contexts/`: React Contexts (e.g., AuthContext).
- `hooks/`: Custom React Hooks.
- `lib/`: Business logic, data management functions (now integrated with API/Prisma).
- `pages/api/`: Next.js API Routes for backend operations.
- `prisma/`: Prisma schema, migrations, and seed file.
- `types/`: TypeScript type definitions.

## 4. Database Schema Overview (Prisma Models)
- `User`: id, name, email, password (hashed), role, createdAt, isActive.
- `OperationalFunction`: id, name (unique), description, category, isActive, createdAt, updatedAt.
- `Vehicle`: id, prefix (unique), type, model, capacity, isActive, createdAt, updatedAt.
- `OperationalPlanning`: id, introduction (JSONB), targets (JSONB), images (JSONB), assignments (JSONB), schedule (JSONB), communications (JSONB), peculiarities (JSONB), medical (JSONB), complementaryMeasures (JSONB), routes (JSONB), locations (JSONB), status, priority, createdBy, responsibleId, responsibleName, createdAt, updatedAt.

## 5. Recurring Issues & Solutions
- **"Maximum update depth exceeded" / Unstable Dependencies:** Often caused by unstable functions in `useEffect`/`useCallback` dependency arrays. Solution: Wrap functions in `useCallback` and ensure all dependencies (including `user` from `useAuth()`) are stable.
- **"Uncontrolled to controlled input" error:** Occurs when input `value` changes from `undefined` to defined. Solution: Initialize `useState` directly from props with default empty strings/values, avoiding `useEffect` for initial `formData` setup.
- **Prisma `upsert` `where` clause errors (TS2322):** Occurs when `where` clause uses non-unique fields. Solution: Ensure fields used in `where` for `upsert` are marked `@unique` in `prisma/schema.prisma` and run migrations.
- **`ts-node` module resolution for aliases:** `ts-node` doesn't resolve `tsconfig.json` path aliases by default. Solution: Use `tsconfig-paths/register` (e.g., `npx ts-node -r tsconfig-paths/register ...`).
- **Prisma `DATABASE_URL` issues (P2022):** Often due to `.env` not being loaded or server not restarted. Solution: Restart Next.js dev server.

## 6. Development Environment
- **Database:** Local PostgreSQL via Docker (port 5433).
- **Docker Compose:** `docker-compose.yml` defines the `db` service.
- **Seed Data:** `prisma/seed.ts` populates initial data. Run `npx ts-node prisma/seed.ts` or `pnpm install` (due to `postinstall` script).

## 7. Next Steps for Improvement (from previous memory)
1.  Implement mutations for creating, updating, and deleting data (largely done for Planning, Users, Functions, Vehicles).
2.  Improve error handling (ongoing).
3.  Add tests.
4.  Address the remaining security concern of the NEXT_PUBLIC_API_KEY (if applicable, not directly handled by me).
