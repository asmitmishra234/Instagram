import express from "express";
import multer from "multer";
import { register, login, logout, getMe, updateProfile } from "../controller/auth.controller.js";
import { registerValidator, loginValidator, validateRequest } from "../validators/auth.validator.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getUserProfile } from "../controller/userProfile.controller.js";

const appRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

appRouter.post("/register", registerValidator, validateRequest, register);
appRouter.post("/login", loginValidator, validateRequest, login);
appRouter.post("/logout", logout);
appRouter.get("/get-me", authMiddleware, getMe);
appRouter.put("/update-profile", authMiddleware, upload.single("profileImage"), updateProfile);
appRouter.get("/:userId/profile", authMiddleware, getUserProfile);

export default appRouter;