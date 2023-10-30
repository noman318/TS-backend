import { Router, Request, Response } from "express";
import AuthorController from "../controller/Author";

const router = Router();

router.post("/create-author", AuthorController.createAuthor);

router.get("/author/:id", AuthorController.readOneAuthor);

router.get("/all-authors", AuthorController.readAllAuthor);

router.put("/update/:id", AuthorController.updateAuthor);

router.delete("/delete/:id", AuthorController.deleteAuthor);

export default router;
