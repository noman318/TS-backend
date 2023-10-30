import mongoose, { Schema, Document } from "mongoose";

export interface IBook {
  title: string;
  author: string;
  price: number;
}

export interface IBookModel extends IBook, Document {}

const BookSchema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    author: { type: Schema.Types.ObjectId, required: true, ref: "Author" },
  },
  { timestamps: true }
);

export default mongoose.model<IBookModel>("Book", BookSchema);
