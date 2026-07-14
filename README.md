# ♻️ EcoRecycle - E-Waste Management System

EcoRecycle is a full-stack MERN application designed to simplify electronic waste management. The platform allows users to schedule e-waste pickups, earn reward points, and enables recycling agencies and administrators to manage pickup requests efficiently.

---

## 📌 Features

### 👤 User
- User Registration & Login
- JWT Authentication
- Create E-Waste Pickup Requests
- Upload Product Images
- View Pickup Status
- Reward Points System
- Pickup History

### 🏢 Agency
- Agency Login
- View Assigned Pickup Requests
- Update Pickup Status
- Manage Collection Process

### 👨‍💼 Admin
- Secure Admin Login
- Manage Users
- Manage Agencies
- Assign Pickup Requests
- Monitor Recycling Process
- Dashboard with Statistics

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Multer

### Database
- MongoDB

---

## 📂 Project Structure

```
EcoRecycle-Project
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── uploads
│   ├── utils
│   └── server.js
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Thilak28/EcoRecycle-Project.git
```

### Navigate to Project

```bash
cd EcoRecycle-Project
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run Backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

Application runs at:

```
http://localhost:3000
```

Backend runs at:

```
http://localhost:5000
```

---

## Authentication

The application uses:

- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes

---

## Main Modules

- User Authentication
- Pickup Management
- Reward Management
- Admin Dashboard
- Agency Dashboard
- Notifications
- Image Upload
- Pickup Tracking

---

## Future Enhancements

- Email Notifications
- SMS Notifications
- Live Pickup Tracking
- Payment Integration
- AI-based Waste Classification
- Analytics Dashboard

---

## Author

**Kaveri**

GitHub:
https://github.com/Thilak28

---

## License

This project is developed for educational purposes.
