import express from "express";
import { refreshToken } from "../controllers/RefreshToken.js";
import {
  getAllUsers,
  Login,
  LogOut,
  Register,
} from "../controllers/UserController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/api/users", verifyToken, getAllUsers);
router.post("/api/users", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", LogOut);

export default router;
