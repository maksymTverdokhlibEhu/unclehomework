import ApiClient from '../apiClient'
import type { CreateUserRequestDto, GetUsersRequestDto } from './dto/request'
import type {
  CreateUserResponseDto,
  CreateUserMessageResponseDto,
  GetUserByIdResponseDto,
  GetUsersResponseDto,
} from './dto/responseDto'

export class UserApi {
  private readonly apiClient: ApiClient

  constructor(apiClient: ApiClient = new ApiClient(`${import.meta.env.VITE_API_USER_SERVICE}/users`)) {
    this.apiClient = apiClient
  }

  public async getUsers(dto: GetUsersRequestDto = {}): Promise<GetUsersResponseDto> {
    return this.apiClient.get<GetUsersResponseDto>('', dto)
  }

  public async getUserById(id: string): Promise<GetUserByIdResponseDto> {
    return this.apiClient.get<GetUserByIdResponseDto>(`/${id}`)
  }

  public async createUser(dto: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    return this.apiClient.post<CreateUserResponseDto>('/user', dto)
  }

  public async createUserRaw(dto: CreateUserRequestDto) {
    return this.apiClient.getInstance().post<CreateUserMessageResponseDto>('/user', dto)
  }
}

export const userApi = new UserApi()
