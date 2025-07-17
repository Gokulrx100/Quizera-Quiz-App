const express = require("express");
const helmet = require("helmet");
const http = require("http");
const cors = require("cors");
//wsServer
const wsServer = require("./ws/wsServer");
//Routes
const quizRouter = require("./routes/quiz");
const profileRouter = require("./routes/profile");
const authRouter = require("./routes/authRoutes");

const app = express();
app.use(helmet());

app.use(cors());
app.use(express.json());

app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/quiz", quizRouter);

const server = http.createServer(app);

wsServer(server);

server.listen(3000, () => {
  console.log("server running at port 3000");
});
