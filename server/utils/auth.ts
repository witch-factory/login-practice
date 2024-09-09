import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken";
import redisClient from "./redis";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET 환경변수가 설정되어 있지 않습니다.");
}

const ACCESS_TOKEN_EXPIRATION = "12h";
const HASH_ALGORITHM = "HS256";

export type TokenPayload = JwtPayload & {
  username: string;
  isAdmin: boolean;
};

// payload를 받아서 액세스 토큰 발급
export const generateAccessToken = (payload: TokenPayload) => {
  const options: SignOptions = {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
    algorithm: HASH_ALGORITHM,
  };
  const token = jwt.sign(payload, JWT_SECRET, options);
  return token;
};

// access token 검증한 후 payload 반환
// 만약 만료된 토큰이라면 expired: true를 반환
export const verifyAccessToken = (token: string) => {
  try {
    const options: VerifyOptions = {
      algorithms: [HASH_ALGORITHM],
    };
    return jwt.verify(token, JWT_SECRET, options) as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { expired: true };
    }
    return null;
  }
};

// 액세스 토큰 검증 미들웨어
// 액세스 토큰이 없거나 만료되었을 때 401 반환
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.accessToken;
  console.log(token);
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  // 액세스 토큰 검증
  const payload = verifyAccessToken(token);
  if (payload && !("expired" in payload)) {
    req.body.user = payload;
    return next();
  }

  if (payload && "expired" in payload) {
    req.body.tokenExpired = true;
    return next();
  }

  return res.status(401).json({ message: "Unauthorized" });
}
