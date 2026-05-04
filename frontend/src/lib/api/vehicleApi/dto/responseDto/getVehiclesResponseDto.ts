import type { VehicleResponseDto } from './vehicleResponseDto';

export interface GetVehiclesResponseDto {
  items: VehicleResponseDto[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
}
