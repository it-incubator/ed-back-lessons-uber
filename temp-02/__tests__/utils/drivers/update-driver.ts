// @ts-ignore
import request from 'supertest';
import { Express } from 'express';
import { DriverInputDto } from '../../../src/drivers/dto/driver.input-dto';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { getDriverDto } from './get-driver-dto';
import { DRIVERS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';

export async function updateDriver<R = null>(
  app: Express,
  driverId: number,
  driverDto?: Partial<DriverInputDto>,
  expectedStatus?: HttpStatus,
): Promise<R> {
  const defaultDriverData: DriverInputDto = getDriverDto();

  const testDriverData = { ...defaultDriverData, ...driverDto };

  const testStatus = expectedStatus ?? HttpStatus.NoContent;

  const updatedDriverResponse = await request(app)
    .put(`${DRIVERS_PATH}/${driverId}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testDriverData)
    .expect(testStatus);

  return updatedDriverResponse.body;
}
