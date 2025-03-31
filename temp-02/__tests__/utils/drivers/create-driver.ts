// @ts-ignore
import request from 'supertest';
import { DriverInputDto } from '../../../src/drivers/dto/driver.input-dto';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { Driver } from '../../../src/drivers/types/driver';
import { DRIVERS_PATH } from '../../../src/core/paths/paths';
import { getDriverDto } from './get-driver-dto';

export async function createDriver(
  app: Express,
  driverDto?: DriverInputDto,
): Promise<Driver> {
  const defaultDriverData: DriverInputDto = getDriverDto();

  const testDriverData = { ...defaultDriverData, ...driverDto };

  const createdDriverResponse = await request(app)
    .post(DRIVERS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testDriverData)
    .expect(HttpStatus.Created);

  return createdDriverResponse.body;
}
