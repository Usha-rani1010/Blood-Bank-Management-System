# Blood Bank Management System — Project Progress & Audit

**Date of Audit**: October 9, 2026  
**Project**: Full-Stack Blood Bank Management System (Final-Year CSE Project)  
**Author**: Usha Rani (Pair-programmed with Antigravity AI)  

---

## 1. System Architecture Overview

The system is organized as a decoupled full-stack application:

* **Backend Service** (`blood-bank-management`):
  * **Framework**: Spring Boot (v4.1.0/Spring 7, running on OpenJDK 21 LTS).
  * **Database**: MySQL 9.6 (`bloodbank` database on port 3306), accessed via Spring Data JPA / Hibernate ORM with HikariCP connection pooling.
  * **Web Layer**: Spring Web MVC REST controllers on port 8082, Springdoc OpenAPI/Swagger (`/swagger-ui/index.html`).
  * **Security**: Spring Security with JJWT 0.12.6, BCrypt password hashing, stateless session policy (`STATELESS`), and `JwtAuthenticationFilter`.
  * **Authorization**: Explicit role-based access control (`ROLE_USER`, `ROLE_ADMIN`, `ROLE_SUPER_ADMIN`) enforced via HTTP route matchers and `@PreAuthorize`.
  * **Bootstrap**: `DataInitializer` automatically and securely provisions the initial Super Admin on first startup.

* **Frontend Client** (`blood-bank-frontend`):
  * **Framework & Build**: React 19 + Vite 8.
  * **Routing**: React Router DOM v7 (`BrowserRouter`, `Routes`, `Route`, `Navigate`).
  * **Styling**: Bootstrap 5.3 + custom CSS.
  * **API Client**: Axios instance targeting `http://localhost:8082` with request interceptor automatically attaching `Authorization: Bearer <token>` and response interceptor handling `401 Unauthorized`.
  * **State Management**: React Context API (`LanguageContext.jsx`) managing UI language persisted in `localStorage`.
  * **Auth State**: JWT token in `localStorage.getItem("token")` and sanitized user object in `localStorage.getItem("user")`, consumed by role-aware `ProtectedRoute.jsx` and `Navbar.jsx`.

---

## 2. Feature Audit & Status Matrix

| Module / Feature | Current Status | Verification Method | Notes & Findings |
| :--- | :--- | :--- | :--- |
| **Backend Startup & DB Connectivity** | Implemented and tested | Executed `mvnw.cmd test` & `spring-boot:run` | HikariCP connects to MySQL on port 3306. Donors, inventory, and requests active in DB. |
| **Frontend Production Build** | Implemented and tested | Executed `npm run build` | Vite build succeeds with 0 errors (100 modules). |
| **Dashboard API (`GET /api/dashboard`)** | Implemented and tested | Invoked via HTTP | Verified live counts: `{ totalDonors: 10, totalBloodUnits: 42, totalRequests: 10, pendingRequests: 4 }`. |
| **Donor List (`GET /api/donors`)** | Implemented and tested | Invoked via HTTP | Returns donors from MySQL. |
| **Donor Creation (`POST /api/donors`)** | Implemented and tested | Code inspected & controller verified | Bean validation active (`@NotBlank`, `@Min(18)`, `@Pattern(phone)`). |
| **Donor Update & Delete (`PUT`, `DELETE /api/donors/{id}`)** | Implemented and tested | Code inspected & controller verified | Basic CRUD works; deletion restricted to authorized staff. |
| **Blood Inventory List (`GET /api/inventory`)** | Implemented and tested | Invoked via HTTP | Returns 7 blood groups with available units. Public view enabled for search. |
| **Inventory Stock Addition / Merge** | Implemented and tested | Code inspected | Adds to existing units if blood group exists, else creates new row. Restricted to `ADMIN` & `SUPER_ADMIN`. |
| **Inventory Update & Delete (`PUT`, `DELETE /api/inventory/{id}`)** | Implemented and tested | Code inspected | Basic CRUD works; restricted to `ADMIN` & `SUPER_ADMIN`. |
| **Blood Request List (`GET /api/requests`)** | Implemented and tested | Invoked via HTTP | Returns requests with current statuses. |
| **Request Creation (`POST /api/requests`)** | Implemented and tested | Code inspected | Sets default status to "Pending". |
| **Request Approval & Inventory Deduction** | Implemented and tested | Code verified & updated | Deducts units when `Pending -> Approved`. Restores stock on `Approved -> (Pending | Rejected | Cancelled)` and upon deletion. |
| **User Registration (`POST /api/auth/register`)** | Implemented and tested | Tested via HTTP invocation | Enforces `USER` role. Tested privilege escalation attempt: payload with `role: "SUPER_ADMIN"` correctly forced to `USER`. |
| **User Login (`POST /api/auth/login`)** | Implemented and tested | Tested via HTTP invocation | Validates BCrypt hash, issues signed JJWT token containing subject, role, name, id. Returns `{ token, user }`. |
| **Server-Side Authorization & Roles** | Implemented and tested | Tested via HTTP invocation | Protected `/api/admin/**` verified: blocked regular `USER` with `403 Forbidden`. |
| **Super Admin Bootstrap** | Implemented and tested | Tested via server startup & DB query | `superadmin@bloodbank.org` provisioned securely on startup. |
| **Admin Provisioning by Super Admin** | Implemented and tested | Tested via HTTP invocation | Super Admin successfully created `Hospital Admin` (`ROLE_ADMIN`) via `/api/admin/create-admin`. |
| **Role-Aware Frontend Navigation & Protection** | Implemented and tested | Component & Route inspection | `ProtectedRoute.jsx` checks roles with access-denied state; `Navbar.jsx` displays role badges and conditional admin links. |
| **Language System (EN, TE, HI)** | Implemented and tested | Built & tested in UI | Trilingual translations (English, Telugu, Hindi) active across Dashboard, Donors, Inventory, Requests, Navigation, and Modals. |
| **Welcome / First-Visit Language Selection** | Implemented and tested | Component & Context verified | `WelcomeLanguageModal.jsx` displays on first visit with live greeting preview and persists selection in `localStorage`. Toggleable anytime via Navbar. |
| **Donor Blood-Group Certificate Verification** | Implemented and tested | Tested with live uploads & review | Multipart upload, secure file storage, verification state machine (`NOT_SUBMITTED`, `PENDING`, `UNDER_REVIEW`, `VERIFIED`, `REJECTED`, `RESUBMISSION_REQUIRED`), admin review modal, inline viewing, role security. |
| **Blood Issue / Dispatch Module** | In Progress (Phase 5) | In development | Dispatch tracking, linked blood requests, hospital receipt generation, stock deduction audit. |
| **Emergency Blood Request System** | Missing | Code inspected | Phase 6 priority: high urgency requests and rapid matching. |
| **Find Donor / Nearby Matching** | Missing | Code inspected | Phase 6 priority: privacy-preserving donor search. |
| **Blood Donation Camps** | Missing | Code inspected | Phase 7 priority: camp scheduling and user registration. |
| **Donation History & Official Records** | Missing | Code inspected | Phase 7 priority: verified donation ledger. |
| **In-App Notifications** | Missing | Code inspected | Phase 7 priority: user and admin alerts. |
| **Reports & Data Export (PDF/CSV/Excel)** | Missing | Code inspected | Phase 8 priority: operational reports and export. |
| **Audit Logs** | Missing | Code inspected | Phase 8 priority: immutable logging for sensitive actions. |

---

## 3. Completed in Phase 3 (Language-First UI: English, Telugu, Hindi)

1. **Trilingual Dictionary (`translations.js`)**:
   * Complete dictionary covering English (`en`), Telugu (`te`), and Hindi (`hi`) for 80+ keys.
   * Covers navigation, statistics, inventory statuses, action buttons, table headers, alert dialogs, and authentication terms.
2. **First-Visit Language Modal (`WelcomeLanguageModal.jsx`)**:
   * Beautiful healthcare-themed card modal presenting English, Telugu, and Hindi cards with regional script previews.
   * Automatically displays for new visitors (checks `hasChosenLanguage` flag in `localStorage`).
   * Provides immediate reactive preview of greetings in the selected language before confirming.
3. **Reactive Context & Persistence (`LanguageContext.jsx`)**:
   * Synchronizes language with `localStorage.getItem("app_lang")`.
   * Dynamic fallback logic ensures missing keys safely fall back to English without crashing.
4. **End-to-End Localization**:
   * `Navbar.jsx`: Trilingual selector (`English`, `తెలుగు`, `हिन्दी`), localized navigation links, auth buttons, and user roles.
   * `Dashboard.jsx`: Localized statistics cards, quick action buttons, inventory summaries, and recent requests table.
   * `Donors.jsx`: Localized table headers, search input, blood group filter, empty states, and action buttons.
   * `Inventory.jsx`: Localized stock statuses (`Available`, `Low Stock`, `Out of Stock`), search filters, units labels, and action buttons.
   * `Requests.jsx`: Localized request statuses (`Pending`, `Approved`, `Completed`, `Rejected`), table headers, filters, and action buttons.
5. **Build Verification**:
   * Successfully verified with `npm run build` (0 warnings, 0 errors, 562ms build time).

---

## 4. Completed in Phase 4 (Donor Verification & Document Upload)

1. **Secure File Storage (`FileStorageService.java`)**:
   * Sanitizes filenames and generates UUID-prefixed secure filenames.
   * Restricts MIME types to `application/pdf`, `image/jpeg`, and `image/png`.
   * Enforces 5 MB file size limit with clean error reporting.
   * Safely deletes replaced/orphan certificate files.
   * Streams files securely via `UrlResource` with `inline` Content-Disposition.
2. **Donor Verification State Machine**:
   * Enum `VerificationStatus`: `NOT_SUBMITTED`, `PENDING`, `UNDER_REVIEW`, `VERIFIED`, `REJECTED`, `RESUBMISSION_REQUIRED`.
   * Added audit columns to `donors` table: `verification_status`, `certificate_filename`, `certificate_original_filename`, `certificate_content_type`, `certificate_size`, `certificate_uploaded_at`, `verified_at`, `verified_by`, `rejection_reason`.
3. **REST Endpoints & Security Boundaries**:
   * `POST /api/donors/{id}/certificate`: Authenticated multipart upload, sets status to `PENDING`.
   * `GET /api/donors/{id}/certificate`: Authenticated secure download/viewing.
   * `PUT /api/donors/{id}/verification`: Admin/Super Admin only review endpoint. Automatically logs reviewer and timestamp.
   * `GET /api/donors/pending-verification`: Admin/Super Admin queue of donors awaiting review.
   * Route security and method security verified live: Regular `USER` attempt received `403 Forbidden`.
4. **Frontend Certificate Modal (`DonorCertificateModal.jsx`)**:
   * Displays donor details, declared blood group, and current verification status badge.
   * Live client-side file validation (size <= 5MB, accepted MIME types).
   * Document viewing via authenticated blob streaming in a separate secure window.
   * Staff decision controls for `ADMIN` and `SUPER_ADMIN` with mandatory rejection reasons.
5. **Donor Management Table Integration (`Donors.jsx`)**:
   * Verification filter dropdown (All, Verified, Pending Review, In Review, Rejected, Resubmit, Unverified).
   * Interactive verification status badge column with tooltips.
   * Direct "📋 Upload Proof" action button.
6. **Live End-to-End Verification**:
   * Uploaded test certificate via curl; verified status changed to `PENDING`.
   * Verified donor appeared in `/api/donors/pending-verification`.
   * Super Admin approved verification; verified status transitioned to `VERIFIED` and `verifiedBy: superadmin@bloodbank.org`.
   * Tested unauthorized user review: blocked with `403 Forbidden`.

---

## 5. Next: Phase 5 (Operations & Blood Issue Dispatch)

* Build `BloodIssue` entity tracking dispatched units, linked request ID, patient name, hospital, issue date, technician/admin name, and remarks.
* Atomic stock deduction endpoint (`POST /api/blood-issues/dispatch`) ensuring stock cannot be double-spent.
* Generate printable dispatch slip / hospital receipt with issue number, verification stamps, and recipient signatures.
* Frontend dispatch modal and dispatch ledger table.
