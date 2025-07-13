const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt_secret = "123random";

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

module.exports = Auth;