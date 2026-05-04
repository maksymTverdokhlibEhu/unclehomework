import type { VehicleResponseDto } from '../api/vehicleApi/dto/responseDto/vehicleResponseDto'
import type { VehicleByUserIdResponseDto } from '../api/userApi/dto/responseDto/getUserByIdResponseDto'
import type { ServerVehicleModel, VehicleModel } from '../models/vehicleModel'

type VehicleSourceModel =
  | Pick<VehicleResponseDto, 'user_id' | 'model' | 'year' | 'make' | 'id' | 'createdAt' | 'updatedAt'>
  | VehicleByUserIdResponseDto
  | ServerVehicleModel

export function mapServerVehicleToVehicleModel(vehicle: VehicleSourceModel): VehicleModel {
  return {
    id: String('_id' in vehicle ? vehicle._id : vehicle.id ?? ''),
    userId: 'user_id' in vehicle ? vehicle.user_id : (vehicle as { userId?: string }).userId ?? '',
    model: vehicle.model,
    year: vehicle.year ?? null,
    make: vehicle.make,
    createdAt: 'createdAt' in vehicle ? vehicle.createdAt : undefined,
    updatedAt: 'updatedAt' in vehicle ? vehicle.updatedAt : undefined,
  }
}
