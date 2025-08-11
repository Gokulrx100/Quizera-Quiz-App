# 🎯 Quizera - Real-time Quiz Platform

<div align="center">

<!-- Hero SVG -->
<svg width="400" height="120" viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#dbeafe"/>
      <stop offset="100%" style="stop-color:#e0e7ff"/>
    </linearGradient>
  </defs>
  <rect width="400" height="120" fill="url(#bg)" rx="10"/>
  <text x="200" y="50" font-family="Arial" font-size="32" font-weight="bold" text-anchor="middle" fill="blue">Quizera </text>
  <text x="200" y="75" font-family="Arial" font-size="14" text-anchor="middle" fill="#6b7280">Interactive Real-time Quiz Platform</text>
  
  <!-- Feature Icons -->
</svg>

[![React](https://img.shields.io/badge/React-61dafb?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![WebSocket](https://img.shields.io/badge/WebSocket-00A1B0?style=flat&logo=websocket&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

</div>

---

## 📖 Table of Contents

- [🎮 User Experience](#-user-experience)
- [👨‍💻 Developer Guide](#-developer-guide)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📊 Database Schema](#-database-schema)
- [🔌 API Endpoints](#-api-endpoints)
- [🌐 WebSocket Events](#-websocket-events)
- [📱 Component Structure](#-component-structure)

---

## 🎮 User Experience

### 👥 For Quiz Participants

#### **Step 1: Join a Quiz Session**
```
1. Visit the platform → Click "Join Quiz"
2. Enter room code (e.g., "ABC123")
3. Provide your name
4. Wait for quiz to start
```

#### **Step 2: Answer Questions**
- **Real-time Questions**: Questions appear instantly when host sends them
- **Multiple Choice**: Select from 2-4 options per question
- **Time Pressure**: Each question has a countdown timer
- **Instant Feedback**: See if your answer was correct immediately

#### **Step 3: Track Performance**
- **Live Score**: Your points update in real-time
- **Leaderboard**: See your ranking among all participants
- **Final Results**: View comprehensive results at quiz end

### 👨‍🏫 For Quiz Creators

#### **Step 1: Create Your Quiz**
```
Dashboard → Create Quiz → Add Questions → Set Points → Save
```

#### **Step 2: Host Live Session**
```
Select Quiz → Start Session → Share Room Code → Control Flow
```

#### **Step 3: Manage Session**
- **Send Questions**: Control when each question appears
- **Monitor Responses**: See participant answers in real-time
- **View Analytics**: Track engagement and performance
- **End Session**: Display final leaderboard

---

## 👨‍💻 Developer Guide

### 🏗️ Architecture Overview

```mermaid
graph TB
    A[React Frontend] <--> B[WebSocket Client]
    B <--> C[WebSocket Server]
    C <--> D[Express API Server]
    D <--> E[PostgreSQL Database]
    
    F[Quiz Creator] --> A
    G[Quiz Participant] --> A
    
    subgraph "Frontend Components"
        H[Landing Page]
        I[Auth Pages]
        J[Quiz Editor]
        K[Admin Room]
        L[User Room]
    end
    
    subgraph "Backend Services"
        M[Authentication]
        N[Quiz Management]
        O[Room Management]
        P[Real-time Events]
    end
```

### 📁 Project Structure

```
quizera/
├── quiz-app/                # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── Common/     # Shared components
│   │   │   ├── QuizEditor/ # Quiz creation components
│   │   │   ├── AdminRoom/  # Host interface components
│   │   │   └── UserRoom/   # Participant components
│   │   ├── pages/          # Main page components
│   │   ├── Contexts/       # React contexts (Socket, Auth)
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # Utility functions
│   ├── public/
│   └── package.json
│
├── server/                  # Node.js Backend
│   ├── prisma/             # Database schema & migrations
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── websocket/      # WebSocket event handlers
│   │   └── utils/          # Server utilities
│   └── package.json
│
└── README.md
```

---

## 🛠️ Tech Stack

### **Frontend Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI framework with hooks |
| **React Router** | 6.x | Client-side routing |
| **WebSocket API** | Native | Real-time communication |
| **Tailwind CSS** | 3.x | Utility-first styling |
| **Axios** | 1.x | HTTP client |

### **Backend Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18.x | Runtime environment |
| **Express** | 4.x | Web framework |
| **Native WebSocket** | Built-in | WebSocket server |
| **Prisma** | 5.x | Database ORM |
| **PostgreSQL** | 15.x | Primary database |
| **JWT** | 9.x | Authentication tokens |

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ installed
- PostgreSQL 15+ running
- Git for version control

### **1. Clone Repository**
```bash
git clone https://github.com/yourusername/quizera.git
cd quizera
```

### **2. Backend Setup**
```bash
cd server
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database URL and JWT secret

# Initialize database
npx prisma migrate dev
npx prisma generate

# Start development server
npm run dev
```

### **3. Frontend Setup**
```bash
# In new terminal
cd ../quiz-app
npm install

# Start React development server
npm start
```

### **4. Environment Configuration**

**server/.env:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/quizera"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=3000
NODE_ENV="development"
```

**quiz-app/.env:**
```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_WS_URL=ws://localhost:3000
```

---

## 📊 Database Schema

### **Core Tables**

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role user_role DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Quizzes table
CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  creator_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Questions table
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  points INTEGER DEFAULT 1,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Options table
CREATE TABLE options (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
  text VARCHAR(255) NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE
);
```

### **Relationships**
```mermaid
erDiagram
    Users ||--o{ Quizzes : creates
    Quizzes ||--o{ Questions : contains
    Questions ||--o{ Options : has
    
    Users {
        int id PK
        string name
        string email UK
        string password
        enum role
        timestamp created_at
    }
    
    Quizzes {
        int id PK
        string title
        int creator_id FK
        timestamp created_at
        timestamp updated_at
    }
    
    Questions {
        int id PK
        int quiz_id FK
        text text
        int points
        int order_index
        timestamp created_at
    }
    
    Options {
        int id PK
        int question_id FK
        string text
        boolean is_correct
    }
```

---

## 🔌 API Endpoints

### **Authentication Endpoints**
```http
POST /signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "USER"
}

Response: {
  "token": "jwt_token_here",
  "user": { "id": 1, "name": "John Doe", "role": "USER" }
}
```

```http
POST /signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}

Response: {
  "token": "jwt_token_here",
  "userId": 1,
  "name": "John Doe",
  "role": "USER"
}
```

### **Quiz Management Endpoints**
```http
GET /quiz/getall
Authorization: Bearer jwt_token_here

Response: {
  "quizzes": [
    {
      "id": 1,
      "title": "JavaScript Basics",
      "createdAt": "2024-01-01T00:00:00Z",
      "questions": [...]
    }
  ]
}
```

```http
POST /quiz
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "title": "React Fundamentals",
  "questions": [
    {
      "text": "What is JSX?",
      "points": 10,
      "options": [
        { "text": "JavaScript XML", "isCorrect": true },
        { "text": "Java Syntax Extension", "isCorrect": false }
      ]
    }
  ]
}
```

```http
GET /quiz/:id
Authorization: Bearer jwt_token_here

Response: {
  "id": 1,
  "title": "React Fundamentals",
  "questions": [...],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### **User Profile Endpoint**
```http
GET /profile
Authorization: Bearer jwt_token_here

Response: {
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

---

## 🌐 WebSocket Events

### **Room Management Events**

#### **Create Room (Admin)**
```javascript
// Client → Server
socket.send(JSON.stringify({
  type: "createRoom",
  quizId: 123
}));

// Server → Client
{
  type: "roomCreated",
  roomCode: "ABC123",
  quizId: 123
}
```

#### **Join Room (Participant)**
```javascript
// Client → Server
socket.send(JSON.stringify({
  type: "joinRoom",
  roomCode: "ABC123",
  name: "John Doe",
  userId: "user_123"
}));

// Server → Client
{
  type: "joinedRoom",
  roomCode: "ABC123",
  message: "Successfully joined room"
}
```

### **Quiz Flow Events**

#### **Send Question (Admin)**
```javascript
// Client → Server
socket.send(JSON.stringify({
  type: "nextQuestion",
  questionId: 456
}));

// Server → All Participants
{
  type: "newQuestion",
  question: {
    id: 456,
    text: "What is React?",
    options: [
      { id: 1, text: "Library" },
      { id: 2, text: "Framework" }
    ]
  },
  deadline: 1640995200000, // Unix timestamp
  duration: 30 // seconds
}
```

#### **Submit Answer (Participant)**
```javascript
// Client → Server
socket.send(JSON.stringify({
  type: "submitAnswer",
  questionId: 456,
  selectedOption: 1
}));

// Server → Client
{
  type: "answerResult",
  correct: true,
  score: 150,
  message: "Correct! +10 points"
}
```

#### **Show Leaderboard**
```javascript
// Server → All Clients
{
  type: "leaderboard",
  leaderboard: [
    { userId: "user_123", name: "John Doe", score: 150 },
    { userId: "user_456", name: "Jane Smith", score: 120 }
  ]
}
```

---

## 📱 Component Structure

### **Reusable Components Architecture**

```
components/
├── auth/                    # Authentication UI
│   ├── AuthBackground.jsx   # Glassmorphic background
│   ├── AuthHeader.jsx       # Title and subtitle
│   ├── FormInput.jsx        # Styled input fields
│   ├── SubmitButton.jsx     # Loading-aware button
│   ├── ErrorMessage.jsx     # Error display
│   └── AuthFooter.jsx       # Navigation links
│
├── Common/                  # Shared across app
│   ├── Navbar.jsx          # Navigation bar
│   ├── Loading.jsx         # Loading spinner
│   └── Leaderboard.jsx     # Score display
│
├── QuizEditor/             # Quiz creation
│   ├── QuizTitleInput.jsx  # Quiz title field
│   ├── QuestionCard.jsx    # Question editor
│   ├── QuestionOption.jsx  # Option editor
│   ├── QuizActions.jsx     # Action buttons
│   └── ErrorMessage.jsx    # Form validation
│
├── AdminRoom/              # Host interface
│   ├── ParticipantsList.jsx # Connected users
│   ├── QuestionSection.jsx  # Question control
│   └── QuestionCard.jsx     # Question display
│
└── UserRoom/               # Participant interface
    ├── RoomHeader.jsx      # Room info & score
    ├── QuizTimer.jsx       # Countdown timer
    └── QuestionCard.jsx    # Answer interface
```

### **Custom Hooks**

```javascript
// Socket management
import { useSocket } from '../Contexts/SocketContext';

// Timer functionality
import useQuizTimer from '../hooks/useQuizTimer';
import useTimerColors from '../hooks/useTimerColors';

// Answer submission
import useAnswerSubmission from '../hooks/useAnswerSubmission';

// Socket event handling
import useUserRoomSocket from '../hooks/useUserRoomSocket';
```

### **State Management Patterns**

#### **Socket Context Provider**
```javascript
// Contexts/SocketContext.jsx
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
```

#### **Component State Structure**
```javascript
// Typical quiz component state
const [quizState, setQuizState] = useState({
  currentQuestion: null,
  selectedOption: null,
  score: 0,
  timeLeft: 0,
  isTimeUp: false,
  hasSubmitted: false,
  leaderboard: []
});
```

---

## 🎨 Design System

### **Glassmorphic Theme**
```css
/* Core glassmorphic styles */
.glass-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.glass-overlay {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.4),
    rgba(255, 255, 255, 0.1)
  );
}
```

### **Color Palette**
```javascript
const colors = {
  primary: {
    50: '#f0f9ff',
    500: '#3b82f6',
    700: '#1d4ed8'
  },
  success: {
    500: '#10b981',
    100: '#d1fae5'
  },
  warning: {
    500: '#f59e0b',
    100: '#fef3c7'
  },
  danger: {
    500: '#ef4444',
    100: '#fee2e2'
  }
};
```

---

## 📱 Features

<div align="center">

| Feature | Description |
|---------|-------------|
| ⚡ **Real-time** | Live WebSocket communication |
| 🎨 **Modern UI** | Glassmorphic design with Tailwind |
| 🏆 **Competitive** | Live leaderboards and scoring |
| 📱 **Responsive** | Works on all devices |
| 🔐 **Secure** | JWT authentication |

</div>

---

## 🎯 Architecture

```
Frontend (React) ←→ WebSocket ←→ Server (Node.js) ←→ Database (PostgreSQL)
     ↓                 ↓              ↓                    ↓
• User Interface   • Real-time    • Room Management    • Quiz Storage
• State Management • Events       • Quiz Engine        • User Data
• Components       • Broadcasting • Authentication     • Scoring
```

---

## 🚀 Deployment Guide

### **Production Environment Setup**

#### **Backend Deployment (Railway/Heroku)**
```bash
# Build for production
npm run build

# Set production environment variables
DATABASE_URL=postgresql://prod_url
JWT_SECRET=production_secret
NODE_ENV=production
```

#### **Frontend Deployment (Vercel/Netlify)**
```bash
# Build React app
npm run build

# Set production environment variables
REACT_APP_API_URL=https://your-api.com
REACT_APP_WS_URL=wss://your-api.com
```

#### **Database Migration**
```bash
# Run migrations in production
npx prisma migrate deploy
npx prisma generate
```

---

## 🤝 Contributing

### **Development Workflow**
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Follow coding standards and add tests
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open Pull Request with detailed description

### **Code Style Guidelines**
- Use ESLint + Prettier for formatting
- Follow React best practices and hooks patterns
- Write meaningful component and variable names
- Add JSDoc comments for complex functions
- Maintain consistent file and folder structure

---

<div align="center">

**🎯 Built with passion for interactive learning and real-time collaboration**

• [⭐ Star this repo](https://github.com/Gokulrx100/Quizera-Quiz-App) 
• [🐛 Report Bug](https://github.com/Gokulrx100/Quizera-Quiz-App/issues) 
• [💡 Request Feature](https://github.com/Gokulrx100/Quizera-Quiz-App/issues)

</div>