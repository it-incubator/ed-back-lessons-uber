import { Request, Response } from 'express';
import { DriverInputDto } from '../../dto/driver.input-dto';
import { HttpStatus } from '../../../core/types/http-statuses';
import { driversRepository } from '../../repositories/drivers.repository';
import { Driver, DriverStatus } from '../../types/driver';
import { createDriverViewModel } from '../util/create-driver-view-model.util';

export async function createDriverHandler(
  req: Request<{}, {}, DriverInputDto>,
  res: Response,
) {
  const newDriver: Driver = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    status: DriverStatus.Online,
    vehicleMake: req.body.vehicleMake,
    vehicleModel: req.body.vehicleModel,
    vehicleYear: req.body.vehicleYear,
    vehicleLicensePlate: req.body.vehicleLicensePlate,
    vehicleDescription: req.body.vehicleDescription,
    vehicleFeatures: req.body.vehicleFeatures,
    createdAt: new Date(),
  };

  const createdDriver = await driversRepository.create(newDriver);

  const driverViewModel = createDriverViewModel(createdDriver);

  res.status(HttpStatus.Created).send(driverViewModel);
}
