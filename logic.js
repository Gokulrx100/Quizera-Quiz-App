const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt_secret = "123random";

app.use(express.json());

async function Auth(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "token not found" });
    }

    let payload;
    try {
      payload = jwt.verify(token, jwt_secret);
    } catch (err) {
      return res.status(401).json({ message: "invalid or expired token" });
    }

    const { email } = payload;
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
  }
}

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(401).json({ message: "fields cannot be left empty" });
    }
    if (role !== "USER" && role !== "ADMIN") {
      return res
        .status(401)
        .json({ meaage: "invalid role. select either ADMIN or User" });
    }

    const ifExisting = await prisma.user.findFirst({ where: { email } });
    if (ifExisting) {
      return res.status(401).json({ message: "email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        role: role,
      },
    });

    res.json({ message: "Signup successful" });
  } catch (err) {
    console.log(err);
  }
});

app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ message: "fields cannot be left empty" });
    }

    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ email: user.email }, jwt_secret);
    res.json({ token: token, message: "Signin successful" });
  } catch (err) {
    console.log(err);
  }
});

app.get("/profile", Auth, async (req, res) => {
  let user = req.user;
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

app.post("/quiz", Auth, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res
        .status(401)
        .json({ message: "cannot create quiz. Must be an ADMIN" });
    }
    const { title, questions } = req.body;
    if (!title || !questions) {
      return res
        .status(401)
        .json({ message: "title and questions are required" });
    }

    for (const q of questions) {
      if (!Array.isArray(q.options) || q.options.length < 2) {
        return res
          .status(400)
          .json({ message: "Each question must have at least 2 options" });
      }
      const correctCount = q.options.filter((opt) => opt.isCorrect).length;
      if (correctCount !== 1) {
        return res.status(400).json({
          message: "Each question must have exactly one correct answer",
        });
      }
    }

    const quiz = await prisma.quiz.create({
      data: {
        title: title,
        createdById: req.user.id,
      },
    });

    for (const q of questions) {
      const question = await prisma.question.create({
        data: {
          text: q.text,
          quizId: quiz.id,
        },
      });

      await prisma.option.createMany({
        data: q.options.map((opt) => ({
          text: opt.text,
          isCorrect: opt.isCorrect,
          questionId: question.id,
        })),
      });
    }

    res.json({ quizId: quiz.id, message: "Quiz created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "could not create quiz, server error" });
  }
});

app.get("/quiz/getall", Auth, async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: { deleted: false },
      select: {
        id: true,
        title: true,
      },
    });
    res.json({ quizzes });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error, could not get the quizzes" });
  }
});

app.get("/quiz/:quizId", Auth, async (req, res) => {
  try {
    const quizId = req.params.quizId;

    const quiz = await prisma.quiz.findFirst({
      where: { id: quizId, deleted: false },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) {
      return res
        .status(401)
        .json({ message: "invalid quizId, could not fetch quiz" });
    }

    const response = {
      id: quizId,
      title: quiz.title,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        title: q.text,
        options: q.options.map((opt) => ({
          id: opt.id,
          text: opt.text,
        })),
      })),
    };

    res.json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error, could not fetch quiz" });
  }
});

app.post("/quiz/:quizId/submit", Auth, async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const { answers } = req.body;

    if (!answers) {
      return res.status(401).json({ message: "Ans not found" });
    }

    const quiz = await prisma.quiz.findFirst({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) {
      return res
        .status(401)
        .json({ message: "invalid quizId, could not fetch quiz" });
    }
    let score = 0;
    let total = answers.length;
    for (const ans of answers) {
      const question = quiz.questions.find((q) => q.id == ans.questionId);
      const selectedOption = question.options.find(
        (op) => op.id == ans.selectedOption
      );
      if (selectedOption?.isCorrect) {
        score += question.points;
      }
    }

    await prisma.submission.create({
      data: {
        userId: req.user.id,
        quizId: quizId,
        answers: answers,
        score: score,
      },
    });
    console.log(score);
    res.status(200).json({
      score: score,
      total: total,
      message: "Submission evaluated",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server Error" });
  }
});

app.get("/result/:quizId", Auth, async (req, res) => {
  try {
    const quizId = req.params.quizId;
    console.log(typeof quizId);
    const submissions = await prisma.submission.findMany({
      where: { quizId: quizId },
      include: { user: true },
    });

    const results = submissions.map((sub) => ({
      userId: sub.userId,
      name: sub.user.name,
      score: sub.score,
      totalQuestions: Array.isArray(sub.answers) ? sub.answers.length : 0,
    }));

    res.json({ results });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/quiz/:quizId", Auth, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(401).json({ message: "Only admin can update quizzes" });
    }
    const quizId = req.params.quizId;
    const { title, questions } = req.body;

    questions.forEach((q) => {
      const correctCount = q.options.filter((opt) => opt.isCorrect).length;
      if (correctCount !== 1) {
        return res
          .status(401)
          .json({ message: "Each question must only have one correct answer" });
      }
    });

    await prisma.quiz.update({
      where: { id: quizId },
      data: { title: title },
    });

    await Promise.all(
      questions.map(async (q) => {
        if (q.id) {
          await prisma.question.update({
            where: { id: q.id },
            data: {
              text: q.text,
              points: q.points ?? 1,
            },
          });

          if (q.options) {
            await Promise.all(
              q.options.map(async (opt) => {
                if (opt.id) {
                  await prisma.option.update({
                    where: { id: opt.id },
                    data: {
                      text: opt.text,
                      isCorrect: opt.isCorrect,
                    },
                  });
                } else {
                  await prisma.option.create({
                    data: {
                      text: opt.text,
                      isCorrect: opt.isCorrect,
                      questionId: q.id,
                    },
                  });
                }
              })
            );
          }
        } else {
          const newQuestion = await prisma.question.create({
            data: {
              text: q.text,
              points: q.points ?? 1,
              quizId: quizId,
            },
          });
          if (q.options) {
            await Promise.all(
              q.options.map(async (opt) => {
                await prisma.option.create({
                  data: {
                    text: opt.text,
                    isCorrect: opt.isCorrect,
                    questionId: newQuestion.id,
                  },
                });
              })
            );
          }
        }
      })
    );
    res.json({ message: "Quiz updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not update quiz" });
  }
});

app.delete("/quiz/:quizId", Auth, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(401).json({ message: "Only admin can delete quizzes" });
    }

    const quizId = req.params.quizId;
    await prisma.quiz.update({
      where: { id: quizId },
      data: { deleted: true },
    });

    res.json({ message: "Quiz deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not delete quiz" });
  }
});

app.listen(3000, () => {
  console.log("server running at port 3000");
});
