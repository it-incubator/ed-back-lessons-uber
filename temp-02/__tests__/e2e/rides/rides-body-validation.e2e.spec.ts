import express from 'express';
import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { RideInputDto } from '../../../src/rides/dto/ride-input.dto';
import { Currency, RideStatus } from '../../../src/rides/types/ride';
import { createDriver } from '../../utils/create-driver';
import { DriverStatus } from '../../../src/drivers/types/driver';

describe('Rides API body validation check', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  const testRideData: Partial<RideInputDto> = {
    clientName: 'Bob',
    price: 200,
    currency: Currency.USD,
    startAddress: '123 Main St, Springfield, IL',
    endAddress: '456 Elm St, Shelbyville, IL',
  };

  beforeAll(async () => {
    await request(app)
      .delete('/api/testing/all-data')
      .expect(HttpStatus.NoContent);
  });

  it(`should not create ride when incorrect body passed; POST /api/rides'`, async () => {
    await request(app)
      .post('/api/rides')
      .send(testRideData)
      .expect(HttpStatus.Unauthorized);

    const invalidDataSet1 = await request(app)
      .post('/api/rides')
      .set('Authorization', adminToken)
      .send({
        ...testRideData,
        clientName: '   ', // empty string
        price: 'bla bla', // not a number
        currency: 1, // not a string
        startAddress: '', // empty string
        endAddress: true, // not a string
        driverId: 'bam', //not a number
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(6);

    const invalidDataSet2 = await request(app)
      .post('/api/rides')
      .set('Authorization', adminToken)
      .send({
        ...testRideData,
        clientName: 'LA', // short string
        price: 0, // can not be 0
        currency: 'byn', // not in Currency
        startAddress: 'street', // short string
        driverId: 0, //can not be 0
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(5);

    const invalidDataSet3 = await request(app)
      .post('/api/rides')
      .set('Authorization', adminToken)
      .send({
        ...testRideData,
        driverId: 5000, //driver should exist
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

    // check что никто не создался
    const riderListResponse = await request(app)
      .get('/api/rides')
      .set('Authorization', adminToken);

    expect(riderListResponse.body).toHaveLength(0);
  });

  it('should not update ride status when ride already been finished; PUT /api/rides/:id/status', async () => {
    const driver = await createDriver(app);

    const createdRideResponse = await request(app)
      .post('/api/rides')
      .set('Authorization', adminToken)
      .send({ ...testRideData, driverId: driver.id })
      .expect(HttpStatus.Created);

    const createdRideId = createdRideResponse.body.id;

    await request(app)
      .put(`/api/rides/${createdRideId}/finish`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    await request(app)
      .put(`/api/rides/${createdRideId}/finish`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.BadRequest);

    const rideAfterUpdateResponse = await request(app)
      .get(`/api/rides/${createdRideId}`)
      .set('Authorization', adminToken);

    expect(rideAfterUpdateResponse.body.status).toBe(RideStatus.Finished);

    const driverAfterUpdateResponse = await request(app)
      .get(`/api/drivers/${createdRideId}`)
      .set('Authorization', adminToken);

    expect(driverAfterUpdateResponse.body.status).toBe(DriverStatus.Online);
  });
});
