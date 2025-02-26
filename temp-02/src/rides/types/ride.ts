export enum Currency {
  USD = 'usd',
  EUR = 'eur',
}

export enum RideStatus {
  InProgress = 'in progress',
  Canceled = 'canceled',
  Finished = 'finished',
}

export type Ride = {
  id: number;
  clientName: string;
  driverId: number;
  driverName: string;
  vehicleLicensePlate: string;
  vehicleName: string;
  price: number;
  currency: Currency;
  status: RideStatus;
  createdAt: Date;
  updatedAt: Date | null;
  address: {
    start: string;
    end: string;
  };
};
