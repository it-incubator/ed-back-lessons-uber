import { DriverStatus, VehicleFeature } from './driver';

export type DriverViewModel = {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  status: DriverStatus;
  vehicle: {
    make: string; // e.g., Toyota
    model: string; // e.g., Camry
    year: number;
    licensePlate: string;
    description: string | null;
    features: VehicleFeature[];
  };
  createdAt: Date;
};
