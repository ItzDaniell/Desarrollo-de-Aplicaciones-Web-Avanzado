import express from "express";
import postController from "../controllers/postController.js";

const router = express.Router();

/* Render all posts */
router.get("/", postController.getAll);

/* Render create view */
router.get("/create", postController.newForm);

/* Create post */
router.post("/create", postController.create);

/* Render edit view */
router.get("/:postId/edit", postController.edit);

/* Update post */
router.post("/:postId/update", postController.update);

/* Delete post */
router.post("/:postId/delete", postController.delete);

/* Render single post details */
router.get("/:postId", postController.getPost);

export default router;
