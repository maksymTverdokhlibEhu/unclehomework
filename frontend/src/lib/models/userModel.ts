export interface UserModel {
  id: string
  name: string
  email: string
  createdAt?: string
  updatedAt?: string
}

export interface ServerUserModel {
  _id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}
