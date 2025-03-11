import express from 'express';
import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { RideStatus } from '../../../src/rides/types/ride';
import { createDriver } from '../../utils/drivers/create-driver';
import { DriverStatus } from '../../../src/drivers/types/driver';
import { clearDb } from '../../utils/clear-db';
import { createRide } from '../../utils/rides/create-ride';
import { RideInputDto } from '../../../src/rides/dto/ride-input.dto';
import { ValidationErrorDto } from '../../../src/core/types/validationError.dto';
import { RIDES_PATH } from '../../../src/core/paths/paths';
import { getRideById } from '../../utils/rides/get-ride-by-id';
import { getDriverById } from '../../utils/drivers/get-driver-by-id';

describe('Rides API body validation check', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await clearDb(app);
  });

  it(`❌ should not create ride when incorrect body passed; POST /api/rides'`, async () => {
    await request(app)
      .post('/api/rides')
      .send({})
      .expect(HttpStatus.Unauthorized);

    const invalidDataSet1 = await createRide<ValidationErrorDto>(
      app,
      {
        clientName: '   ', // empty string
        price: 'bla bla', // not a number
        currency: 1, // not a string
        startAddress: '', // empty string
        endAddress: true, // not a string
        driverId: 'bam', //not a number
      } as unknown as Partial<RideInputDto>,
      HttpStatus.BadRequest,
    );

    expect(invalidDataSet1.errorMessages).toHaveLength(6);

    const invalidDataSet2 = await createRide<ValidationErrorDto>(
      app,
      {
        clientName: 'LA', // short string
        price: 0, // can not be 0
        currency: 'byn', // not in Currency
        startAddress: 'street', // short string
        driverId: 0, //can not be 0
      } as unknown as Partial<RideInputDto>,
      HttpStatus.BadRequest,
    );

    expect(invalidDataSet2.errorMessages).toHaveLength(5);

    const invalidDataSet3 = await createRide<ValidationErrorDto>(
      app,
      {
        driverId: 5000, //driver should exist
      } as unknown as Partial<RideInputDto>,
      HttpStatus.BadRequest,
    );

    expect(invalidDataSet3.errorMessages).toHaveLength(1);

    // check что никто не создался
    const riderListResponse = await request(app)
      .get(RIDES_PATH)
      .set('Authorization', adminToken);

    expect(riderListResponse.body).toHaveLength(0);
  });

  it('❌ should not update ride status when ride already been finished; POST /api/rides/:id/actions/finish', async () => {
    const driver = await createDriver(app);

    const createdRide = await createRide(app, { driverId: driver.id });

    await request(app)
      .post(`${RIDES_PATH}/${createdRide.id}/actions/finish`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    await request(app)
      .post(`${RIDES_PATH}/${createdRide.id}/actions/finish`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.BadRequest);

    const rideAfterUpdate = await getRideById(app, createdRide.id);

    expect(rideAfterUpdate.status).toBe(RideStatus.Finished);

    const driverAfterUpdate = await getDriverById(app, createdRide.driverId);

    expect(driverAfterUpdate.status).toBe(DriverStatus.Online);
  });
});
