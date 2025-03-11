import { RideInputDto } from '../../../src/rides/dto/ride-input.dto';
import { Currency } from '../../../src/rides/types/ride';

export function getRideDto(driverId: number): RideInputDto {
  return {
    driverId,
    clientName: 'Bob',
    price: 200,
    currency: Currency.USD,
    startAddress: '123 Main St, Springfield, IL',
    endAddress: '456 Elm St, Shelbyville, IL',
  };
}
