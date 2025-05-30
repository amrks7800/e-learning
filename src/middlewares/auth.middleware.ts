import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "../features/users/user.model";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = (req.headers.authorization as string)?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decoded = jwt.verify(token, config.jwt.secret) as { id: string };

  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const user = await User.findById(decoded.id);

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = user;

  next();
};
