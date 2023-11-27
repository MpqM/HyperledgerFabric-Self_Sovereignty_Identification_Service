import { NextFunction, Request, Response } from "express";
import createHttpError, { isHttpError } from "http-errors";
import logger from "../utils/logger";

export function notFoundHandler(req: Request, res: Response, next: NextFunction) { next(createHttpError(404, "Endpoint not found")); }

export function errorHandler( error: unknown, req: Request, res: Response, next: NextFunction ) {
  let errorMessage = "An unknown error occurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
    res.status(statusCode).json({error:errorMessage});
  }
  else {
    logger.error(JSON.stringify(error))
    res.status(statusCode).json(error);
  }
}




