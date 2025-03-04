import express from 'express';
import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { DriverInputDto } from '../../../src/drivers/dto/driver.input-dto';
import { Driver, VehicleFeature } from '../../../src/drivers/types/driver';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { RideInputDto } from '../../../src/rides/dto/ride-input.dto';
import { Currency, RideStatus } from '../../../src/rides/types/ride';

describe('Rides API body validation check', () => {
  const app = express();
  setupApp(app);

  const testDriverData: DriverInputDto = {
    name: 'Valentin',
    phoneNumber: '123-456-7890',
    email: 'valentin@example.com',
    vehicleMake: 'BMW',
    vehicleModel: 'X5',
    vehicleYear: 2021,
    vehicleLicensePlate: 'ABC-123',
    vehicleDescription: 'Some description',
    vehicleFeatures: [VehicleFeature.ChildSeat],
  };

  let driver: Driver;

  const adminToken = generateBasicAuthToken();

  const testRideData: Partial<RideInputDto> = {
    clientName: 'Bob',
    price: 200,
    currency: Currency.USD,
    startAddress: '123 Main St, Springfield, IL',
    endAddress: '456 Elm St, Shelbyville, IL',
  };

  beforeEach(async () => {
    await request(app)
      .delete('/api/testing/all-data')
      .expect(HttpStatus.NoContent);

    const createdDriverResponse = await request(app)
      .post('/api/drivers')
      .set('Authorization', adminToken)
      .send(testDriverData)
      .expect(HttpStatus.Created);

    driver = createdDriverResponse.body;
  });

  it(`should not create ride when incorrect body passed; POST /api/rides'`, async () => {
    await request(app)
      .post('/api/rides')
      .send(testRideData)
      .expect(HttpStatus.Unauthorized);

    const response1 = await request(app)
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

    expect(response1.body.errorMessages).toHaveLength(6);

    const response2 = await request(app)
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

    expect(response2.body.errorMessages).toHaveLength(5);

    const response3 = await request(app)
      .post('/api/rides')
      .set('Authorization', adminToken)
      .send({
        ...testRideData,
        driverId: 5000, //driver should exist
      })
      .expect(HttpStatus.NotFound);

    expect(response3.body.errorMessages).toHaveLength(1);

    // check что никто не создался
    const response = await request(app)
      .get('/api/rides')
      .set('Authorization', adminToken);

    expect(response.body).toHaveLength(0);
  });

  it('should not update ride status when incorrect status passed; PUT /api/rides/:id/status', async () => {
    const createdRideResponse = await request(app)
      .post('/api/rides')
      .set('Authorization', adminToken)
      .send({ ...testRideData, driverId: driver.id })
      .expect(HttpStatus.Created);

    const createdRideId = createdRideResponse.body.id;

    const rideBeforeUpdateResponse = await request(app)
      .get(`/api/rides/${createdRideId}`)
      .send(testRideData);

    await request(app)
      .put(`/api/drivers/${createdRideId}/status`)
      .set('Authorization', adminToken)
      .send({ status: 'invalid-status' }) //status not in RideStatus
      .expect(HttpStatus.BadRequest);

    await request(app)
      .put(`/api/drivers/${createdRideId}/status`)
      .set('Authorization', adminToken)
      .send({ status: RideStatus.InProgress }) //status not RideStatus.Finished
      .expect(HttpStatus.BadRequest);

    const rideAfterUpdateResponse = await request(app).get(
      `/api/drivers/${createdRideId}`,
    );

    expect(rideAfterUpdateResponse.body.status).toBe(
      rideBeforeUpdateResponse.body.status,
    );
  });
});
