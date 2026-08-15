# Multilingual Smart Token Management System

![Smart Queue Management](https://img.shields.io/badge/Status-Live-success) ![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Socket.IO-blue)

A modern, production-ready full-stack Queue Management System designed to eliminate physical waiting lines. Customers can take digital tokens in their preferred language (English, Sinhala, Tamil), track their queue position in real-time, and receive simulated SMS notifications.

**[🔴 Live Demo (Hosted on Render)](https://token-management-system-ed5l.onrender.com)**

*(Note: The live demo uses a free Render tier, so the server may take ~50 seconds to wake up if it has been inactive!)*

---

## ✨ Features

* **🌍 Multilingual Interface:** Instant seamless translation between English, Sinhala (සිංහල), and Tamil (தமிழ்) using `i18next`.
* **⚡ Real-Time Architecture:** Powered by `Socket.IO`. When staff calls a token, the customer tracking pages and TV queue displays update instantly without page refreshes.
* **🎫 Digital Token Generation:** Atomic database transactions guarantee unique token generation across different service categories (e.g., Customer Service, Cashier, Payments).
* **📱 SMS Notification Abstraction:** Includes an `SmsService` layer. Currently set to 'Simulator Mode' for portfolio demonstration to avoid API charges, but can be connected to Twilio in 5 lines of code.
* **📺 TV Queue Display:** A dedicated `/display` route meant for large monitors in waiting areas, complete with Text-to-Speech audio announcements.
* **🔐 Staff Dashboard:** Secure JWT-based authentication allowing staff to select their counter, view statistics, and call the next waiting customer.

---

## 🛠️ Technology Stack

**Frontend:**
* React 19 + TypeScript
* Vite
* Tailwind CSS v4
* React Router DOM
* Socket.IO Client
* React Query
* i18next (Internationalization)

**Backend:**
* Node.js + Express
* TypeScript
* Prisma ORM
* SQLite (Easily swappable to PostgreSQL)
* Socket.IO
* JWT (JSON Web Tokens) & bcryptjs

---

## 🚀 How to Run Locally

If you want to run this application on your own machine:

### 1. Clone the repository
```bash
git clone https://github.com/shimsy20240996-lang/Token-Management-System.git
cd Token-Management-System
```

### 2. Quick Start (Windows)
Run the provided build script which compiles and serves the entire application on a single port:
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

This project includes a `Dockerfile` that uses multi-stage builds to compile the Vite frontend into static files, which are then served directly by the Express backend. This allows the entire full-stack application to be deployed as a single lightweight Docker container.

## 📝 License
MIT License
