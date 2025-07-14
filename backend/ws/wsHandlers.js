const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function handleCreateRoom(socket, data, rooms) {
  const { quizId } = data;
  let roomCode;
  do {
    roomCode = Math.floor(10000000 + Math.random() * 90000000).toString();
  } while (rooms[roomCode]);

  rooms[roomCode] = {
    admin: socket,
    clients: {},
    currentQuestion: null,
    submissions: {},
    quizId: quizId,
  };

  socket.role = "admin";
  socket.room = roomCode;

  let formattedCode = `${roomCode.slice(0, 4)} ${roomCode.slice(4)}`;
  socket.send(JSON.stringify({ type: "roomCreated", roomCode: formattedCode }));

  console.log(`Room ${formattedCode} created`);
}


function handleJoinRoom(socket, data, rooms) {
  const { roomCode, userId, name } = data;
  const room = rooms[roomCode];
  if (!room) {
    socket.send(JSON.stringify({ error: "Room not found" }));
    return;
  }

  if (room.submissions[userId]) {
    console.log(`User ${userId} is reconnecting`);
    room.admin.send(
      JSON.stringify({
        type: "userReconnected",
        userId,
        name: room.submissions[userId].name,
      })
    );
  } else {
    room.submissions[userId] = { answers: [], score: 0, name: name };
  }

  room.clients[userId] = socket;
  socket.role = "client";
  socket.room = roomCode;
  socket.userId = userId;

  socket.send(JSON.stringify({ type: "joinedRoom", roomCode }));

  if (room.currentQuestion) {
    socket.send(
      JSON.stringify({
        type: "newQuestion",
        question: {
          id: room.currentQuestion.id,
          text: room.currentQuestion.text,
          options: room.currentQuestion.options,
        },
      })
    );
  }

  const participantNames = Object.values(room.submissions).map((s) => s.name);

  room.admin.send(
    JSON.stringify({
      type: "participantUpdate",
      participants: participantNames,
    })
  );
}


async function handleNextQuestion(socket, data, rooms) {
  const room = rooms[socket.room];
  if (!room || socket.role != "admin") {
    return;
  }

  let question = await prisma.question.findFirst({
    where: { id: data.questionId },
    include: { options: true },
  });

  if (!question) {
    socket.send(JSON.stringify({ error: "Invalid question Id" }));
    return;
  }

  const correctOption = question.options.find((opt) => opt.isCorrect);

  if (!correctOption) {
    socket.send(JSON.stringify({ error: "No correct answer found" }));
    return;
  }

  const duration = 40 * 1000;
  room.currentQuestionDeadline = Date.now() + duration;

  room.currentQuestion = {
    id: question.id,
    correctOptionId: correctOption.id,
    points: question.points ?? 1,
    text: question.text,
    options: question.options.map((opt) => ({
      id: opt.id,
      text: opt.text,
    })),
  };

  Object.values(room.clients).forEach((client) => {
    client.send(
      JSON.stringify({
        type: "newQuestion",
        question: {
          id: question.id,
          text: question.text,
          options: room.currentQuestion.options,
        },
        deadline: room.currentQuestionDeadline,
        duration: duration / 1000,
      })
    );
  });
}


function handleSubmitAnswer(socket, data, rooms) {
  const room = rooms[socket.room];
  const userId = socket.userId;
  if (!room || socket.role != "client") {
    socket.send(JSON.stringify({ error: "Not authorized or room not found" }));
    return;
  }

  const { questionId, selectedOption } = data;

  if (!room.currentQuestion || room.currentQuestion.id !== questionId) {
    socket.send(JSON.stringify({ error: "Question mismatch" }));
    return;
  }

  if (Date.now() > room.currentQuestionDeadline) {
    socket.send(JSON.stringify({ error: "Time's up" }));
    return;
  }

  if (
    room.submissions[userId].answers.find((a) => a.questionId === questionId)
  ) {
    socket.send(JSON.stringify({ error: "Already answered this question" }));
    return;
  }

  let isCorrect = selectedOption === room.currentQuestion.correctOptionId;
  if (isCorrect) {
    room.submissions[userId].score += room.currentQuestion.points;
  }

  room.submissions[userId].answers.push({
    questionId,
    selectedOption,
    correct: isCorrect,
  });

  socket.send(
    JSON.stringify({
      type: "answerResult",
      correct: isCorrect,
      score: room.submissions[userId].score,
    })
  );

  console.log(
    `User ${userId} answered Q:${questionId} -> ${selectedOption} (${
      isCorrect ? "correct" : "wrong"
    })`
  );
}


async function handleShowLeaderboard(socket, data, rooms) {
  const room = rooms[socket.room];
  if (socket.role !== "admin") {
    return;
  }

  const leaderboard = Object.entries(room.submissions).map(([userId, sub]) => ({
    userId,
    name: sub.name,
    score: sub.score,
  }));

  await Promise.all(
    Object.entries(room.submissions).map(([userId, sub]) => {
      return prisma.submission.create({
        data: {
          userId: userId,
          quizId: room.quizId,
          answers: sub.answers,
          score: sub.score,
        },
      });
    })
  );

  Object.values(room.clients).forEach((client) => {
    client.send(
      JSON.stringify({
        type: "leaderboard",
        leaderboard,
      })
    );
  });

  socket.send(
    JSON.stringify({
      type: "leaderboard",
      leaderboard,
    })
  );
}


function handleEndQuiz(socket, data, rooms) {
  const room = rooms[socket.room];
  if (!room || socket.role !== "admin") {
    return;
  }

  Object.values(room.clients).forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ type: "roomClosed" }));
      client.close();
    }
  });

  socket.send(JSON.stringify({ type: "roomClosed" }));

  delete rooms[socket.room];

  socket.close();
}


function handleDisconnect(socket, rooms) {
  const roomCode = socket.room;
  if (!roomCode) {
    return;
  }

  const room = rooms[roomCode];
  if (!room) {
    return;
  }

  if (socket.role === "admin") {
    Object.values(room.clients).forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ type: "roomClosed" }));
        client.close();
      }
    });

    delete rooms[roomCode];
  } else {
    const userId = socket.userId;
    if (userId && room.clients[userId] === socket) {
      delete room.clients[userId];
    }
  }
}


module.exports = {
  handleCreateRoom,
  handleJoinRoom,
  handleNextQuestion,
  handleSubmitAnswer,
  handleShowLeaderboard,
  handleEndQuiz,
  handleDisconnect,
};
