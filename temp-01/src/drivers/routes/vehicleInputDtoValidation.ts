import { DriverInputDto } from '../dto/driver.input-dto';
import { VehicleFeature } from '../types/driver';
import { ValidationError } from '../types/validationError';

export const vehicleInputDtoValidation = (
  data: DriverInputDto,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (
    !data.name ||
    typeof data.name !== 'string' ||
    data.name.trim().length < 2 ||
    data.name.trim().length > 15
  ) {
    errors.push({ field: 'name', message: 'Invalid name' });
  }

  if (
    !data.name ||
    typeof data.name !== 'string' ||
    data.name.trim().length < 2 ||
    data.name.trim().length > 20
  ) {
    errors.push({ field: 'driver', message: 'Invalid driver' });
  }

  if (!data.vehicleYear || typeof data.vehicleYear !== 'number') {
    errors.push({ field: 'vehicleYear', message: 'Invalid vehicleYear' });
  }

  if (
    data.vehicleDescription !== null &&
    (typeof data.vehicleDescription !== 'string' ||
      data.vehicleDescription.trim().length < 10 ||
      data.vehicleDescription.trim().length > 200)
  ) {
    errors.push({
      field: 'vehicleDescription',
      message: 'Invalid vehicleDescription',
    });
  }

  if (!Array.isArray(data.vehicleFeatures)) {
    errors.push({
      field: 'vehicleFeatures',
      message: 'vehicleFeatures must be array',
    });
  } else {
    const existingFeatures = Object.values(VehicleFeature);
    if (
      data.vehicleFeatures.length > existingFeatures.length ||
      data.vehicleFeatures.length < 1
    ) {
      errors.push({
        field: 'vehicleFeatures',
        message: 'Invalid vehicleFeatures',
      });
    }
    for (const feature of data.vehicleFeatures) {
      if (!existingFeatures.includes(feature)) {
        errors.push({
          field: 'features',
          message: 'Invalid vehicleFeature:' + feature,
        });
        break;
      }
    }
  }

  return errors;
};
