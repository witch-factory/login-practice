import express, { Request, Response } from "express";
import authRouter from "./routes/auth";
import cookieParser from "cookie-parser";
import protectedRouter from "./routes/protected";
import cors from "cors";
import fs from "fs";
import https from "https";
import http from "http";

const app = express();
const port = 3000;

const options = {
  key: fs.readFileSync("../localhost-key.pem"),
  cert: fs.readFileSync("../localhost.pem"),
};

app.use(cors({ origin: "https://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.use("/auth", authRouter);
app.use("/protected", protectedRouter);

// 서버 시작
https.createServer(options, app).listen(port + 1, () => {
  console.log(`Server is running at https://localhost:${port + 1}`);
});

http
  .createServer((req, res) => {
    res.writeHead(301, { Location: `https://localhost:${port + 1}${req.url}` });
    res.end();
  })
  .listen(port);
