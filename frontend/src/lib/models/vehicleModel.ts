export interface VehicleModel {
  id: string
  userId: string
  model: string
  year: number | null
  make: string
  createdAt?: string
  updatedAt?: string
}

export interface ServerVehicleModel {
  _id: string
  user_id: string
  model: string
  year: number | null
  make: string
  createdAt: string
  updatedAt: string
}

export type Vehicle = VehicleModel
