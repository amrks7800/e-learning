import "express";
import { IUser } from "../../features/users/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      file?: Express.Multer.File;
    }
  }
}
