import express from "express";
import { forgotpassword, login, resetpassword, signup } from "../controllers/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password",forgotpassword)
router.post("/reset-password/:token",resetpassword)

export default router;