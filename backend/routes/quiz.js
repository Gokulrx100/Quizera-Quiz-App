const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Auth = require("../middleware/auth");

router.post("/", Auth, async (req, res) => {
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

router.get("/getall", Auth, async (req, res) => {
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
    res
      .status(500)
      .json({ message: "Internal server error, could not get the quizzes" });
  }
});

router.get("/:quizId", Auth, async (req, res) => {
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

router.get("/result/:quizId", Auth, async (req, res) => {
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

router.put("/:quizId", Auth, async (req, res) => {
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

router.delete("/:quizId", Auth, async (req, res) => {
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

module.exports = router;