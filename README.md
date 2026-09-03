# 📸 Instagram Clone — Full Stack MERN Application

A full-stack Instagram Clone built using the MERN stack with authentication, posts, stories, reels, likes, profiles, follow/unfollow and media uploads.

🔗 **Live Demo:** https://instagram-1-lllp.onrender.com

🔗 **GitHub Repository:** https://github.com/asmitmishra234/Instagram

---

## 🚀 Features

### 🔐 Authentication
- User Registration
- User Login
- User Logout
- JWT Authentication
- HTTP-only Cookie Authentication
- Protected Routes
- Get Current User
- Password Hashing using bcrypt

### 👤 User Profile
- View Profile
- Edit Profile
- Update Username
- Update Bio
- Upload Profile Picture
- Followers / Following

### 📝 Posts
- Create Posts
- Upload Images
- View Feed
- Like / Unlike Posts
- Post Details
- User-specific Posts

### ❤️ Social Features
- Like / Unlike
- Follow / Unfollow
- Followers
- Following
- User Profiles

### 📖 Stories
- Create Stories
- Upload Story Media
- View Stories
- Story Feed

### 🎬 Reels
- Upload Reels
- Reel Feed
- Video Playback
- Reel Views

### ☁️ Media Upload
- ImageKit integration
- Multer for file handling
- Image and video uploads

### 📱 UI
- Instagram-inspired interface
- Responsive layout
- Mobile-friendly design
- Loading and error states

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- Axios
- React Router DOM

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt.js
- Cookie Parser
- CORS
- Multer

### Cloud / Services

- MongoDB Atlas
- ImageKit
- Render

---

## 📂 Project Structure

```text
Instagram/
│
├── Backend/
│   ├── controller/
│   ├── middleware/
│   ├── model/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
