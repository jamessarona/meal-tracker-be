# 🍱 APT Meal Tracker – Backend

This is the backend service for the APT Meal Tracker system built with:
- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- tsyringe for Dependency Injection

---

## 📦 Requirements

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [PostgreSQL](https://www.postgresql.org/) database
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- `.env` file with necessary environment variables

---

## 🚀 Getting Started

 1. Clone the Repository
    git clone {url}
    cd meal-tracker-be

 3. Install Dependencies
    npm install

 4. Initialize Prisma & Migrate the DB
    npx prisma generate
    npx prisma migrate dev --name init

 5. Start the Server
    npm run dev

##
```bash
