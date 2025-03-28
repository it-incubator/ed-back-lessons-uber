import { Currency, RideStatus } from './ride';

export type RideViewModel = {
  id: string;
  clientName: string;
  driver: {
    id: string;
    name: string;
  };
  vehicle: {
    licensePlate: string;
    name: string;
  };
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
