import { genSalt, hash } from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { RootFilterQuery } from "mongoose";
import { config } from "../../config/config";
import { RegisterSchema } from "../../schemas/user.schemas";
import { generate6DigitsOTP, sendOTP, verifyOTP } from "../../utils";
import { IUser, User } from "./user.model";
import redis from "../../utils/redis";
import { TEN_MINUTES } from "../../constants";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Get total count of users
    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    // Get paginated users
    const users = await User.find()
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      users,
      meta: {
        currentPage: page,
        totalPages,
        totalUsers,
        usersPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const user = await User.findById(id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

export const registerUser = async (
  req: Request<any, any, RegisterSchema>,
  res: Response
) => {
  const { name, email, password, role } = req.body;

  console.log(req.body);

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  if (!user) {
    return res.status(500).json({ message: "Error creating user" });
  }

  // @ts-ignore
  const token = jwt.sign({ id: user._id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

  // Select only necessary fields, excluding password
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  res.json({ user: userResponse, token });
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { q } = req.query; // Single search term 'q'

    if (!q) {
      return res.status(400).json({ message: "Search term is required" });
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build search query
    let searchQuery: RootFilterQuery<IUser> = {};

    // If search term is provided, search in both name and email fields
    if (q) {
      searchQuery = {
        $or: [
          { name: { $regex: q, $options: "i" } }, // Match name
          { email: { $regex: q, $options: "i" } }, // Match email
        ],
      };
    }

    // Get total count of matching users
    const totalUsers = await User.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalUsers / limit);

    // Get paginated search results
    const users = await User.find(searchQuery)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      users,
      meta: {
        currentPage: page,
        totalPages,
        totalUsers,
        usersPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({ message: "Error searching users" });
  }
};

export const registerUserOtp = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ message: "Email and name are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const otp = generate6DigitsOTP();
    await sendOTP({ email, otp, username: name });

    await redis.setex(`user:${email}`, TEN_MINUTES + 1000, {
      name,
      email,
      role: "student",
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (e) {
    console.error("Register user OTP error:", e);
    res.status(500).json({ message: "Error registering user OTP" });
  }
};

export const verifyUserOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const isOTPValid = await verifyOTP({ email, otp });

    if (!isOTPValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = (await redis.get(`user:${email}`)) as {
      name: string;
      email: string;
      role: string;
    };

    if (user) {
      const { name, email, role } = user;

      const databaseUser = await User.create({
        name,
        email,
        role,
      });

      if (!databaseUser) {
        return res.status(500).json({ message: "Error creating user" });
      }

      await redis.del(`user:${email}`);

      const token = jwt.sign({ id: databaseUser._id }, config.jwt.secret, {
        expiresIn: "7d",
      });

      res.status(200).json({ user: databaseUser, token });
    }

    const dbUser = await User.findOne({ email });

    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ id: dbUser._id }, config.jwt.secret, {
      expiresIn: "7d",
    });

    res.status(200).json({ user: dbUser, token });
  } catch (error) {
    console.error("Verify user OTP error:", error);
    res.status(500).json({ message: "Error verifying user OTP" });
  }
};

export const loginWithOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generate6DigitsOTP();
    await sendOTP({ email, otp, username: user.name });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Login with OTP error:", error);
    res.status(500).json({ message: "Error logging in with OTP" });
  }
};
