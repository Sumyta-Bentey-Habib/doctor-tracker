# Doctor Tracker — Frontend

A responsive admin dashboard for managing doctors and patients, with authentication, searchable records, pagination, and dashboard analytics.

## Features

- **Admin authentication:** Secure login using JWT-based HTTP-only cookies.
- **Dashboard:** Overview of registered doctors and patients, patient registration trends, patients-per-doctor statistics, and recently registered patients.
- **Doctor management:** Create, view, update, delete, search, and filter doctor records.
- **Patient management:** Create, view, update, delete, search, and filter patient records.
- **Doctor–patient association:** Assign patients to doctors and display their associated doctor information.
- **Pagination:** Server-side pagination for doctor and patient records.
- **Responsive interface:** Layout designed for desktop, tablet, and mobile screens.

## Technology Stack

| Category | Technologies |
|---|---|
| Framework | Next.js 16, React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Charts | Recharts |
| Icons | Lucide React |
| API communication | Fetch API |
| Package manager | pnpm |

## Getting Started

### Prerequisites

- Node.js
- pnpm
- A running instance of the Doctor Tracker backend
- MongoDB Atlas or another configured MongoDB instance for the backend

### 1. Clone the repository

```bash
git clone https://github.com/Sumyta-Bentey-Habib/doctor-tracker.git
cd doctor-tracker
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create your local environment file:

```bash
cp .env.example .env.local
```

Configure the API URL in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Update the URL if your backend runs on a different host or port.

### 4. Start the backend

Follow the setup instructions in the backend repository:

[Doctor Tracker Backend](https://github.com/Sumyta-Bentey-Habib/care-guide-backend)

Make sure the backend is running and the initial admin account has been seeded.

### 5. Start the frontend

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Production build

Check TypeScript:

```bash
pnpm exec tsc --noEmit
```

Create a production build:

```bash
pnpm run build
```

## Application Routes

| Route | Description |
|---|---|
| `/login` | Admin login |
| `/` | Dashboard overview and analytics |
| `/doctors` | Doctor directory and management |
| `/patients` | Patient directory and management |

## System Architecture

The following diagram illustrates the high-level data flow, user authentication boundary, and communication between Next.js client layers and the backend service:

```text
┌─────────────────────────────────────────────────────────────┐
│                       Next.js App                           │
│ ┌─────────────────────────┐     ┌─────────────────────────┐ │
│ │  App Shell & Navigation │     │  AuthGuard (Middleware) │ │
│ └────────────┬────────────┘     └────────────┬────────────┘ │
│              │                               │              │
│              ▼                               ▼              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ UI Pages: /dashboard, /doctors, /patients, /login       │ │
│ └────────────────────────────┬────────────────────────────┘ │
│                              │                              │
│                              ▼                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Custom React Hooks (useDoctorList, usePatients, etc.)   │ │
│ └────────────────────────────┬────────────────────────────┘ │
│                              │                              │
│                              ▼                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Service Layer (doctorService, patientService, api.ts)   │ │
│ └────────────────────────────┬────────────────────────────┘ │
└──────────────────────────────┼──────────────────────────────┘
                               │ HTTPS / JSON REST
                               │ Credentials: 'include' (HTTP-only JWT Cookie)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Express REST API Server                     │
│               (http://localhost:5000/api)                   │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Auth Middleware (Cookie JWT Verification)               │ │
│ └────────────────────────────┬────────────────────────────┘ │
│                              │                              │
│                              ▼                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ REST Controllers: Auth, Doctors, Patients, Dashboard    │ │
│ └────────────────────────────┬────────────────────────────┘ │
│                              │                              │
│                              ▼                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ MongoDB Database (Indexed Collections & Aggregations)   │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Backend Integration

The frontend communicates with the Express REST API.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/logout` | Admin logout |
| GET | `/api/auth/me` | Verify authenticated session |
| GET | `/api/dashboard/stats` | Dashboard statistics & analytics |
| GET | `/api/doctors` | Retrieve doctors (search, filter, date-wise, paginate) |
| POST | `/api/doctors` | Create doctor |
| GET | `/api/doctors/:id` | Retrieve doctor details |
| PUT | `/api/doctors/:id` | Update doctor |
| DELETE | `/api/doctors/:id` | Delete doctor |
| GET | `/api/doctors/:doctorId/patients` | Retrieve patients assigned to a doctor |
| POST | `/api/doctors/:doctorId/patients` | Create patient under a doctor |
| DELETE | `/api/doctors/:doctorId/patients/:patientId` | Delete patient from doctor's list |
| GET | `/api/patients` | Retrieve patients (search, condition, date-wise, paginate) |
| GET | `/api/patients/:id` | Retrieve patient details |
| PUT | `/api/patients/:id` | Update patient |
| DELETE | `/api/patients/:id` | Delete patient |

Authenticated requests include credentials so the browser can send the HTTP-only authentication cookie.

## Project Structure

```text
doctor-tracker/
├── app/
│   ├── dashboard/
│   ├── doctors/
│   ├── patients/
│   ├── login/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── doctors/
│   ├── layout/
│   └── patients/
├── hooks/
├── lib/
│   └── api.ts
├── services/
├── types/
├── utils/
├── .env.example
├── package.json
└── README.md
```

## Technical Decisions

### 1. HTTP-only cookie-based authentication

JWT authentication is implemented using HTTP-only cookies rather than storing authentication tokens in local storage.

**Reasoning:**
- HTTP-only cookies cannot be accessed directly through client-side JavaScript.
- This reduces exposure to token theft through certain cross-site scripting attacks.
- The frontend sends credentials with API requests.
- The backend validates the session before allowing access to protected routes.

### 2. Server-side pagination and filtering

Doctor and patient records are retrieved through paginated API requests instead of loading the entire database into the browser.

**Reasoning:**
- Reduces the amount of data transferred per request.
- Avoids unnecessary client-side processing.
- Supports larger datasets more efficiently.
- Keeps search and filtering logic centralized in the backend.

## Visual Evidence

The application is structured to deliver an administrative experience matching the specification requirements:

- **Admin Login (`/login`):** Validates administrator credentials, stores the authentication cookie, and handles redirects.
- **Analytics Dashboard (`/`):** Summary statistics (total doctors, total patients), real-time Recharts visualizations (Registration Trends and Patient Distribution by Doctor), and recently registered patients table.
- **Doctor Directory (`/doctors`):** Multi-filter search (keyword, specialization, hospital, and creation date range), responsive records table with server pagination, and dedicated modal to view, add, and delete patients under each doctor.
- **Patient Records (`/patients`):** Search, condition filtering, creation date range filtering, and comprehensive CRUD dialogs.
- **Responsive Layout:** Adaptive sidebar and table design optimized for mobile, tablet, and desktop viewports.
