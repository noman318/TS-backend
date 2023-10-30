import express, { Request, Response, Express, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";

import AuthorRoutes from "./routes/author";
import BookRoutes from "./routes/book";
import { config } from "./config/config";

const app: Express = express();
const PORT = config.server.port;

mongoose
  .connect(config.mongo.url || "", { dbName: "BE-with-TS" })
  .then(() => {
    console.log("Connected to MongoDB");
    StartServer();
  })
  .catch((err: TypeError) => {
    console.log(`Error while connecting to MongoDB : ${err}`);
  });

const StartServer = () => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(
      `Incomming -> Method: [${req.method}]- URL: [${req.url}]- IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}] `
    );

    res.on("finish", () => {
      console.log(
        `Outgoing -> Method: [${req.method}]- URL: [${req.url}]- IP: [${req.socket.remoteAddress}]- Status: [${res.statusCode}] `
      );
    });
    next();
  });
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({ origin: "*" }));

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method == "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "POST,PUT,GET,PATCH,DELETE");
      return res.status(200).json({});
    }
    next();
  });

  app.use("/author", AuthorRoutes);
  app.use("/book", BookRoutes);

  app.get("/ping", (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).json({ message: "Root Route Working" });
  });

  app.use((req, res, next) => {
    const error = new Error("Not found");

    console.log("Error", error);

    res.status(404).json({
      message: error.message,
    });
  });
  app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
  });
};
