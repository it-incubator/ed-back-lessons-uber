// @ts-ignore
import request from 'supertest';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { Express } from 'express';
import { RideInputDto } from '../../../src/rides/dto/ride-input.dto';
import { createDriver } from '../drivers/create-driver';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { RIDES_PATH } from '../../../src/core/paths/paths';
import { getRideDto } from './get-ride-dto';
import { RideViewModel } from '../../../src/rides/types/ride-view-model';

export async function createRide<R = RideViewModel>(
  app: Express,
  rideDto?: Partial<RideInputDto>,
  expectedStatus?: HttpStatus,
): Promise<R> {
  const driverId = rideDto?.driverId ?? (await createDriver(app)).id;

  const defaultRideData = getRideDto(driverId);

  const testRideData = { ...defaultRideData, ...rideDto };

  const testStatus = expectedStatus ?? HttpStatus.Created;

  const createdRideResponse = await request(app)
    .post(RIDES_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testRideData)
    .expect(testStatus);

  return createdRideResponse.body;
}
