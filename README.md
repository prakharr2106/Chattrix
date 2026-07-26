# 💬 Chattrix

A modern full-stack real-time chat application built with the MERN stack. Chattrix delivers fast, secure, and seamless messaging with real-time communication, media sharing, customizable themes, and a clean, responsive user interface.

---

## ✨ Features

- 💬 Real-Time One-to-One Messaging
- ⚡ Instant Communication with Socket.io
- 🔐 Secure Authentication using Clerk
- 🟢 Online User Presence Tracking
- 🖼️ Image & Video Sharing
- 📤 Media Uploads & Optimization with ImageKit
- 🎨 Light & Dark Mode
- 🌈 11 Beautiful Themes
- 🖌️ 13 Custom Chat Wallpapers
- ⌨️ Optional Keyboard Sound Effects
- 📱 Responsive UI for Desktop & Mobile
- 🛡️ Secure Backend with Express Middleware
- 🔔 Clerk Webhooks Integration
- ⏰ Automated Cron Jobs
- 🚀 Production-Ready MERN Architecture

---

## 🚀 Tech Stack

### Frontend

- React
- Tailwind CSS
- Hero UI
- Zustand
- Socket.io Client
- Axios
- React Router

### Backend

- Node.js
- Express.js
- MongoDB
- Socket.io
- Clerk
- ImageKit
- Mongoose
- Cron Jobs

### Deployment

- Frontend: Render
- Backend: Render
- Database: MongoDB Atlas

---

## 📂 Project Structure

```
Chattrix
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── lib
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── hooks
│   │   ├── store
│   │   ├── context
│   │   └── assets
│   └── vite.config.js
│
└── README.md
```

---

## 🧪 Environment Variables

### Backend (`/backend/.env`)

```env
PORT=<your_port>

NODE_ENV=<development_or_production>

MONGO_URI=<your_mongodb_connection_string>

CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
CLERK_SECRET_KEY=<your_clerk_secret_key>
CLERK_WEBHOOK_SIGNING_SECRET=<your_clerk_webhook_signing_secret>

IMAGEKIT_PRIVATE_KEY=<your_imagekit_private_key>

FRONTEND_URL=<your_frontend_url>
```

### Frontend (`/frontend/.env`)

```env
VITE_CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/<your-username>/Chattrix.git
cd Chattrix
```

### Install dependencies

Backend

```bash
cd backend
npm install
```

Frontend

```bash
cd frontend
npm install
```

### Configure Environment Variables

Create the `.env` files in both the **backend** and **frontend** directories using the variables listed above.

---

## ▶️ Running the Project

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm run dev
```

The application will be available at:

```
Frontend: http://localhost:5173
Backend:  http://localhost:3000
```

---

## 🎯 Key Highlights

- Real-time messaging powered by Socket.io
- Secure authentication with Clerk
- Image & video uploads using ImageKit
- Online/offline user status
- Responsive modern UI
- Multiple themes and wallpapers
- Production-ready folder structure
- Clean and scalable MERN architecture

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to your branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub!
