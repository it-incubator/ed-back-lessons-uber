import {
  FieldValidationError,
  ValidationError,
  validationResult,
} from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { ValidationErrorType } from '../../types/validationError';
import {HttpStatus} from "../../types/http-statuses";

export const createErrorMessages = (
  errors: ValidationErrorType[],
): { errorMessages: ValidationErrorType[] } => {
  return { errorMessages: errors };
};

const formatErrors = (error: ValidationError): ValidationErrorType => {
  const expressError = error as unknown as FieldValidationError;

  return {
    field: expressError.path,
    message: expressError.msg,
  };
};

export const inputValidationResultMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
    .formatWith(formatErrors)
    .array({ onlyFirstError: true });

  if (!errors.length) {
    next();
    return;
  }
  res.status(HttpStatus.BadRequest).json({ errorMessages: errors });
  return;
};
