import { WithId } from 'mongodb';
import { Driver } from '../../types/driver';
import { DriverViewModel } from '../../types/driver-view-model';

export function createDriverViewModel(driver: WithId<Driver>): DriverViewModel {
  return {
    id: driver._id.toString(),
    name: driver.name,
    phoneNumber: driver.phoneNumber,
    email: driver.email,
    status: driver.status,
    vehicleMake: driver.vehicleMake,
    vehicleModel: driver.vehicleModel,
    vehicleYear: driver.vehicleYear,
    vehicleLicensePlate: driver.vehicleLicensePlate,
    vehicleDescription: driver.vehicleDescription,
    vehicleFeatures: driver.vehicleFeatures,
    createdAt: driver.createdAt,
  };
}
