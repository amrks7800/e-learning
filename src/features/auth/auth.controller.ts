import { Request, Response } from "express";
import { LoginSchema } from "../../schemas/user.schemas";
import { User } from "../users/user.model";
import jwt from "jsonwebtoken";
import { compare } from "bcryptjs";
import { config } from "../../config/config";

export const login = async (
  req: Request<any, any, LoginSchema>,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "user with provided email not found" });
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, config.jwt.secret, {
      expiresIn: "7d",
    });

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    res.json({ user: userResponse, token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};
