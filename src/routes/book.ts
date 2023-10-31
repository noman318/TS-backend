import { Router } from "express";
import BookController from "../controller/Books";

const router = Router();

router.get("/all-books", BookController.getAllBook);
router.get("/one-book/:id", BookController.getOneBook);
router.post("/create-book", BookController.createBook);
router.put("/update-book/:id", BookController.updateBook);
router.delete("/delete/:id", BookController.deleteBook);
router.post("/search", BookController.searchData);
router.post("/filter", BookController.filterData);

export default router;
