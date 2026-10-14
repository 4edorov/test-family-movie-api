import express from "express";
import bcrypt from "bcryptjs";
import { findByUsername } from "../utils/db.js";
import { verifyToken, signToken } from "../utils/jwt.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Invalid credentials" });
  }

  const existedUser = findByUsername(username);

  if (!existedUser) {
    return res
      .status(401)
      .json({ error: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, existedUser.passwordHash);

  if (!match) {
    return res
      .status(401)
      .json({ error: "Invalid credentials" });
  }

  const payload = {
    id: existedUser.id,
    username: existedUser.username,
    role: existedUser.role,
  };

  const token = signToken(payload);

  res
    .status(200)
    .json({
      message: "Ok",
      token,
    });
});

export default router;

