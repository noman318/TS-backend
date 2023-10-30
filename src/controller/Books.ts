import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Book from "../models/Book.model";
import AuthorModel from "../models/Author.model";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, author, price } = req.body;
  try {
    const book = new Book({
      _id: new mongoose.Types.ObjectId(),
      title,
      author,
      price,
    });
    const newBook = await book.save();
    return res.json({ message: "Book created successfully", book: newBook });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.id;
  try {
    const bookData = await Book.findById(bookId);
    if (!bookData) {
      return res.status(404).json({ message: "No Book Found with above Id" });
    }
    bookData.set(req.body);
    const newBookData = await bookData.save();
    return res.status(201).json({ message: "Book Updated", book: newBookData });
  } catch (error) {
    // const bookData = await
    return res.status(500).send({ message: error });
  }
};

const getOneBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.id;
  //   console.log("bookId", bookId);
  try {
    const bookData = await Book.findById(bookId).select("-_id -__v").populate({
      path: "author",
      model: AuthorModel,
      select: "name -_id",
    });
    // console.log("bookData", bookData);
    if (!bookData) {
      return res.status(400).send({ message: "No Book Found with above Id" });
    }
    return res.status(200).json({ bookData });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

const getAllBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookData = await Book.find().select("-_id").populate({
      path: "author",
      model: AuthorModel,
      select: "name -_id",
    });
    return res.status(200).json({ bookData });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.id;
  try {
    await Book.findByIdAndDelete(bookId);
    return res.status(200).json({ message: "Book deleted" });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

export default { getAllBook, getOneBook, createBook, updateBook, deleteBook };
