// @ts-ignore
import request from 'supertest';
// @ts-ignore
import express from 'express';
import { VehicleFeature } from '../../../src/drivers/types/driver';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { DriverInputDto } from '../../../src/drivers/dto/driver.input-dto';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { getDriverDto } from '../../utils/drivers/get-driver-dto';
import { clearDb } from '../../utils/clear-db';
import { createDriver } from '../../utils/drivers/create-driver';
import { DRIVERS_PATH } from '../../../src/core/paths/paths';
import { getDriverById } from '../../utils/drivers/get-driver-by-id';

describe('Driver API body validation check', () => {
  const app = express();
  setupApp(app);

  const correctTestDriverData: DriverInputDto = getDriverDto();

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await clearDb(app);
  });

  it(`❌ should not create driver when incorrect body passed; POST /api/drivers'`, async () => {
    await request(app)
      .post(DRIVERS_PATH)
      .send(correctTestDriverData)
      .expect(HttpStatus.Unauthorized);

    const invalidDataSet1 = await request(app)
      .post(DRIVERS_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send({
        name: '   ', // empty string
        phoneNumber: '    ', // empty string
        email: 'invalid email', // incorrect email
        vehicleMake: '', // empty string
        vehicleModel: 'A6',
        vehicleYear: 2020,
        vehicleLicensePlate: 'XYZ-456',
        vehicleDescription: null,
        vehicleFeatures: [],
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .post(DRIVERS_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send({
        name: 'Feodor',
        phoneNumber: '', // empty string
        email: 'feodor@example.com',
        vehicleModel: '', // empty string
        vehicleLicensePlate: '', // empty string
        vehicleMake: '', // empty string
        vehicleYear: 2020,
        vehicleDescription: null,
        vehicleFeatures: [],
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(4);

    const invalidDataSet3 = await request(app)
      .post(DRIVERS_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send({
        name: 'Feodor',
        email: 'feodor@example.com',
        phoneNumber: '', // empty string
        vehicleModel: '', // empty string
        vehicleLicensePlate: '', // empty string
        vehicleMake: '', // empty string
        vehicleYear: 2020,
        vehicleDescription: null,
        vehicleFeatures: [],
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(4);

    // check что никто не создался
    const driverListResponse = await request(app)
      .get(DRIVERS_PATH)
      .set('Authorization', adminToken);
    expect(driverListResponse.body).toHaveLength(0);
  });

  it('❌ should not update driver when incorrect data passed; PUT /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app, correctTestDriverData);

    const invalidDataSet1 = await request(app)
      .put(`${DRIVERS_PATH}/${createdDriver.id}`)
      .set('Authorization', generateBasicAuthToken())
      .send({
        name: '   ',
        phoneNumber: '    ',
        email: 'invalid email',
        vehicleMake: '',
        vehicleModel: 'A6',
        vehicleYear: 2020,
        vehicleLicensePlate: 'XYZ-456',
        vehicleDescription: null,
        vehicleFeatures: [],
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .put(`${DRIVERS_PATH}/${createdDriver.id}`)
      .set('Authorization', generateBasicAuthToken())
      .send({
        name: 'Ted',
        email: 'ted@example.com',
        vehicleMake: 'Audi',
        vehicleYear: 2020,
        vehicleDescription: null,
        vehicleFeatures: [],
        phoneNumber: '', // empty string
        vehicleModel: '', // empty string
        vehicleLicensePlate: '', // empty string
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(3);

    const invalidDataSet3 = await request(app)
      .put(`${DRIVERS_PATH}/${createdDriver.id}`)
      .set('Authorization', generateBasicAuthToken())
      .send({
        name: 'A', //too short
        phoneNumber: '987-654-3210',
        email: 'feodor@example.com',
        vehicleMake: 'Audi',
        vehicleModel: 'A6',
        vehicleYear: 2020,
        vehicleLicensePlate: 'XYZ-456',
        vehicleDescription: null,
        vehicleFeatures: [],
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

    const driverResponse = await getDriverById(app, createdDriver.id);

    expect(driverResponse).toEqual({
      ...correctTestDriverData,
      id: createdDriver.id,
      createdAt: expect.any(String),
    });
  });

  it('❌ should not update driver when incorrect features passed; PUT /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app, correctTestDriverData);

    await request(app)
      .put(`${DRIVERS_PATH}/${createdDriver.id}`)
      .set('Authorization', generateBasicAuthToken())
      .send({
        name: 'Ted',
        phoneNumber: '987-654-3210',
        email: 'ted@example.com',
        vehicleMake: 'Audi',
        vehicleModel: 'A6',
        vehicleYear: 2020,
        vehicleLicensePlate: 'XYZ-456',
        vehicleDescription: null,
        vehicleFeatures: [
          VehicleFeature.ChildSeat,
          'invalid-feature' as VehicleFeature,
          VehicleFeature.WiFi,
        ],
      })
      .expect(HttpStatus.BadRequest);

    const driverResponse = await getDriverById(app, createdDriver.id);

    expect(driverResponse).toEqual({
      ...correctTestDriverData,
      id: createdDriver.id,
      createdAt: expect.any(String),
    });
  });
});
