import express from "express";
import multer from "multer";

import {
    createStory,
    getStories,
    viewStory,
} from "../controller/story.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const storage = multer.memoryStorage();

const upload = multer({
    storage,
});

const storyRouter = express.Router();


// Create Story
storyRouter.post(
    "/create",
    authMiddleware,
    upload.single("image"),
    createStory
);


// Get Active Stories
storyRouter.get(
    "/feed",
    authMiddleware,
    getStories
);


// View Story
storyRouter.patch(
    "/:storyId/view",
    authMiddleware,
    viewStory
);


export default storyRouter;