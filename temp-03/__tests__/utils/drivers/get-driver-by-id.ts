// @ts-ignore
import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { DRIVERS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { DriverViewModel } from '../../../src/drivers/types/driver-view-model';

export async function getDriverById<R = DriverViewModel>(
  app: Express,
  driverId: string,
  expectedStatus?: HttpStatus,
): Promise<R> {
  const testStatus = expectedStatus ?? HttpStatus.Ok;

  const driverResponse = await request(app)
    .get(`${DRIVERS_PATH}/${driverId}`)
    .set('Authorization', generateBasicAuthToken())
    .expect(testStatus);

  return driverResponse.body;
}
