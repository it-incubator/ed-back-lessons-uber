import { DriverStatus, VehicleFeature } from './driver';

export type DriverViewModel = {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  status: DriverStatus;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleLicensePlate: string;
  vehicleDescription: string | null;
  vehicleFeatures: VehicleFeature[];
  createdAt: Date;
};
