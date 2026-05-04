import { CreateVehicleDTO } from "../dto/vehicleDto";
import { Vehicle, VehicleModel } from "../models/Vehicle.model";
import { AppError } from "../utils/appError";

export class VehicleService {
  async createVehicle(dto: CreateVehicleDTO): Promise<Vehicle> {
    const { user_id, model, year, make } = dto;

    if (!user_id || !model || !make) {
      throw new AppError("user_id, model and make are required", 400, {
        fields: ["user_id", "model", "make"],
      });
    }

    const vehicle = await VehicleModel.create({
      user_id,
      model,
      year: year ?? null,
      make,
    });

    return vehicle;
  }

  async findManyByUserId(userId: string): Promise<Vehicle[]> {
    if (!userId) {
      throw new AppError("userId is required", 400, {
        field: "userId",
      });
    }

    const vehicles = await VehicleModel.find({ user_id: userId });

    return vehicles;
  }
}

const vehicleService = new VehicleService();

export { vehicleService };