import { WithId } from 'mongodb';
import { Driver } from '../../types/driver';
import { DriverViewModel } from '../../types/driver-view-model';

export function mapToDriverViewModel(driver: WithId<Driver>): DriverViewModel {
  return {
    id: driver._id.toString(),
    name: driver.name,
    phoneNumber: driver.phoneNumber,
    email: driver.email,
    status: driver.status,
    vehicle: driver.vehicle,
    createdAt: driver.createdAt,
  };
}
