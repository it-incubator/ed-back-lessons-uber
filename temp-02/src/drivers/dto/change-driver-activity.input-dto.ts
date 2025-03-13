import { DriverStatus } from '../types/driver';

export type ChangeDriverStatusInputDto =
  | DriverStatus.Offline
  | DriverStatus.Online;
