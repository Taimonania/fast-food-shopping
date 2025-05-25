<PRD>

# Fast Food Shopping App – Product Requirements Document (PRD)

## 1. Introduction

This document defines the functional, technical, and design requirements for the development of the Fast Food Shopping App (version 1). The application will provide users with a convenient, efficient, and intuitive tool for creating, managing, and optimizing shopping lists specifically tailored for frequent supermarket visits.

## 2. Product overview

The Fast Food Shopping App enables users to maintain personalized shopping lists, organized by supermarket layouts, ensuring a streamlined shopping experience. Core functionalities include user authentication, shopping list management, supermarket-specific item ordering, and a responsive, performant user interface optimized for both desktop and mobile use.

## 3. Goals and objectives

* Provide seamless user registration, authentication, and secure access.
* Enable efficient creation, editing, deletion, and sorting of shopping list items.
* Allow supermarket-specific customization for efficient in-store navigation.
* Deliver a responsive UI experience with robust performance and reliability.
* Ensure secure data handling and privacy protection.

## 4. Target audience

* Regular grocery shoppers seeking an organized, efficient shopping experience.
* Users prioritizing convenience and speed, typically tech-savvy consumers aged 18-45.

## 5. Features and requirements

### 5.1 Authentication & user account (FR-A)

| ID    | Requirement                                                                     |
| ----- | ------------------------------------------------------------------------------- |
| FR-A1 | Allow new users to register with email and password via Convex auth.            |
| FR-A2 | Validate email uniqueness and enforce a minimum 8-character password.           |
| FR-A3 | Support login/logout functionality with session tokens (JWT or Convex session). |
| FR-A4 | Persist user sessions across page refreshes (SSR and client-side).              |
| FR-A5 | Restrict unauthenticated access to resources except `/login` and `/register`.   |

### 5.2 Shopping list (FR-L)

| ID    | Requirement                                                                                  |
| ----- | -------------------------------------------------------------------------------------------- |
| FR-L1 | Display user's shopping list sorted by active supermarket ordering.                          |
| FR-L2 | Add items with description (required) and amount (optional).                                 |
| FR-L3 | Allow in-place editing of item description and amount.                                       |
| FR-L4 | Support deletion of items (hard delete).                                                     |
| FR-L5 | Allow marking items as *Done*; maintain visual separation.                                   |
| FR-L6 | Store shopping list items in Convex with `{userId, description, amount?, createdAt}` schema. |
| FR-L7 | Persist updates within ≤100 ms round-trip (Convex mutation).                                 |

### 5.3 Supermarket ordering (FR-S)

| ID    | Requirement                                                                     |
| ----- | ------------------------------------------------------------------------------- |
| FR-S1 | Allow creation, renaming, and deletion of supermarkets.                         |
| FR-S2 | List supermarkets owned by the user, ordered alphabetically.                    |
| FR-S3 | Display ordering screen showing all unique user-added item descriptions.        |
| FR-S4 | Support drag-and-drop reordering of supermarket items with instant persistence. |
| FR-S5 | Allow addition of new items via search or multi-select.                         |
| FR-S6 | Store ordering as `{supermarketId, userId, order: string[]}` in Convex.         |
| FR-S7 | Automatically apply supermarket ordering to shopping list view.                 |

### 5.4 UI/UX & client-side behavior (FR-U)

| ID    | Requirement                                                                    |
| ----- | ------------------------------------------------------------------------------ |
| FR-U1 | UI built with Next 15, TypeScript strict mode, Tailwind, shadcn-ui components. |
| FR-U2 | Provide toggleable light/dark theme from shadcn tokens.                        |
| FR-U3 | Support optimistic UI updates with rollback on operation failure.              |
| FR-U4 | Mobile UI (≤480 px) to include bottom navigation: List, Orderings, Settings.   |
| FR-U5 | ESLint rules must pass without errors.                                         |

### 5.5 Performance & reliability (FR-P)

| ID    | Requirement                                                            |
| ----- | ---------------------------------------------------------------------- |
| FR-P1 | Initial page load ≤2 s on 3G connections (Next Image, code-splitting). |
| FR-P2 | Convex queries respond within ≤150 ms p95 (EU region).                 |
| FR-P3 | Support up to 1000 concurrent users with server response <1 s p95.     |

### 5.6 Security (FR-SEC)

| ID      | Requirement                                                  |
| ------- | ------------------------------------------------------------ |
| FR-SEC1 | Traffic served exclusively over HTTPS.                       |
| FR-SEC2 | JWT/session cookies set with Secure, HttpOnly, SameSite=Lax. |
| FR-SEC3 | All API mutations/queries authorized against userId.         |

## 6. User stories and acceptance criteria

### Authentication & user accounts

| ID     | User Story                                          | Acceptance Criteria                                              |
| ------ | --------------------------------------------------- | ---------------------------------------------------------------- |
| ST-101 | As a new user, I want to register an account        | Valid email required; password ≥8 chars; unique email validation |
| ST-102 | As a registered user, I want to log in/out securely | Successful login/logout; session token persistence across reload |

### Shopping list management

| ID     | User Story                                 | Acceptance Criteria                                 |
| ------ | ------------------------------------------ | --------------------------------------------------- |
| ST-201 | As a user, I can create shopping items     | Mandatory description field; optional amount        |
| ST-202 | As a user, I can edit item details quickly | Inline editing; data persists instantly (≤100 ms)   |
| ST-203 | As a user, I can delete unwanted items     | Item is permanently removed                         |
| ST-204 | As a user, I can mark items as done        | Items remain visible but separate from active items |

### Supermarket ordering

| ID     | User Story                                                       | Acceptance Criteria                                   |
| ------ | ---------------------------------------------------------------- | ----------------------------------------------------- |
| ST-301 | As a user, I can manage supermarket-specific lists               | Add, rename, delete supermarkets                      |
| ST-302 | As a user, I can arrange items in supermarket-specific order     | Drag-and-drop functionality; persistent ordering      |
| ST-303 | As a user, I can easily add items to a supermarket ordering list | Search or multi-select functionality; instant updates |

### Database management

| ID     | User Story                                                 | Acceptance Criteria                                  |
| ------ | ---------------------------------------------------------- | ---------------------------------------------------- |
| ST-401 | As the system, I reliably store shopping items             | Schema correctly implemented; instant data retrieval |
| ST-402 | As the system, I securely handle supermarket ordering data | Data schema correctly implemented and validated      |

## 7. Technical requirements / stack

* Next.js 15
* React 19
* TypeScript 5 (`strict` mode)
* ESLint 9 (zero-error enforcement)
* Prettier 3
* Tailwind CSS 4
* Shadcn UI
* App Directory with System, Light, and Dark Modes
* Next.js Bundle Analyzer
* Convex (backend service for data persistence and queries)

## 8. Design and user interface

* **Visual design:** Modern, minimalist aesthetic leveraging Tailwind CSS and shadcn UI.
* **Interaction:** Responsive, intuitive UI optimized for both desktop and mobile experiences.
* **Navigation:** Clear, simple bottom navigation for mobile users, providing quick access to core features (List, Orderings, Settings).
* **Themes:** User-selectable light/dark mode.

**Mobile-specific:**

* Bottom navigation includes quick access to shopping lists, supermarket ordering, and app settings.
* Prioritized readability and ease of interaction on smaller screens.

**Desktop-specific:**

* Optimized for productivity, detailed views, and efficient editing capabilities.

</PRD>
