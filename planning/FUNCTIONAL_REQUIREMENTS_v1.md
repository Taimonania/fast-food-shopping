# Fast Food Shopping App – Functional Requirements (v1)

## FR-A Authentication & User Account  
| ID | Requirement |
|----|-------------|
| FR-A1 | The system **shall** allow new users to register with *email + password* via Convex auth. |
| FR-A2 | The system **shall** validate email uniqueness and enforce a minimum 8-char password. |
| FR-A3 | The system **shall** support login/logout, issuing a session token (JWT or Convex session). |
| FR-A4 | The system **shall** persist user sessions across page refreshes (SSR + client). |
| FR-A5 | The system **shall** prevent unauthenticated access to any resource except `/login` and `/register`. |

## FR-L Shopping List  
| ID | Requirement |
|----|-------------|
| FR-L1 | The system **shall** display the authenticated user's current shopping list, sorted by the active supermarket's ordering (or unsorted if no ordering exists). |
| FR-L2 | The system **shall** allow adding an item with fields: **description (string, required), amount (string/number, optional)**. |
| FR-L3 | The system **shall** allow editing an item's description and amount in-place. |
| FR-L4 | The system **shall** allow deleting an item (hard delete). |
| FR-L5 | The system **shall** allow toggling an item to *Done*; done items visually separate but stay in list until manually cleared. |
| FR-L6 | The system **shall** store items in Convex with schema: `{userId, description, amount?, createdAt}`. |
| FR-L7 | The system **shall** persist list updates in ≤100 ms round-trip (Convex mutation). |

## FR-S Supermarket Ordering  
| ID | Requirement |
|----|-------------|
| FR-S1 | The system **shall** allow users to create, rename, and delete supermarkets. |
| FR-S2 | The system **shall** list all supermarkets owned by the user, ordered alphabetically. |
| FR-S3 | The system **shall** display the ordering screen for a selected supermarket, showing *all unique item descriptions* ever added by the user. |
| FR-S4 | The system **shall** enable drag-and-drop re-ordering of items; the new order **shall** persist instantly. |
| FR-S5 | The system **shall** allow adding previously un-ordered items into the supermarket ordering list via search or multi-select. |
| FR-S6 | The system **shall** store ordering as an array of item-IDs `{supermarketId, userId, order: string[]}` in Convex. |
| FR-S7 | The system **shall** apply the supermarket's ordering automatically to the Shopping List view (FR-L1). |

## FR-U UI/UX & Client-Side Behavior  
| ID | Requirement |
|----|-------------|
| FR-U1 | The UI **shall** be built with Next 15 (app router), TypeScript `strict`, Tailwind, and shadcn-ui components. |
| FR-U2 | The UI **shall** offer light/dark theme toggling; themes derive from shadcn tokens. |
| FR-U3 | All interactive operations (add/edit/delete/reorder) **shall** provide optimistic UI updates with rollback on failure. |
| FR-U4 | The mobile viewport (≤480 px) **shall** preserve core functionality with a bottom navigation bar: *List* | *Orderings* | *Settings*. |
| FR-U5 | ESLint with all existing rules **shall** pass with zero errors. |

## FR-P Performance & Reliability  
| ID | Requirement |
|----|-------------|
| FR-P1 | Initial page load **shall** render in ≤2 s over a 3G connection (using Next Image & code-splitting). |
| FR-P2 | All Convex queries **shall** return data within ≤150 ms p95 from EU region. |
| FR-P3 | The system **shall** handle 1 000 concurrent users with <1 s server response time p95. |

## FR-SEC Security  
| ID | Requirement |
|----|-------------|
| FR-SEC1 | All traffic **shall** be served over HTTPS. |
| FR-SEC2 | JWT/session cookies **shall** use `Secure`, `HttpOnly`, and `SameSite=Lax`. |
| FR-SEC3 | The API **shall** authorize every mutation/query against `userId`. |

## FR-TPL Template & Technology Stack
The system **shall** be built on an existing template that includes the following technologies:
- Next.js 15
- React 19
- TypeScript 5
- ESLint 9
- Prettier 3
- Tailwind CSS 4
- Shadcn UI
- App Directory
- System, Light & Dark Mode
- Next.js Bundle Analyzer
- Convex

---
**Out-of-Scope for v1:** collaborative lists, barcode scan, OCR receipt import, AI suggestions, offline mode, PWA install prompt, error logging with Sentry, logging app metrics.

```
