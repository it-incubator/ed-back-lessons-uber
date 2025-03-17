// @ts-ignore
import request from 'supertest';
// @ts-ignore
import express from 'express';

import {
  DriverStatus,
  VehicleFeature,
} from '../../../src/drivers/types/driver';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { DriverInputDto } from '../../../src/drivers/dto/driver.input-dto';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { DRIVERS_PATH } from '../../../src/core/paths/paths';
import { createDriver } from '../../utils/drivers/create-driver';
import { getDriverDto } from '../../utils/drivers/get-driver-dto';
import { clearDb } from '../../utils/clear-db';
import { getDriverById } from '../../utils/drivers/get-driver-by-id';
import { updateDriver } from '../../utils/drivers/update-driver';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/core/settings/settings';

describe('Driver API', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL_TEST);
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it('✅ should create driver; POST /api/drivers', async () => {
    const newDriver: DriverInputDto = {
      ...getDriverDto(),
      name: 'Feodor',
      email: 'feodor@example.com',
    };

    const createdDriver = await createDriver(app, newDriver);

    expect(createdDriver.status).toBe(DriverStatus.Online);
  });

  it('✅ should return drivers list; GET /api/drivers', async () => {
    await createDriver(app, { name: 'Another Driver' });
    await createDriver(app, { name: 'Another Driver2' });

    const response = await request(app)
      .get(DRIVERS_PATH)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
  });

  it('✅ should return driver by id; GET /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app, { name: 'Den' });

    const driver = await getDriverById(app, createdDriver.id);

    expect(driver).toEqual({
      ...createdDriver,
      id: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it('✅ should update driver; PUT /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app, { name: 'Another Driver' });

    const driverUpdateData: DriverInputDto = {
      name: 'Updated Name',
      phoneNumber: '999-888-7777',
      email: 'updated@example.com',
      vehicleMake: 'Tesla',
      vehicleModel: 'Model S',
      vehicleYear: 2022,
      vehicleLicensePlate: 'NEW-789',
      vehicleDescription: 'Updated vehicle description',
      vehicleFeatures: [VehicleFeature.ChildSeat],
    };

    await updateDriver(app, createdDriver.id, driverUpdateData);

    const driverResponse = await getDriverById(app, createdDriver.id);

    expect(driverResponse).toEqual({
      ...driverUpdateData,
      id: createdDriver.id,
      createdAt: expect.any(String),
      status: DriverStatus.Online,
    });
  });

  it('✅ should update driver status; PUT /api/drivers/:id/status', async () => {
    const createdDriver = await createDriver(app, { name: 'Another Driver' });

    const statusUpdateData = {
      status: DriverStatus.Offline,
    };

    await request(app)
      .put(`${DRIVERS_PATH}/${createdDriver.id}/activity`)
      .set('Authorization', adminToken)
      .send(statusUpdateData)
      .expect(HttpStatus.NoContent);

    const driverResponse = await getDriverById(app, createdDriver.id);

    expect(driverResponse.status).toBe(DriverStatus.Offline);
  });

  it('✅ should delete driver and check after "NOT FOUND"; DELETE /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app, { name: 'Another Driver' });

    await request(app)
      .delete(`${DRIVERS_PATH}/${createdDriver.id}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    await getDriverById<null>(app, createdDriver.id, HttpStatus.NotFound);
  });
});
