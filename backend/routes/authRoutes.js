const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt_secret = "123random";
const router = express.Router();


router.post("/signup", async (req, res) => {
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


router.post("/signin", async (req, res) => {
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
    res.json({
      token: token,
      userId: user.id,
      name: user.name,
      message: "Signin successful",
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;