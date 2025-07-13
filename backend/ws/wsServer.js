const { WebSocketServer } = require("ws");
const handlers = require("./wsHandlers");

const wsServer = (server) => {
  const wss = new WebSocketServer({ server });
  const rooms = {};

  wss.on("connection", (socket) => {
    console.log("new webSocket client added");

    socket.on("message", async (msg) => {
      let data;
      try {
        data = JSON.parse(msg);
      } catch (err) {
        socket.send(JSON.stringify({ error: "Invalid JSON" }));
        return;
      }

      switch (data.type) {
        case "createRoom":
          handlers.handleCreateRoom(socket, data, rooms);
          break;
        case "joinRoom":
          handlers.handleJoinRoom(socket, data, rooms);
          break;
        case "nextQuestion":
          await handlers.handleNextQuestion(socket, data, rooms);
          break;
        case "submitAnswer":
          handlers.handleSubmitAnswer(socket, data, rooms);
          break;
        case "showLeaderboard":
          await handlers.handleShowLeaderboard(socket, data, rooms);
          break;
        case "endQuiz":
          handlers.handleEndQuiz(socket, data, rooms);
          break;
        default:
          socket.send(JSON.stringify({ error: "Unknown message type" }));
      }
    });

    socket.on("close", () => {
      handlers.handleDisconnect(socket, rooms);
    });
  });
};

module.exports = wsServer;
