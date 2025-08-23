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
The database schema has undergone a significant refactoring to move away from JSONB fields towards explicit relational models, enhancing data integrity, query capabilities, and type safety.

- `User`: id, name, email, password (hashed), role, isActive, createdAt.
  - **Relations:** createdPlannings, responsibleForPlannings, assignments, RefreshToken.
- `RefreshToken`: id, hashedToken (unique), userId, revoked, createdAt, updatedAt.
  - **Relations:** user.
- `OperationalFunction`: id, name (unique), description, category, isActive, createdAt, updatedAt.
  - **Relations:** assignments (many-to-many with PlanningAssignment).
- `Vehicle`: id, prefix (unique), type, model, capacity, isActive, createdAt, updatedAt.
  - **Relations:** medicalPlans, assignments.
- `Location`: id, name (unique), address, latitude, longitude, createdAt, updatedAt.
  - **Relations:** medicalPlansAsHospital, targets.
- `OperationalPlanning`: id, status, priority, peculiarities (String?), createdById, responsibleId, createdAt, updatedAt.
  - **Relations:** introduction (One-to-One), medicalPlan (One-to-One), createdBy (User), responsible (User), assignments (One-to-Many), scheduleItems (One-to-Many), targets (One-to-Many).
- `IntroductionSection`: id, serviceOrderNumber (unique), operationType, description, supportUnit, mandateType, operationDate, operationTime, planningId.
  - **Relations:** planning (OperationalPlanning).
- `PlanningTarget`: id, targetName, description (String?), locationId, planningId.
  - **Relations:** location (Location), planning (OperationalPlanning).
- `PlanningAssignment`: id, planningId, userId, vehicleId (String?), medicalPlanId (String?).
  - **Relations:** functions (Many-to-Many with OperationalFunction), medicalPlan, planning, user, vehicle.
- `PlanningScheduleItem`: id, time, activity, responsible, planningId.
  - **Relations:** planning (OperationalPlanning).
- `MedicalPlan`: id, procedures, planningId (unique), hospitalLocationId, ambulanceVehicleId.
  - **Relations:** ambulanceVehicle (Vehicle), hospitalLocation (Location), planning (OperationalPlanning), aphAssignments.


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
        *   `pages/api/auth/login.ts`: Now generates both a short-lived `accessToken` and a long-lived `refreshToken`. The `refreshToken` is hashed, stored in the new `RefreshToken` Prisma model, and set as an HTTP-only cookie. The `accessToken` is returned in the response body.
        *   `pages/api/auth/logout.ts`: Now revokes the `refreshToken` in the database and clears the `refreshToken` cookie.
        *   `pages/api/auth/session.ts`: No longer directly verifies JWT from cookies. It is now protected by the `authenticateToken` middleware, which attaches user information to the request.
    *   **Frontend Changes:**
        *   `contexts/auth-context.tsx`: Updated `login` to accept an `accessToken` and use a new `api` utility to fetch user session data. `logout` also uses the `api` utility. A new `useEffect` initializes authentication by attempting to refresh the token. Removed all `localStorage` usage.
        *   `components/login-form.tsx`: The direct `fetch` call to `/api/auth/login` is now handled here, managing `isLoading` and error states locally.
*   **Application-Wide Route Protection:**
    *   Implemented a robust route protection mechanism using `RouteGuard` and a new `ProtectedLayout` component.
    *   `components/auth/route-guard.tsx`: Modified to redirect unauthenticated users to `/login`.
    *   `components/auth/protected-layout.tsx` (NEW): A client component that wraps the application content in `app/layout.tsx` and conditionally applies `RouteGuard` to all routes except explicitly public ones (e.g., `/login`).
    *   `app/layout.tsx`: Updated to use `ProtectedLayout` to protect the entire application.
    *   `app/planejamento/[id]/page.tsx`: Removed redundant `RouteGuard` wrapper as protection is now handled by `ProtectedLayout`.
*   **Backend API Protection (Middleware):**
    *   `lib/auth-middleware.ts`: Created a reusable `authenticateToken` middleware to verify JWTs from the `Authorization` header (Bearer token). It now attaches `user: { id: string; role: string; }` to the request. Includes specific error handling for `jwt.TokenExpiredError` (returns 401) and other errors (returns 403).
    *   All API routes (`pages/api/functions`, `pages/api/plannings`, `pages/api/users`, `pages/api/vehicles`) are now wrapped with `authenticateToken(handler);` for protection.
*   **Centralized API Calls:**
    *   A new `api` utility (`@/lib/api`) has been introduced to centralize HTTP requests. This utility is now used across `lib/operational-functions.ts`, `lib/operational-planning-management.ts`, `lib/user-management.ts`, `lib/vehicles.ts`, and `hooks/use-planning-select-data.ts`, ensuring consistent authentication headers and error handling.

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

### 8.5 Data Management with TanStack Query & Optimistic UI

*   **Migration to TanStack Query:**
    *   Refactored all major CRUD pages (`app/funcoes/page.tsx`, `app/viaturas/page.tsx`, `app/usuarios/page.tsx`, `app/planejamento/page.tsx`) to use `useQuery` for data fetching and `useMutation` for all CUD (Create, Update, Delete) operations.
    *   Introduced `QueryClientProvider` at the application root (`app/layout.tsx`) for global state management.
    *   **Benefit:** Significantly reduced boilerplate code, improved readability, and centralized asynchronous state management.

*   **Comprehensive Optimistic UI Updates:**
    *   Implemented optimistic updates for **delete** operations across all CRUD pages. Items now disappear instantly upon user action.
    *   Implemented optimistic updates for **toggle status** (e.g., user active/inactive) on the `app/usuarios/page.tsx` page, providing immediate visual feedback.
    *   Implemented optimistic updates for **edit** operations across all CRUD pages. Changes are reflected instantly in the UI.
    *   Implemented optimistic updates for **create** operations across all CRUD pages. New items appear immediately in the list with a temporary ID and visual cue.
    *   **Mechanism:** Utilized `onMutate` to update the cache optimistically, `onError` for rollback, `onSuccess` for success notifications, and `onSettled` for query invalidation and final data synchronization.
    *   **Benefit:** Drastically improved perceived performance and user experience by providing instant feedback on user actions.

*   **Visual Polishing for Optimistic Items:**
    *   Modified relevant type definitions (`types/operational-planning.ts`, `types/auth.ts`) to include an `isOptimistic?: boolean` flag.
    *   Updated table row components (`components/planning/planning-table.tsx`, `components/user-management/user-table.tsx`, and directly in `app/funcoes/page.tsx`, `app/viaturas/page.tsx`) to apply a subtle visual cue (e.g., `opacity-50`) to optimistically created items until server confirmation.
    *   **Benefit:** Enhanced user clarity, indicating items that are still being processed by the server.

*   **Toaster Component Fix:**
    *   Corrected the implementation of `components/ui/toaster.tsx` to properly render toast notifications.
    *   **Benefit:** Ensured all application feedback messages are visible to the user.

### 8.6 Code Quality & DX Improvements

*   **Hook Dependency Management:**
    *   Fixed `lint/correctness/useExhaustiveDependencies` in `hooks/use-operational-planning-form.ts` by wrapping `mapPlanningToFormData` with `useCallback` (with an empty dependency array) and including it in the `useEffect`'s dependency array.
    *   Memoized `handleSubmit` in `components/planning/operational-planning-form-modal.tsx` using `useCallback` to prevent unnecessary re-renders.
*   **API Query Ordering:**
    *   Added `orderBy` clauses to `findMany` operations in several API routes (`pages/api/functions/index.ts`, `pages/api/plannings/index.ts`, `pages/api/users/index.ts`, `pages/api/vehicles/index.ts`) for better data presentation and user experience.
*   **Type Refinements:**
    *   Updated `vehicleId` in `components/planning/form-sections/functions-form-section.tsx` to `string | null` for more accurate type representation.

*   **Unique Element IDs with `useId()`:**
    *   **Problem:** Using static string literals for `id` attributes can lead to duplicate IDs when components are rendered multiple times, causing accessibility and functionality issues.
    *   **Solution:** Adopted `React.useId()` hook to generate unique, stable IDs for form elements and their associated labels. This ensures proper accessibility and avoids ID collisions.
    *   **Impact:** Improved accessibility and robustness of UI components, especially in forms.

### 8.7 Feature Enhancements & Refactoring

*   **"Socorristas" Field Automation & Display:**
    *   **Dynamic Population:** The "Socorristas" field in the "APH – Médico" section of the planning form is now automatically populated based on operators assigned the "APH" function in the "Quadro de Funções" tab.
    *   **Multi-Name Display:** The field now displays all names of operators with the "APH" function, concatenated into a single string (e.g., "Nome1, Nome2").
    *   **Data Structure Update:** `medical.medicId` in `types/operational-planning.ts` was updated from `string` to `string[]` to store IDs of all APH operators.
    *   **UI Enhancement:** In the planning form, the "Socorristas" field is now a read-only label that displays the names as `Badge` components for better visual clarity. A message is shown if no APH operator is defined.
    *   **PDF Reflection:** The `components/planning/operational-planning-pdf-view.tsx` was updated to display all APH medic names in a list format.

*   **Component Reusability for Planning Details:**
    *   **New Reusable Component:** Created `components/planning/operational-planning-display.tsx` to centralize the detailed display logic of an `OperationalPlanning` object.
    *   **Reduced Duplication:** Both `components/planning/operational-planning-detail-modal.tsx` and `app/planejamento/[id]/page.tsx` now utilize `OperationalPlanningDisplay`, reducing code duplication and ensuring consistent presentation.

*   **Navigation Improvements:**
    *   **"Back" Button:** Added a "Voltar" button to the `app/planejamento/[id]/page.tsx` (planning detail page) for easy navigation back to the planning list.
    *   **Direct Detail Navigation:** The "Ver" button in `components/planning/planning-table.tsx` (planning list) now directly navigates to the planning detail page (`/planejamento/[id]`) instead of opening a modal, streamlining the user flow.
    *   **Cleanup:** Removed unused state and modal components from `app/planejamento/page.tsx` related to the old detail modal.

### 8.9 Major Data Model Refactoring & Form Management Update

This is the most significant recent change, moving from a JSONB-heavy data model to a fully relational one, and revamping form management.

*   **Database Schema Transformation (Prisma):**
    *   **Problem:** Previous `OperationalPlanning` model relied heavily on JSONB fields (e.g., `introduction`, `targets`, `assignments`, `medical`, `peculiarities`, `routes`, `locations`, `schedule`, `complementaryMeasures`) for complex data structures. This approach limited data integrity, query flexibility, and type safety at the database level.
    *   **Solution:** All complex JSONB fields within `OperationalPlanning` have been extracted into dedicated, fully relational Prisma models:
        *   `IntroductionSection` (One-to-One with `OperationalPlanning`)
        *   `PlanningTarget` (One-to-Many with `OperationalPlanning`, One-to-One with `Location`)
        *   `PlanningAssignment` (One-to-Many with `OperationalPlanning`, Many-to-Many with `OperationalFunction`, One-to-One with `User`, One-to-One with `Vehicle`)
        *   `PlanningScheduleItem` (One-to-Many with `OperationalPlanning`)
        *   `MedicalPlan` (One-to-One with `OperationalPlanning`, One-to-One with `Location` for hospital, One-to-One with `Vehicle` for ambulance)
        *   `Location` (New standalone model for reusable location data)
    *   **Impact:** Enhanced data integrity (enforced by database constraints), improved query performance, better type safety across the stack, and a clearer representation of business entities.

*   **Form Management Overhaul (React Hook Form & Zod):**
    *   **Problem:** Previous form handling was largely manual with `useState` and custom logic, leading to boilerplate, potential for bugs (e.g., "uncontrolled to controlled input"), and less robust validation.
    *   **Solution:** The entire operational planning form (`OperationalPlanningFormModal` and its sub-sections) has been refactored to use `react-hook-form` with `zod` for schema validation.
        *   A comprehensive `zod` schema (`planningSchema`) now defines the structure and validation rules for the entire planning form data, mirroring the new relational database schema.
        *   `useForm` hook centralizes form state, validation, and submission logic.
        *   `useFieldArray` is used for dynamic lists (e.g., `targets`, `assignments`, `scheduleItems`), simplifying add/remove operations.
        *   `Controller` components are used for integrating UI library components (Shadcn/ui `Select`, `Input`, etc.) with `react-hook-form`.
    *   **Impact:** Reduced form boilerplate, centralized and robust validation, improved developer experience, and better performance due to optimized re-renders.

*   **API Routes Adaptation:**
    *   **Problem:** Existing API routes for plannings (`pages/api/plannings/index.ts`, `pages/api/plannings/[id].ts`) were designed for JSONB fields and simple CRUD.
    *   **Solution:** API routes for plannings have been significantly updated to handle the new relational data model:
        *   **Creation (POST):** Now uses nested `create` and `connectOrCreate` operations in Prisma to create the main `OperationalPlanning` record along with all its related entities (introduction, targets, assignments, schedule items, medical plan, locations).
        *   **Update (PUT):** Implements complex transaction logic (`prisma.$transaction`) to manage updates across multiple related tables. This often involves `upsert` for one-to-one relations (like `introduction`, `medicalPlan`) and `deleteMany` followed by `createMany` for one-to-many relations (like `targets`, `assignments`, `scheduleItems`) to ensure data synchronization.
        *   **Deletion (DELETE):** Now includes cascading deletes across related tables within a transaction to ensure all associated data is removed.
        *   **Fetching (GET):** All planning queries now use Prisma's `include` option to fetch the main planning record along with all its related nested data, providing a complete object to the frontend.
    *   **Impact:** Backend now fully supports the complex relational data model, ensuring data consistency and integrity during all CRUD operations.

*   **Frontend Component Adjustments:**
    *   **Form Sections:** `IntroductionFormSection`, `TargetsFormSection`, `FunctionsFormSection`, `ScheduleFormSection` were refactored to integrate seamlessly with `react-hook-form`.
    *   **New Component:** `components/planning/form-sections/details-form-section.tsx` was introduced to consolidate various details previously scattered or handled by the removed `ComplementaryFormSection`.
    *   **Removed Component:** `components/planning/form-sections/complementary-form-section.tsx` was deleted as its functionality was absorbed by the new relational structure and form management.
    *   **Display Components:** `OperationalPlanningDisplay` and `OperationalPlanningPDFView` were updated to correctly render data from the new relational structure, accessing properties directly from related objects rather than parsing JSONB.
    *   **Data Fetching Hooks:** `useOperationalPlanningForm` was completely rewritten to wrap `react-hook-form` and handle data mapping. `usePlanningSelectData` was extended to fetch `Location` data.
    *   **Type Definitions:** `types/operational-planning.ts` was completely revamped to reflect the new Prisma models and their relations, providing accurate type safety throughout the frontend.

*   **Prisma Accelerate Integration:**
    *   `lib/prisma.ts` was updated to include `@prisma/extension-accelerate`, indicating preparation for potential future use of Prisma Accelerate for improved database performance.

### 8.8 Bug Fixes & Data Integrity

*   **"Uncontrolled to Controlled Input" Error (Targets Tab):**
    *   **Problem:** Input fields for "coordenadas" and "descrição" in the Targets tab were causing React's "uncontrolled to controlled" error due to `undefined` initial values.
    *   **Solution:** Explicitly initialized `coordinates` and `description` to empty strings (`''`) in the `blankTarget()` helper function within `hooks/use-operational-planning-form.ts`.

*   **Hardcoded `responsibleName` on Planning Creation:**
    *   **Problem:** The `responsibleName` field was hardcoded to "TBD" when creating new plannings, instead of using the authenticated user's name. Additionally, plannings were being saved without an `id` due to an empty string being passed to Prisma.
    *   **Solution:**
        *   Modified `pages/api/plannings/index.ts` to fetch the authenticated user's name from the database and use it for `responsibleName`.
        *   Used an `omit` utility function (added to `lib/utils.ts`) in `app/planejamento/page.tsx` to ensure the `id` field is completely omitted when sending new planning data to the API, allowing Prisma to generate a UUID.
*   

