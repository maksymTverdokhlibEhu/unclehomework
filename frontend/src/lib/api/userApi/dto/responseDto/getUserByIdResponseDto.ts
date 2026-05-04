import type { VehicleResponseDto } from '../../../vehicleApi/dto/responseDto/vehicleResponseDto'

export interface UserByIdResponseDto {
  _id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface VehicleByUserIdResponseDto extends VehicleResponseDto {
  _id: string
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface GetUserByIdResponseDto {
  user: UserByIdResponseDto
  vehicles: VehicleByUserIdResponseDto[]
}
