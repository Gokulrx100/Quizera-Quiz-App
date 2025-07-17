# 📚 Quiz App Backend

This is the backend for the Quiz App, providing REST API endpoints and real-time WebSocket communication.

---

## 🚀 Features

- **User Authentication** (Sign up, Sign in, JWT-based)
- **Quiz Management** (Create, Edit, Delete, Fetch quizzes and questions)
- **Profile Management**
- **Real-time Quiz Sessions** via WebSocket
- **Live Leaderboards and Instant Feedback**
- **Role-based Access** (Admin/User)
- **Security Headers** with Helmet
- **CORS Support**

---

## 🛠️ Tech Stack

- **Node.js** & **Express** — Server and routing
- **Prisma** — ORM for database access
- **WebSocket (ws)** — Real-time communication
- **Helmet** — Security headers
- **CORS** — Cross-origin resource sharing
- **bcrypt** — Password hashing
- **jsonwebtoken** — JWT authentication

---

## 📥 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/quiz-app.git
   cd quiz-app/backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up your database**

   - Configure your database connection in `prisma/schema.prisma`
   - Run migrations:
     ```bash
     npx prisma migrate dev
     ```

4. **Start the server**

   ```bash
   node logic.js
   ```

   The server will run at [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

backend/
├── prisma/
│ └── schema.prisma      # Prisma DB schema
├── routes/
│ ├── authRoutes.js      # Authentication endpoints
│ ├── profile.js         # Profile endpoints
│ └── quiz.js            # Quiz endpoints
├── ws/
│ ├── wsServer.js        # WebSocket server setup
│ └── wsHandlers.js      # WebSocket message handlers
├── logic.js             # Main server entry point
└── package.json

---

## 🔗 API Endpoints

### Authentication

- `POST /signup` — Register a new user
- `POST /signin` — Login and receive JWT

### Profile

- `GET /profile` — Get user profile (JWT required)
- `PUT /profile` — Update user profile

### Quiz

- `GET /quiz/getAll` — Fetch all quizzes
- `GET /quiz/:quizId` — Fetch quiz details and questions
- `POST /quiz/create` — Create a new quiz (Admin only)
- `PUT /quiz/:quizId` — Edit a quiz (Admin only)
- `DELETE /quiz/:quizId` — Delete a quiz (Admin only)

---

## 📡 WebSocket Events

- `createRoom` — Admin creates a quiz room
- `joinRoom` — User joins a quiz room
- `nextQuestion` — Admin sends next question
- `submitAnswer` — User submits an answer
- `answerResult` — Server sends answer feedback
- `leaderboard` — Server sends leaderboard updates
- `endQuiz` — Admin ends the quiz
- `roomClosed` — Server notifies room closure

---

## 🛡️ Security

- **Helmet** for HTTP headers
- **CORS** enabled for frontend communication
- **JWT** for authentication
- **bcrypt** for password hashing

---

## ⚡ Real-time Quiz Logic

- WebSocket server is initialized in `wsServer.js`
- Quiz rooms, questions, and answers are managed in-memory for live sessions
- Leaderboards and answer feedback are sent instantly to clients

---

## 👨‍💻 Development

- Edit `prisma/schema.prisma` for DB changes
- Use `npx prisma studio` to view/manage your database
- Update routes in `/routes` for REST API changes
- Update WebSocket logic in `/ws/wsHandlers.js` for real-time features

---

## 📄 Environment Variables

- Configure your database connection in `.env` for Prisma (see Prisma docs)
- JWT secret is hardcoded as `"123random"` (**change for production!**)

---

## 🐞 Troubleshooting

- **Port conflicts:** Make sure port `3000` is free
- **Database errors:** Check your Prisma setup and migrations
- **WebSocket issues:** Ensure frontend connects to `ws://localhost:3000`

---

## 📜 License

MIT License
