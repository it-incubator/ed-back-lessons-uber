export enum Currency {
  USD = 'usd',
  EUR = 'eur',
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
  createdAt: Date;
  updatedAt: Date | null;
  addresses: {
    from: string;
    to: string;
  };
};
