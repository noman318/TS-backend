console.log("Author controller");
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Author from "../models/Author";

const createAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, genre, age } = req.body;
  try {
    const author = new Author({
      _id: new mongoose.Types.ObjectId(),
      name,
      genre,
      age,
    });
    const newAuthor = await author.save();
    return res
      .status(200)
      .send({ message: "Author Created", author: newAuthor });
  } catch (error) {
    return res.status(500).send({ message: error });
  }

  //   return res.status(200).json({ newAuthor });
};
const readOneAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorId = req.params.id;
  //   console.log("authorId", authorId);
  try {
    const authorData = await Author.findById(authorId).select({ _id: 0 });
    // console.log("authorData", authorData);
    if (!authorData) {
      return res.status(400).send({ message: "No Author Found with above Id" });
    }
    return res.status(200).json({ authorData });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};
const readAllAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allAuthors = await Author.find();
    return res.status(200).json({ allAuthors });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};
const updateAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorId = req.params.id;
  try {
    const authorData = await Author.findById(authorId);
    if (authorData) {
      authorData.set(req.body);
      const newAuthor = await authorData.save();
      return res
        .status(200)
        .send({ message: "Author Updated", author: newAuthor });
    } else {
      return res.status(404).send({ message: "No author found" });
    }
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};
const deleteAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorId = req.params.id;
    await Author.findByIdAndDelete(authorId);
    return res.status(200).json({ message: "author deleted" });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

export default {
  createAuthor,
  readOneAuthor,
  readAllAuthor,
  updateAuthor,
  deleteAuthor,
};
