// @ts-ignore
import request from 'supertest';
import { DriverInputDto } from '../../src/drivers/dto/driver.input-dto';
import { Express } from 'express';
import { HttpStatus } from '../../src/core/types/http-statuses';
import { generateBasicAuthToken } from './generate-admin-auth-token';
import { Driver } from '../../src/drivers/types/driver';

export async function createDriver(
  app: Express,
  driverDto?: Partial<DriverInputDto>,
): Promise<Driver> {
  const defaultDriverData: DriverInputDto = {
    name: 'Feodor',
    phoneNumber: '987-654-3210',
    email: 'feodor@example.com',
    vehicleMake: 'Audi',
    vehicleModel: 'A6',
    vehicleYear: 2020,
    vehicleLicensePlate: 'XYZ-456',
    vehicleDescription: null,
    vehicleFeatures: [],
  };

  const testDriverData = { ...defaultDriverData, ...driverDto };

  const createdDriverResponse = await request(app)
    .post('/api/drivers')
    .set('Authorization', generateBasicAuthToken())
    .send(testDriverData)
    .expect(HttpStatus.Created);

  return createdDriverResponse.body;
}
