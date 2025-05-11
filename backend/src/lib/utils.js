import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Access token expires in 1 hour
    algorithm: "HS256",
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "90d", // Refresh token expires in 90 days
    algorithm: "HS256",
  });

  // Set access token in cookie
  res.cookie("jwt", accessToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000, // 1 hour
    sameSite: "lax",
    secure: process.env.NODE_ENV != "development",
    path: "/",
  });

  // Set refresh token in cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
    sameSite: "lax",
    secure: process.env.NODE_ENV !== "development",
    path: "/api/auth/refresh", // Restrict refresh token to auth refresh endpoint only
  });

  return { accessToken, refreshToken };
};
