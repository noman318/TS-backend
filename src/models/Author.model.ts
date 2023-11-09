import mongoose, { Schema, Document } from "mongoose";

export interface IAuthor {
  name: string;
  // genre: string;
}

export interface IAuthorModel extends IAuthor, Document {}

const Author: Schema = new Schema(
  {
    name: { type: String, required: true },
    genre: { type: String, required: true },
    age: { type: Number },
  },
  { versionKey: false }
);

export default mongoose.model<IAuthorModel>("Author", Author);
