// @ts-ignore
import request from 'supertest';
import { Express } from 'express';
import { DriverInputDto } from '../../../src/drivers/dto/driver.input-dto';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { getDriverDto } from './get-driver-dto';
import { DRIVERS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';

export async function updateDriver(
  app: Express,
  driverId: string,
  driverDto?: DriverInputDto,
): Promise<void> {
  const defaultDriverData: DriverInputDto = getDriverDto();

  const testDriverData = { ...defaultDriverData, ...driverDto };

  const updatedDriverResponse = await request(app)
    .put(`${DRIVERS_PATH}/${driverId}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testDriverData)
    .expect(HttpStatus.NoContent);

  return updatedDriverResponse.body;
}
