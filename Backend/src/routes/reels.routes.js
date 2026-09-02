import express from "express";
import multer from "multer";

import {
    createReel,
    getReels,
    likeReel,
    addView,
      deleteReel
} from "../controller/reel.controllers.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
});

const reelRouter = express.Router();


// Create Reel
reelRouter.post(
    "/create",
    authMiddleware,
    upload.single("video"),
    createReel
);


// Get All Reels
reelRouter.get(
    "/feed",
    authMiddleware,
    getReels
);


// Like / Unlike Reel
reelRouter.patch(
    "/:reelId/like",
    authMiddleware,
    likeReel
);


// Increase View
reelRouter.patch(
    "/:reelId/view",
    authMiddleware,
    addView
);

// Delete reel

reelRouter.delete(
    "/:reelId",
    authMiddleware,
    deleteReel
);


export default reelRouter;