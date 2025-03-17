import { Currency, RideStatus } from './ride';

export type RideViewModel = {
  id: string;
  clientName: string;
  driverId: string;
  driverName: string;
  vehicleLicensePlate: string;
  vehicleName: string;
  price: number;
  currency: Currency;
  status: RideStatus;
  startedAt: Date | null;
  finishedAt: Date | null;
  addresses: {
    from: string;
    to: string;
  };
};
