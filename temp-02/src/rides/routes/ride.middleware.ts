import { body } from 'express-validator';
import { Currency, RideStatus } from '../types/ride';

//TODO: по аналогии с driver.input-dto.validation-middleware
export const rideStatusValidation = body('status')
  .isString()
  .withMessage('status should be string')
  .trim()
  .isIn(Object.values(RideStatus))
  .withMessage('Invalid status value');

export const clientNameValidation = body('clientName')
  .isString()
  .withMessage('status should be string')
  .trim()
  .isLength({ min: 3, max: 100 });

export const driverIdValidation = body('driverId')
  .isString()
  .withMessage('ID must be a string')
  .isLength({ min: 1 })
  .withMessage('ID must not be empty')
  .isNumeric()
  .withMessage('ID must be a numeric string');

export const priceValidation = body('price')
  .isFloat({ gt: 0 }) // Проверка, что цена - это число больше 0
  .withMessage('price must be a positive number');

export const currencyValidation = body('currency')
  .isString()
  .withMessage('currency should be string')
  .trim()
  .isIn(Object.values(Currency)) // Проверка на допустимые значения
  .withMessage('currency must be either "usd" or "eu"');

export const startAddressValidation = body('startAddress')
  .isString()
  .withMessage('startAddress should be string')
  .trim()
  .isLength({ min: 10, max: 200 });

export const endAddressValidation = body('endAddress')
  .isString()
  .withMessage('endAddress should be string')
  .trim()
  .isLength({ min: 10, max: 200 });
