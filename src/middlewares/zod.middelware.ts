import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateRequestBody =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const parsedData = schema.safeParse(req.body);

    if (!parsedData.success) {
      console.log(parsedData.error.errors);
      return res
        .status(400)
        .json({
          errors: parsedData.error.flatten().fieldErrors,
          exotics: parsedData.error.flatten().formErrors,
        });
    }

    req.body = parsedData.data;
    next();
  };
