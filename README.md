# 🔥 Random Threads

 to see project : https://random-threads-7.onrender.com/

An addictive anonymous social platform for Babcock University students to share thoughts and connect without fear of judgment.

## ✨ Features

- **🕵️ 100% Anonymous** - Share without revealing your identity
- **⚡ Real-time Updates** - Instant threads and replies
- **🔥 Upvote System** - Best content rises to the top
- **💬 Collapsible Replies** - Clean, organized conversations
- **🎨 Modern UI** - Addictive, engaging interface
- **📱 Responsive Design** - Works on all devices

## 🛠️ Tech Stack

- **Frontend:** React, Vite, CSS3
- **Backend:** Flask, SQLAlchemy
- **Database:** POSTGRESQL
- **Styling:** Custom CSS with animations

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- pip

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/random-threads.git
   cd random-threads
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   pip install flask flask-cors flask-sqlalchemy
   ```

4. **Start the Backend**
   ```bash
   python app.py
   ```
   The backend will run on `http://localhost:5000`

5. **Start the Frontend**
   ```bash
   cd ../frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

6. **Open your browser** and visit `http://localhost:5173`

## 📁 Project Structure

```
Random_Threads/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Intro/       # Landing page
│   │   │   └── Threads/     # Main threads component
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/                  # Flask backend
│   ├── app.py               # Main Flask application
│   └── threads.db           # SQLite database
├── .gitignore
└── README.md
```

## 🎯 API Endpoints

- `POST /api/threads` - Create a new thread
- `GET /api/threads` - Get all threads (paginated)
- `POST /api/threads/<id>/reply` - Add a reply to a thread
- `POST /api/threads/<id>/like` - Upvote a thread

## 🌟 Key Features

### Anonymous Sharing
- No registration required
- Optional usernames
- Complete privacy protection

### Interactive UI
- Smooth animations
- Hover effects
- Responsive design
- Dark theme with neon accents

### Community Features
- Upvote system for trending content
- Collapsible replies for better organization
- Real-time updates
- Thread sorting by popularity

## 🎨 Design Philosophy

- **Addictive UX** - Engaging animations and interactions
- **Anonymous Freedom** - Express yourself without fear
- **Community Driven** - Upvote system promotes quality content
- **Modern Aesthetics** - Dark theme with vibrant accents

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
npx vercel --prod
```

### Backend (Render/Railway)
- Deploy to Render.com or Railway.app
- Set environment variables
- Update frontend API calls to production URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔥 About

Random Threads is designed to provide a safe, anonymous space for students to share thoughts, connect with peers, and engage in meaningful conversations without the fear of judgment or identification.

---

**🔥 Random Threads - Where authenticity meets anonymity**


