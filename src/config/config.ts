import dotenv from "dotenv";

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.EXPRESS_PORT ? Number(process.env.EXPRESS_PORT) : 5000;

export const config = {
  mongo: {
    url: MONGODB_URL,
  },
  server: {
    port: PORT,
  },
};
