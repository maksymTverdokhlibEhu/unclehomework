import type { UserResponseDto } from '../api/userApi/dto/responseDto/userResponseDto'
import type { UserByIdResponseDto } from '../api/userApi/dto/responseDto/getUserByIdResponseDto'
import type { ServerUserModel, UserModel } from '../models/userModel'

type UserSourceModel =
  | Pick<UserResponseDto, 'name' | 'email' | 'id' | 'createdAt' | 'updatedAt'>
  | UserByIdResponseDto
  | ServerUserModel

export function mapServerUserToUserModel(user: UserSourceModel): UserModel {
  return {
    id: String('_id' in user ? user._id : user.id ?? ''),
    name: user.name,
    email: user.email,
    createdAt: 'createdAt' in user ? user.createdAt : undefined,
    updatedAt: 'updatedAt' in user ? user.updatedAt : undefined,
  }
}
