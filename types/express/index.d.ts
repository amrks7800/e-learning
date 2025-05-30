import "express";
import { IUser } from "../../src/features/users/user.model";

declare module "express" {
  interface Request {
    user?: IUser; // ideally you should use a specific type like `User`
  }
}
