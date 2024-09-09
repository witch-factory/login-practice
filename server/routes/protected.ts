import express, { Request, Response } from "express";

import { authMiddleware } from "../utils/auth";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET 환경변수가 설정되어 있지 않습니다.");
}

const protectedRouter = express.Router();

protectedRouter.get("/", [authMiddleware], (req: Request, res: Response) => {
  console.log(req.body);
  res.json({
    message: "You are authorized!",
  });
});

export default protectedRouter;
