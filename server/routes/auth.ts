import express, { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { generateAccessToken } from "../utils/auth";

const authRouter = express.Router();
const prisma = new PrismaClient();

type RegisterData = {
  username: string;
  password: string;
  isAdmin: boolean;
};

type User = {
  username: string;
  password: string;
};

authRouter.post(
  "/register",
  async (req: Request<{}, {}, RegisterData>, res: Response) => {
    const { username, password, isAdmin } = req.body;
    console.log(username, password, isAdmin);

    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        isAdmin,
      },
    });
    // 201 Created
    res.status(201).json(newUser);
  }
);

authRouter.post("/login", async (req: Request<{}, {}, User>, res: Response) => {
  const { username, password } = req.body;
  console.log(username, password);

  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    // 사용자가 존재하지 않는 경우
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    // 비밀번호가 일치하지 않는 경우
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const payload = { username, isAdmin: user.isAdmin };
    const accessToken = generateAccessToken(payload);
    console.log(accessToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // Cross-site cookie
      maxAge: 12 * 60 * 60 * 1000, // 12 hours
    });

    res.json({
      message: "Login successful",
      user: { username, isAdmin: user.isAdmin },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// refresh token을 이용한 access token 재발급 TODO

// 로그아웃 라우트
authRouter.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.json({
    message: "Logout successful",
  });
});

export default authRouter;
