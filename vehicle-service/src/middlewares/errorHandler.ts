import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.log("------");

  console.error(err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      data: err.data ?? null,
      statusCode: err.statusCode,
    });
    return;
  }

  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: number }).code === 11000
  ) {
    res.status(409).json({
      message: "Vehicle model already exists",
      data:
        "keyValue" in err
          ? ((err as { keyValue?: unknown }).keyValue ?? null)
          : null,
    });
    return;
  }

  res.status(500).json({
    message: "Internal Server Error",
    data: null,
  });
};
