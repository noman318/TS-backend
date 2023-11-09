console.log("Author controller");
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Author from "../models/Author.model";

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

const searchDataAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const searchString = req.body.search;

  if (searchString === undefined) {
    return res.status(400).json({ error: "Search input is missing." });
  }

  const searchFields = ["age"];
  const searchStrings = ["name", "genre"];

  try {
    let searchResults;
    if (typeof searchString === "number") {
      console.log("searchStringInNumber", searchString);
      searchResults = await Author.find({
        $or: searchFields.map((field) => ({
          [field]: searchString,
        })),
      });
    } else if (typeof searchString === "string") {
      console.log("searchStringInTextInElse", searchString);
      console.log("searchStringInText", searchString);
      searchResults = await Author.find({
        $or: searchStrings.map((field) => ({
          [field]: { $regex: searchString, $options: "i" },
        })),
      });
    }

    // console.log("searchResults", searchResults);
    return res.send(searchResults);
  } catch (error: any) {
    // console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const getAllAuthorUsingQuery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const query = req.query;

  try {
    const getAllGenre = await Author.find({}).select("genre -_id");

    const uniqueGenre = new Set(getAllGenre.map((item: any) => item.genre));
    // const uniqueGenres = [
    //   ...new Set(getAllGenre.map((item: any) => item.genre)),
    // ];

    const allGenres = [...uniqueGenre];

    const searchValue = query.search || "";
    const pageNumber = +query.pageNumber! || 1;
    const pageSize = +query.pageSize! || 10;
    let sort = query.sort || "age";
    const skipAmount = (pageNumber - 1) * pageSize || 0;
    //@ts-expect-error
    let genreFilter: string | string[] = query.genre || "All";
    genreFilter === "All"
      ? (genreFilter = [...allGenres])
      : //@ts-expect-error
        (genreFilter = req.query.genre.split(","));
    //@ts-expect-error
    query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);
    let sortBy: Record<string, string> = {};
    if (Array.isArray(sort) && sort[1]) {
      //@ts-expect-error
      sortBy[sort[0]] = sort[1];
    } else {
      //@ts-expect-error
      sortBy[sort[0]] = "asc";
    }
    console.log("sortBy", sortBy);
    const filteredData = await Author.find({
      name: { $regex: searchValue, $options: "i" },
    })
      .where("genre")
      .in([...genreFilter])
      .skip(skipAmount)
      .limit(pageSize)
      //@ts-expect-error
      .sort(sortBy);

    const totalDocs = await Author.countDocuments({
      genre: { $in: [...genreFilter] },
      name: { $regex: searchValue, $options: "i" },
    });
    console.log("totalDocs", totalDocs);
    return res.status(200).json({ filteredData, totalDocs });
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
  searchDataAuthor,
  getAllAuthorUsingQuery,
};
