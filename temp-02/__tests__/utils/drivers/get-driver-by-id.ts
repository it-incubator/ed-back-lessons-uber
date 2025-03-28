// @ts-ignore
import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { DRIVERS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { Driver } from '../../../src/drivers/types/driver';

export async function getDriverById(
  app: Express,
  driverId: number,
): Promise<Driver> {
  const driverResponse = await request(app)
    .get(`${DRIVERS_PATH}/${driverId}`)
    .set('Authorization', generateBasicAuthToken())
    .expect(HttpStatus.Ok);

  return driverResponse.body;
}
