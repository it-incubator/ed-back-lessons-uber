// @ts-ignore
import request from 'supertest';
import { Ride } from '../../../src/rides/types/ride';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { RIDES_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';

export async function getRideById(app: Express, rideId: number): Promise<Ride> {
  const getResponse = await request(app)
    .get(`${RIDES_PATH}/${rideId}`)
    .set('Authorization', generateBasicAuthToken())
    .expect(HttpStatus.Ok);

  return getResponse.body;
}
