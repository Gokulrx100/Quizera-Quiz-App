const express = require("express");
const router = express.Router();
const Auth=require("../middleware/auth");

router.get("/", Auth, async (req, res) => {
  let user = req.user;
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

module.exports = router;