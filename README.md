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

## Backend Integration

The frontend communicates with the Express REST API.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/logout` | Admin logout |
| GET | `/api/auth/me` | Verify authenticated session |
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/doctors` | Retrieve doctors |
| POST | `/api/doctors` | Create doctor |
| GET | `/api/doctors/:id` | Retrieve doctor details |
| PUT | `/api/doctors/:id` | Update doctor |
| DELETE | `/api/doctors/:id` | Delete doctor |
| GET | `/api/patients` | Retrieve patients |
| GET | `/api/doctors/:doctorId/patients` | Retrieve patients assigned to a doctor |
| POST | `/api/doctors/:doctorId/patients` | Create patient for a doctor |
| GET | `/api/patients/:id` | Retrieve patient details |
| PUT | `/api/patients/:id` | Update patient |
| DELETE | `/api/patients/:id` | Delete patient |

Authenticated requests include credentials so the browser can send the HTTP-only authentication cookie.

## Project Structure

```text
doctor-tracker/
├── app/
│   ├── doctors/
│   │   └── page.tsx
│   ├── patients/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── auth/
│       └── auth-guard.tsx
├── lib/
│   └── api.ts
├── public/
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

## Screenshots

Add screenshots of the completed application in the following directory:

```text
docs/
└── screenshots/
    ├── dashboard-desktop.png
    ├── doctors-desktop.png
    ├── patients-desktop.png
    └── dashboard-mobile.png
```

Once added, embed them below:

### Dashboard — Desktop

![Dashboard Desktop](docs/screenshots/dashboard-desktop.png)

### Doctor Management

![Doctor Management](docs/screenshots/doctors-desktop.png)

### Patient Management

![Patient Management](docs/screenshots/patients-desktop.png)

### Dashboard — Mobile

![Dashboard Mobile](docs/screenshots/dashboard-mobile.png)

## License

This project was developed as part of a technical assessment.
