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

## 8. Recent Enhancements & Solutions

This section details significant improvements and solutions implemented recently.

### 8.1 Authentication & Authorization Refactor

*   **JWT-based Authentication with HTTP-only Cookies:**
    *   Migrated authentication from `localStorage` to secure JWTs stored in HTTP-only, `SameSite=Lax`, and `Secure` cookies.
    *   **Backend Changes:**
        *   `pages/api/auth/login.ts`: Now generates JWT and sets it as a cookie.
        *   `pages/api/auth/session.ts` (NEW): Endpoint to verify JWT from cookie and return authenticated user data.
        *   `pages/api/auth/logout.ts` (NEW): Endpoint to clear the JWT cookie.
    *   **Frontend Changes:**
        *   `contexts/auth-context.tsx`: Updated `login` to fetch user data from `/api/auth/session` and `logout` to call `/api/auth/logout`. `useEffect` now checks session via `/api/auth/session`. Removed all `localStorage` usage.
*   **Application-Wide Route Protection:**
    *   Implemented a robust route protection mechanism using `RouteGuard` and a new `ProtectedLayout` component.
    *   `components/auth/route-guard.tsx`: Modified to redirect unauthenticated users to `/login`.
    *   `components/auth/protected-layout.tsx` (NEW): A client component that wraps the application content in `app/layout.tsx` and conditionally applies `RouteGuard` to all routes except explicitly public ones (e.g., `/login`).
    *   `app/layout.tsx`: Updated to use `ProtectedLayout` to protect the entire application.
    *   `app/planejamento/[id]/page.tsx`: Removed redundant `RouteGuard` wrapper as protection is now handled by `ProtectedLayout`.
*   **Backend API Protection (Middleware):**
    *   `lib/auth-middleware.ts` (NEW): Created a reusable `authenticateToken` middleware to verify JWTs from cookies for protected API routes.
    *   `pages/api/plannings/[id].ts`: Applied `authenticateToken` middleware.
    *   `pages/api/plannings/index.ts`: Applied `authenticateToken` middleware.

### 8.2 Resolved Issues

*   **Login Redirection Failure:**
    *   **Problem:** After successful login, the user was not redirected to the main page.
    *   **Solution:** Added `router.push('/dashboard')` in `components/login-form.tsx` after successful authentication.
*   **Logout Token Persistence:**
    *   **Problem:** Upon logout, the JWT cookie remained active, allowing session persistence.
    *   **Solution:** Ensured consistent cookie attributes (`Domain`, `Secure`, `Path`, `SameSite`, `HttpOnly`) between the login (`pages/api/auth/login.ts`) and logout (`pages/api/auth/logout.ts`) API responses. The `Domain` attribute is now dynamically set using `req.headers.host`.

## 8.3 UI/UX Improvements

*   **Responsive Selects in "Quadro de Funções":**
    *   **Problem:** Select fields in the "Quadro de Funções" tab were overlapping and not responsive.
    *   **Solution:** Adjusted CSS classes to use `flex flex-wrap` on the container and `flex-grow min-w-0` on individual `SelectTrigger` components for better space distribution and responsiveness.
*   **Conditional "Função 2" Select:**
    *   **Problem:** "Função 2" select was not conditionally rendered based on "Função 1" selection, and validation errors were not user-friendly.
    *   **Solution:** Implemented conditional rendering for "Função 2" based on "Função 1" selection. Filtered "Função 2" options to exclude functions from the same category as "Função 1". Integrated `useToast` for user-friendly validation error messages.
*   **"Adicionar Operador" Button Text:**
    *   **Problem:** Button text was "Adicionar Função" instead of "Adicionar Operador".
    *   **Solution:** Changed button text to "Adicionar Operador".

## 8.4 Data Freshness & Display Consistency

*   **Form Not Updating on Edit:**
    *   **Problem:** Form fields were not reflecting saved changes after editing an existing planning.
    *   **Solution:** Ensured `editingPlanning` state in `app/planejamento/page.tsx` is updated with a new object reference (`JSON.parse(JSON.stringify())` followed by `parseDates`) after a successful update, forcing `useOperationalPlanningForm` to re-initialize.
*   **Viewing Modal Not Updating:**
    *   **Problem:** `OperationalPlanningDetailModal` was not showing updated information for functions after an edit.
    *   **Solution:** Updated `viewingPlanning` state in `app/planejamento/page.tsx` after an edit, similar to `editingPlanning`.
*   **Creator Name Display:**
    *   **Problem:** "Criado por" field in viewing modal and planning details page showed user ID instead of name.
    *   **Solution:** Added `getUserById` function to `lib/user-management.ts`. Fetched and displayed creator's name in `OperationalPlanningDetailModal` and `app/planejamento/[id]/page.tsx`.
*   **PDF Report Consistency:**
    *   **Problem:** PDF report did not reflect changes in "Quadro de Funções" (two functions per operator), creator name, or removal of "Frequência" field.
    *   **Solution:** Modified `components/planning/operational-planning-pdf-view.tsx` to:
        *   Display `assignedFunctions` correctly.
        *   Fetch and display creator's name.
        *   Remove the display of the "Frequência" field.
