import {
  FieldValidationError,
  ValidationError,
  validationResult,
} from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { ValidationErrorType } from '../types/validationError';

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

export const inputValidationMiddleware = (
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
  res.status(400).json({ errorMessages: errors });
  return;
};
