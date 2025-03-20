// @ts-ignore
import request from 'supertest';
// @ts-ignore
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { DriverStatus } from '../../../src/drivers/types/driver';
import { RideStatus } from '../../../src/rides/types/ride';
import { createDriver } from '../../utils/drivers/create-driver';
import { clearDb } from '../../utils/clear-db';
import { createRide } from '../../utils/rides/create-ride';
import { RIDES_PATH } from '../../../src/core/paths/paths';
import { getRideById } from '../../utils/rides/get-ride-by-id';
import { getDriverById } from '../../utils/drivers/get-driver-by-id';
import { runDB, stopDb } from '../../../src/db/mongo.db';

describe('Rides API', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB(
      'mongodb://root:example@localhost:27017,localhost:27018,localhost:27019/nest?retryWrites=true&loadBalanced=false&replicaSet=rs0&authSource=admin&readPreference=primary',
    );
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it('✅ should create ride; POST /api/rides', async () => {
    const driver = await createDriver(app);

    const createdRide = await createRide(app, { driverId: driver.id });

    expect(createdRide.status).toBe(RideStatus.InProgress);
  });

  it('✅ should return rides list; GET /api/rides', async () => {
    const driver2 = await createDriver(app, {
      name: 'Sam',
      email: 'sam@example.com',
    });

    await createRide(app, { driverId: driver2.id });

    const rideListResponse = await request(app)
      .get(RIDES_PATH)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(rideListResponse.body).toBeInstanceOf(Array);
    expect(rideListResponse.body).toHaveLength(2);
  });

  it('✅ should return ride by id; GET /api/rides/:id', async () => {
    const driver = await createDriver(app);

    const createdRide = await createRide(app, {
      driverId: driver.id,
    });

    const getRide = await getRideById(app, createdRide.id);

    expect(getRide).toEqual({
      ...createdRide,
      id: expect.any(String),
      startedAt: expect.any(String),
      finishedAt: null,
    });
  });

  it('✅ should finish ride; POST /api/rides/:id/actions/finish', async () => {
    const driver = await createDriver(app);

    const createdRide = await createRide(app, {
      driverId: driver.id,
    });

    await request(app)
      .post(`${RIDES_PATH}/${createdRide.id}/actions/finish`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    const getRide = await getRideById(app, createdRide.id);

    expect(getRide).toEqual({
      ...createdRide,
      status: RideStatus.Finished,
      startedAt: expect.any(String),
      finishedAt: expect.any(String),
    });

    const getDriver = await getDriverById(app, driver.id);

    expect(getDriver).toEqual({
      ...driver,
      status: DriverStatus.Online,
    });
  });
});
