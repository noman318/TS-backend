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

// const searchData = async (req: Request, res: Response, next: NextFunction) => {
//   const searchString = req.body.search;
//   console.log("searchString", searchString.toString());
//   const searchFields = ["title", "price"];
//   try {
//     // const searchResults = await Book.find({
//     //   $or: [{ title: { $regex: searchString, $options: "i" } }],
//     // });
//     const searchResults = await Book.find({
//       $or: searchFields.map((field) => {
//         const query: Record<string, any> = {};

//         if (typeof searchString === "number") {
//           query[field] = searchString;
//         } else if (typeof searchString === "string") {
//           query[field] = { $regex: searchString, $options: "i" };
//         }
//         console.log("query", query);

//         return query;
//       }),
//     });
//     console.log("searchResults", searchResults);
//     return res.send(searchResults);
//   } catch (error: any) {
//     return res.status(500).send({ message: error.message });
//   }
// };
const searchData = async (req: Request, res: Response, next: NextFunction) => {
  const searchString = req.body.search;

  if (searchString === undefined) {
    return res.status(400).json({ error: "Search input is missing." });
  }

  const searchFields = ["title", "price"];

  try {
    let searchResults;
    if (typeof searchString === "number") {
      console.log("searchStringInNumber", searchString);
      searchResults = await Book.find({
        $or: searchFields.map((field) => ({
          [field]: searchString,
        })),
      });
    } else if (typeof searchString === "string") {
      console.log("searchStringInTextInElse", searchString);
      console.log("searchStringInText", searchString);
      searchResults = await Book.find({
        $or: searchFields.map((field) => ({
          title: { $regex: searchString, $options: "i" },
        })),
      });
    }

    console.log("searchResults", searchResults);
    return res.send(searchResults);
  } catch (error: any) {
    // console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const filterData = async (req: Request, res: Response) => {
  const filterQuery = req.body;
  console.log("filterQuery", filterQuery);
  try {
    const filteredData = await Book.find(filterQuery);
    // console.log("filteredData", filteredData);
    return res.status(200).send(filteredData);
  } catch (error: any) {
    console.log("error", error.message);
    return res.status(500).send({ message: error.message });
  }
};

export default {
  getAllBook,
  getOneBook,
  createBook,
  updateBook,
  deleteBook,
  searchData,
  filterData,
};
