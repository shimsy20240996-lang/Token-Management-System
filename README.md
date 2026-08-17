# Enterprise Smart Queue Management System

![Smart Queue Management](https://img.shields.io/badge/Status-Live-success) ![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Socket.IO-blue) ![UI UX](https://img.shields.io/badge/UX-Enterprise%20Telecom-06b6d4)

A modern, production-ready full-stack Queue Management System featuring an **Enterprise-grade Sri Lankan Telecom/Self-Service UI**. Designed for high-volume service centers (banks, telecom branches, hospitals), it eliminates physical waiting lines by providing a seamless, multilingual digital ticketing experience.

**[🔴 Live Demo (Hosted on Render)](https://token-management-system-ed5l.onrender.com)**

*(Note: The live demo uses a free Render tier, so the server may take ~50 seconds to wake up if it has been inactive!)*

---

## ✨ Key Features

* **💎 Premium Enterprise UI:** A pristine, high-contrast self-service kiosk interface inspired by top Sri Lankan telecom apps (Cyan to Deep Indigo gradients, crisp white floating cards, highly accessible typography).
* **🌍 Multilingual Interface:** Instant seamless translation between English, Sinhala (සිංහල), and Tamil (தமிழ்) using `i18next`.
* **⚡ Real-Time Architecture:** Powered by `Socket.IO`. When staff calls a token, the customer tracking pages and TV queue displays update instantly without page refreshes.
* **🎫 Digital E-Ticket & QR Tracking:** Customers can generate a beautiful digital receipt, save it as a downloadable image (PNG), and scan a QR code to track their queue status live on their mobile devices without needing an app.
* **📱 Twilio WhatsApp Integration:** Includes an `SmsService` configured for the Twilio WhatsApp Sandbox. Falls back gracefully to 'Simulator Mode' (console logging) if environment variables are not provided, ensuring uninterrupted operation.
* **📺 TV Queue Display:** A dedicated `/display` route meant for large monitors in waiting areas, complete with Text-to-Speech audio announcements.
* **🔐 Staff Dashboard:** Secure JWT-based authentication allowing staff to select their counter, view statistics, and call the next waiting customer.

---

## 🛠️ Technology Stack

**Frontend:**
* React 19 + TypeScript
* Vite & Tailwind CSS v4
* React Router DOM & React Query
* Socket.IO Client
* i18next (Internationalization)
* `html-to-image` & `qrcode.react` (E-Ticket generation)

**Backend:**
* Node.js + Express (TypeScript)
* Prisma ORM + SQLite (Easily swappable to PostgreSQL)
* Socket.IO
* JWT (JSON Web Tokens) & bcryptjs
* Twilio SDK (WhatsApp messaging)

---

## 🚀 How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/shimsy20240996-lang/Token-Management-System.git
cd Token-Management-System
```

### 2. Quick Start (Windows)
Run the provided build script which compiles the React app and moves it to the backend public folder:
```bash
.\build.bat
```
Then start the server:
```bash
cd backend
npm run start
```
The application will be running at `http://localhost:3000`

### 3. Development Mode
To run the frontend and backend separately with hot-reloading:

**Terminal 1 (Backend):**
```bash
cd backend
npm install
npx prisma db push    # Creates the SQLite database
npm run seed          # Creates default services and admin user
npm run dev           # Starts backend on localhost:3000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev           # Starts frontend on localhost:5173
```

---

## 🔑 Default Admin Credentials

To test the staff dashboard locally or on the live demo, use the default seeded credentials:

* **URL:** `/admin/login`
* **Email:** `admin@example.com`
* **Password:** `admin123`

---

## 🐳 Docker Deployment

This project includes a `Dockerfile` optimized for Render and similar PaaS providers. It utilizes a `node:20-slim` Debian-based image to ensure Prisma binaries function correctly. The multi-stage build compiles the Vite frontend and serves the entire full-stack application as a single lightweight container.

## 📝 License
MIT License
