# Portfolio Backend
A full-stack CMS and portfolio backend system designed to manage personal content such as projects, publications, travel media, and portfolio data. Built as a learning-driven backend engineering project focused on real-world architecture patterns.

## 🚀 Overview
This project started as a simple CRUD API and evolved into a production-style backend system with authentication, caching, background jobs, RBAC, and CMS capabilities.

It powers a Vue-based portfolio frontend and includes a CMS dashboard for managing all content dynamically.

## Key Features
### 📦 Core CMS Features
- Manage projects, publications, and travel content
- Image and video support (Cloud storage integration)
- Drag & reorder items with persistent DB ordering
- Bulk delete with multi-select support
- Active / inactive toggles for content visibility
- Country-based filtering

---

### 🔐 Authentication & Authorization
- JWT-based authentication
- Refresh token rotation system
- Role-based access control (RBAC)
  - Admin: full access
  - Guest: read-only access

---

### ⚙️ Backend Architecture
- Layered architecture:
  - Controller layer
  - Service layer
  - Repository-style DB access (Mongoose)
- Dependency injection patterns (service-based structure)
- MVC-inspired structure with separation of concerns

---

### 🧵 Background Jobs & Queues
- Redis + BullMQ integration
- Asynchronous job processing for:
  - Password reset emails
  - Background tasks
- Job reliability and retry mechanisms

---

### 🗄️ Database
- MongoDB + Mongoose ODM
- Transactions using MongoDB sessions
- Replication set support for transactional consistency
- Seeder system using Faker.js
- Custom migration-like scripts (up/down pattern similar to Laravel)

---

### ⚡ Performance & Caching
- Redis caching layer
- Feature flags to enable/disable caching dynamically
- Cache invalidation strategies per entity

---

### 🛠️ Developer Tooling
- Custom CLI tools for database migrations
- Environment-based configuration (dev/prod switching)
- Script-based seeding and deployment workflows

---

### 🌐 Frontend Integration
- Vue.js frontend consuming backend APIs
- CMS dashboard using EJS + Bootstrap
- Dynamic rendering based on user roles

---

## 🧱 Tech Stack
### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Infra / Tools
- Redis
- BullMQ
- Render (deployment)
- Cloudinary (media storage)

### Frontend
- Vue.js
- EJS (CMS dashboard)
- Bootstrap

### Other
- JWT authentication
- Faker.js
- Custom CLI tooling

## 🧠 Key Engineering Concepts Used
- MVC + Service Layer architecture
- Dependency Injection
- Singleton patterns (service-level instances)
- Transactional database operations
- Queue-based async processing
- Feature flag systems
- Role-based authorization design
- Cache-aside pattern
- RESTful API design

---

## 🌍 Deployment

- Backend deployed on Render
- Frontend hosted separately
- MongoDB Atlas (production)
- Local MongoDB for development

---

## 📌 Notes
This project is intentionally built as a learning + production hybrid system, continuously improved to reflect real backend engineering practices.




