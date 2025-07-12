import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateToken = (userId: string, res: Response) => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!jwtSecret || !jwtRefreshSecret) {
    throw new Error("JWT secrets are not defined in environment variables");
  }

  const accessToken = jwt.sign({ userId }, jwtSecret, {
    expiresIn: "1h",
    algorithm: "HS256",
  });

  const refreshToken = jwt.sign({ userId }, jwtRefreshSecret, {
    expiresIn: "90d",
    algorithm: "HS256",
  });

  res.cookie("jwt", accessToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000, // 1 hour
    sameSite: "lax",
    secure: process.env.NODE_ENV !== "development",
    path: "/",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
    sameSite: "lax",
    secure: process.env.NODE_ENV !== "development",
    path: "/api/auth/refresh",
  });

  return { accessToken, refreshToken };
};
