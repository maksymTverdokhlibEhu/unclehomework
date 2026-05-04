import ApiClient from "../apiClient";
import type { CreateVehicleRequestDto, GetVehiclesRequestDto } from "./dto/request";
import type { GetVehiclesResponseDto } from "./dto/responseDto";

export class VehicleApi {
  private readonly apiClient: ApiClient;

  constructor(apiClient: ApiClient = new ApiClient(`${import.meta.env.VITE_API_VEHICLE_SERVICE}/vehicles`)) {
    this.apiClient = apiClient;
  }

  public async getVehicles(
    dto: GetVehiclesRequestDto = {},
  ): Promise<GetVehiclesResponseDto> {
    return this.apiClient.get<GetVehiclesResponseDto>("", dto);
  }

  public async createVehicle(
    dto: CreateVehicleRequestDto,
  ) {
    return this.apiClient.post("/vehicle", dto);
  }
}

export const vehicleApi = new VehicleApi();
