# 💰 Personal Finance Tracker

A full-stack Personal Finance Tracker that helps users manage income, expenses, budgets, and financial insights with a structured and scalable architecture.

---

## 🚀 Overview

This application allows users to:

- Track income and expenses  
- Categorize transactions  
- Set and monitor budgets  
- Generate financial reports  
- Authenticate securely using JWT  

The project follows a **clean architecture pattern** (Controller → Service → Repository), making it maintainable and scalable.

---

## 🔑 Demo Credentials

Use the following credentials to explore the application:

    Email: demo@example.com
    Password: DemoPassword123!

---

## 🧱 Tech Stack

### Frontend
- React (Vite)
- Context API
- Axios

### Backend
- Node.js
- Express.js
- Prisma ORM

### Database
- PostgreSQL

### Other Tools
- JWT Authentication
- Zod / Validation Middleware
- REST API

---

## 📁 Project Structure

    Personal-Finance-Tracker/
    │
    ├── frontend/
    │   ├── src/
    │   │   ├── pages/
    │   │   ├── context/
    │   │   ├── api/
    │
    ├── src/
    │   ├── controllers/
    │   ├── services/
    │   ├── repositories/
    │   ├── routes/
    │   ├── middlewares/
    │   ├── config/
    │   ├── utils/
    │
    ├── prisma/
    ├── .env.example

---

## ⚙️ Features

### 🔐 Authentication
- User registration and login  
- JWT-based authentication  
- Protected routes  

### 💸 Transactions
- Add, update, delete transactions  
- Categorize income and expenses  
- Filter and retrieve transactions  

### 📊 Budget Management
- Set budgets per category  
- Track spending against budget  

### 📈 Reports
- Financial summaries  
- Expense insights  
- Aggregated reports  

---

## 🧪 API Testing

API test cases are documented in:

    api_tests.md

---

## 🔧 Setup Instructions

### 1. Clone the Repository

    git clone <your-repo-url>
    cd Personal-Finance-Tracker

---

### 2. Setup Backend

    npm install

Create a `.env` file in the root directory:

    DATABASE_URL=your_database_url
    JWT_SECRET=your_secret
    PORT=5000

Run database migrations:

    npx prisma migrate dev

Start the backend server:

    npm run dev

---

### 3. Setup Frontend

    cd frontend
    npm install
    npm run dev

---

## 🌐 Deployment

- Backend: Render (`render.yaml`)
- Frontend: Vercel (`vercel.json`)

---


## 📌 Future Improvements

- Add unit and integration tests (Jest)  
- Add charts and analytics  
- Implement role-based access control (RBAC)  
- Add recurring transactions  
- Improve UI/UX  

---

## 🧠 Summary

This project demonstrates a structured full-stack application with proper separation of concerns. It is suitable for learning and portfolio use, but requires additional work to reach production-grade standards.
