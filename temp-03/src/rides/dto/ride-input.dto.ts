import { Currency } from '../types/ride';

export type RideInputDto = {
  clientName: string;
  price: number;
  currency: Currency;
  driverId: string;
  fromAddress: string;
  toAddress: string;
};
