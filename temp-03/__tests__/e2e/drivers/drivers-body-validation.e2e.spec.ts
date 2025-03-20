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
import { getDriverDto } from '../../utils/drivers/get-driver-dto';
import { clearDb } from '../../utils/clear-db';
import { createDriver } from '../../utils/drivers/create-driver';
import { ValidationErrorDto } from '../../../src/core/types/validationError.dto';
import { DRIVERS_PATH } from '../../../src/core/paths/paths';
import { updateDriver } from '../../utils/drivers/update-driver';
import { getDriverById } from '../../utils/drivers/get-driver-by-id';
import { runDB, stopDb } from '../../../src/db/mongo.db';

describe('Driver API body validation check', () => {
  const app = express();
  setupApp(app);

  const correctTestDriverData: DriverInputDto = getDriverDto();

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

  it(`❌ should not create driver when incorrect body passed; POST /api/drivers'`, async () => {
    await request(app)
      .post(DRIVERS_PATH)
      .send(correctTestDriverData)
      .expect(HttpStatus.Unauthorized);

    const invalidDataSet1 = await createDriver<ValidationErrorDto>(
      app,
      {
        name: '   ', // empty string
        phoneNumber: '    ', // empty string
        email: 'invalid email', // incorrect email
        vehicleMake: '', // empty string
      },
      HttpStatus.BadRequest,
    );

    expect(invalidDataSet1.errorMessages).toHaveLength(4);

    const invalidDataSet2 = await createDriver<ValidationErrorDto>(
      app,
      {
        phoneNumber: '', // empty string
        vehicleModel: '', // empty string
        vehicleLicensePlate: '', // empty string
        vehicleMake: '', // empty string
      },
      HttpStatus.BadRequest,
    );

    expect(invalidDataSet2.errorMessages).toHaveLength(4);

    const invalidDataSet3 = await createDriver<ValidationErrorDto>(
      app,
      {
        name: 'A', // too shot
      },
      HttpStatus.BadRequest,
    );

    expect(invalidDataSet3.errorMessages).toHaveLength(1);

    // check что никто не создался
    const driverListResponse = await request(app)
      .get(DRIVERS_PATH)
      .set('Authorization', adminToken);
    expect(driverListResponse.body).toHaveLength(0);
  });

  it('❌ should not update driver when incorrect data passed; PUT /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app, correctTestDriverData);

    const invalidDataSet1 = await updateDriver<ValidationErrorDto>(
      app,
      createdDriver.id,
      {
        name: '   ',
        phoneNumber: '    ',
        email: 'invalid email',
        vehicleMake: '',
      },
      HttpStatus.BadRequest,
    );

    expect(invalidDataSet1.errorMessages).toHaveLength(4);

    const invalidDataSet2 = await updateDriver<ValidationErrorDto>(
      app,
      createdDriver.id,
      {
        phoneNumber: '', // empty string
        vehicleModel: '', // empty string
        vehicleLicensePlate: '', // empty string
      },
      HttpStatus.BadRequest,
    );

    expect(invalidDataSet2.errorMessages).toHaveLength(3);

    const invalidDataSet3 = await updateDriver<ValidationErrorDto>(
      app,
      createdDriver.id,
      {
        name: 'A', //too short
      },
      HttpStatus.BadRequest,
    );

    expect(invalidDataSet3.errorMessages).toHaveLength(1);

    const driverResponse = await getDriverById(app, createdDriver.id);

    expect(driverResponse).toEqual({
      id: createdDriver.id,
      name: correctTestDriverData.name,
      phoneNumber: correctTestDriverData.phoneNumber,
      email: correctTestDriverData.email,
      vehicle: {
        description: correctTestDriverData.vehicleDescription,
        features: correctTestDriverData.vehicleFeatures,
        licensePlate: correctTestDriverData.vehicleLicensePlate,
        make: correctTestDriverData.vehicleMake,
        model: correctTestDriverData.vehicleModel,
        year: correctTestDriverData.vehicleYear,
      },
      createdAt: expect.any(String),
      status: DriverStatus.Online,
    });
  });

  it('❌ should not update driver when incorrect features passed; PUT /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app, correctTestDriverData);

    await updateDriver<ValidationErrorDto>(
      app,
      createdDriver.id,
      {
        vehicleFeatures: [
          VehicleFeature.ChildSeat,
          'invalid-feature' as VehicleFeature,
          VehicleFeature.WiFi,
        ],
      },
      HttpStatus.BadRequest,
    );

    const driverResponse = await getDriverById(app, createdDriver.id);

    expect(driverResponse).toEqual({
      id: createdDriver.id,
      name: correctTestDriverData.name,
      phoneNumber: correctTestDriverData.phoneNumber,
      email: correctTestDriverData.email,
      vehicle: {
        description: correctTestDriverData.vehicleDescription,
        features: correctTestDriverData.vehicleFeatures,
        licensePlate: correctTestDriverData.vehicleLicensePlate,
        make: correctTestDriverData.vehicleMake,
        model: correctTestDriverData.vehicleModel,
        year: correctTestDriverData.vehicleYear,
      },
      createdAt: expect.any(String),
      status: DriverStatus.Online,
    });
  });

  it('❌ should not update driver status when incorrect status passed; PUT /api/drivers/:id/activity', async () => {
    const createdDriver = await createDriver(app, correctTestDriverData);

    const driverBeforeUpdateResponse = await getDriverById(
      app,
      createdDriver.id,
    );

    await request(app)
      .put(`${DRIVERS_PATH}/${createdDriver.id}/activity`)
      .set('Authorization', adminToken)
      .send({ status: 'invalid-status' })
      .expect(HttpStatus.BadRequest);

    const driverAfterUpdateResponse = await getDriverById(
      app,
      createdDriver.id,
    );

    expect(driverAfterUpdateResponse.status).toBe(
      driverBeforeUpdateResponse.status,
    );
  });
});
