export interface VehicleResponseDto {
  id?: string | number
  _id?: string
  user_id: string
  model: string
  year?: number | null
  make: string
  createdAt?: string
  updatedAt?: string
  [key: string]: unknown
}
