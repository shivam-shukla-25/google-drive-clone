# 📂 Google Drive Clone

A full-stack **Google Drive Clone** built with:

* ⚛️ React (Frontend)
* 🚀 Node.js + Express + Prisma (Backend)
* ☁️ Firebase Authentication
* 📦 Deployed seamlessly using **Vercel**

---

## 🌐 Live Demo

🔗 c

---

## 📁 Project Structure

```
google-drive/
├── api/                     # Backend (Express, Prisma, Firebase)
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── index.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   └── package.json
│
├── client/                  # Frontend (React)
│   ├── public/
│   ├── src/
│   └── package.json
│
├── vercel.json              # Unified Vercel config
└── README.md
```

---

## 🚀 Features

### ✅ Frontend (React)

* Login/Signup using Firebase Auth
* Upload, view, and rename files
* Create, rename, and navigate folders
* Responsive UI with clean layout

### ✅ Backend (Express + Prisma)

* REST APIs for managing folders and files
* Firebase Authentication Middleware
* File storage and retrieval
* Secure API endpoints

---

## 🔐 Authentication

* Uses **Firebase Authentication** (Email/Password login)

---

## 🔧 Tech Stack

| Area       | Tech Used                            |
| ---------- | ------------------------------------ |
| Frontend   | React, Axios, React Router, Tailwind |
| Backend    | Node.js, Express, Prisma, Multer     |
| Auth       | Firebase Authentication              |
| Storage    | Local uploads                        |
| Deployment | Vercel (both frontend + backend)     |

---

## 🛠️ Local Development

### Prerequisites

* Node.js ≥ 18
* Firebase project with:

  * Authentication (Email/Password enabled)
* `.env` files configured in both `backend/` and `frontend/`

### Environment Variables (Backend `.env`)

```

# Server
PORT=4000

# Firebase
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY=your-firebase-private-key

# Prisma
DATABASE_URL="file:./prisma/dev.db"

```

### 🔧 Backend Setup

```bash
cd api
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### ⚛️ Frontend Setup

```bash
cd client
npm install
npm run dev
```

---
.env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=



## 👥 Contributors

* Shivam shukla

