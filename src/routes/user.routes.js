import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js"; // Adjust path if needed

const router = Router();

router.route("/register").post(registerUser);

export default router;
