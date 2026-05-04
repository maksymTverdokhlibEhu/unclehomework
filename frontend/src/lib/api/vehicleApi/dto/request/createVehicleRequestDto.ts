export interface CreateVehicleRequestDto {
  user_id: string;
  model: string;
  year?: number | null;
  make: string;
}
