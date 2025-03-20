import { Currency } from '../types/ride';

export type RideInputDto = {
  clientName: string;
  price: number;
  currency: Currency;
  driverId: string;
  startAddress: string;
  endAddress: string;
};
