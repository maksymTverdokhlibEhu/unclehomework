export interface UserResponseDto {
  id?: string | number
  name: string
  email: string
  createdAt?: string
  updatedAt?: string
  [key: string]: unknown
}
