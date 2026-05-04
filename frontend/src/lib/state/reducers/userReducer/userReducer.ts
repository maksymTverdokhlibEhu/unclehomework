import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { mapServerUserToUserModel, mapServerVehicleToVehicleModel } from '../../../mappers'
import { userApi } from '../../../api/userApi'
import type { GetUsersRequestDto } from '../../../api/userApi/dto/request'
import type { CreateUserRequestDto } from '../../../api/userApi/dto/request'
import { isAppError } from '../../../api/appError'
import type { UserModel } from '../../../models/userModel'
import type { VehicleModel } from '../../../models/vehicleModel'

interface RequestState {
  isLoading: boolean
  error: string | null
}

export interface UserState {
  users: UserModel[]
  selectedUser: UserModel | null
  selectedUserVehicles: VehicleModel[]
  fetchUsersState: RequestState
  fetchSelectedUserState: RequestState
  addUserState: RequestState
}

interface SelectedUserPayload {
  user: UserModel
  vehicles: VehicleModel[]
}

const createRequestState = (): RequestState => ({
  isLoading: false,
  error: null,
})

const initialState: UserState = {
  users: [],
  selectedUser: null,
  selectedUserVehicles: [],
  fetchUsersState: createRequestState(),
  fetchSelectedUserState: createRequestState(),
  addUserState: createRequestState(),
}

const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (isAppError(error)) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallbackMessage
}

const normalizeUsersResponse = (response: Awaited<ReturnType<typeof userApi.getUsers>>): UserModel[] => {
  return response.items.map(mapServerUserToUserModel)
}

const normalizeUserByIdResponse = (
  response: Awaited<ReturnType<typeof userApi.getUserById>>,
): SelectedUserPayload => {
  return {
    user: mapServerUserToUserModel(response.user),
    vehicles: response.vehicles.map(mapServerVehicleToVehicleModel),
  }
}

export const fetchUsersAsync = createAsyncThunk<
  UserModel[],
  GetUsersRequestDto | undefined,
  { rejectValue: string }
>('user/fetchUsers', async (requestDto, thunkApi) => {
  try {
    const response = await userApi.getUsers(requestDto)

    return normalizeUsersResponse(response)
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error, 'Failed to load users'))
  }
})

export const fetchUserByIdAsync = createAsyncThunk<
  SelectedUserPayload,
  string,
  { rejectValue: string }
>('user/fetchUserById', async (id, thunkApi) => {
  try {
    const response = await userApi.getUserById(id)

    return normalizeUserByIdResponse(response)
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error, 'Failed to load user'))
  }
})

export const addUserAsync = createAsyncThunk<
  UserModel,
  CreateUserRequestDto,
  { rejectValue: string }
>('user/addUser', async (userDto, thunkApi) => {
  try {
    const response = await userApi.createUser(userDto)

    return mapServerUserToUserModel(response)
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error, 'Failed to add user'))
  }
})

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<UserModel[]>) {
      state.users = action.payload
      state.fetchUsersState.error = null
    },
    setUser(state, action: PayloadAction<UserModel | null>) {
      state.selectedUser = action.payload
      state.selectedUserVehicles = []
      state.addUserState.error = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUsersAsync.pending, state => {
        state.fetchUsersState.isLoading = true
        state.fetchUsersState.error = null
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.fetchUsersState.isLoading = false
        state.users = action.payload
        state.fetchUsersState.error = null
      })
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.fetchUsersState.isLoading = false
        state.fetchUsersState.error = action.payload ?? action.error.message ?? 'Failed to load users'
      })
      .addCase(fetchUserByIdAsync.pending, state => {
        state.fetchSelectedUserState.isLoading = true
        state.fetchSelectedUserState.error = null
        state.selectedUser = null
        state.selectedUserVehicles = []
      })
      .addCase(fetchUserByIdAsync.fulfilled, (state, action) => {
        state.fetchSelectedUserState.isLoading = false
        state.selectedUser = action.payload.user
        state.selectedUserVehicles = action.payload.vehicles
        state.fetchSelectedUserState.error = null
      })
      .addCase(fetchUserByIdAsync.rejected, (state, action) => {
        state.fetchSelectedUserState.isLoading = false
        state.fetchSelectedUserState.error = action.payload ?? action.error.message ?? 'Failed to load user'
      })
      .addCase(addUserAsync.pending, state => {
        state.addUserState.isLoading = true
        state.addUserState.error = null
      })
      .addCase(addUserAsync.fulfilled, (state, action) => {
        state.addUserState.isLoading = false
        state.users.push(action.payload)
        state.selectedUser = action.payload
        state.selectedUserVehicles = []
        state.addUserState.error = null
      })
      .addCase(addUserAsync.rejected, (state, action) => {
        state.addUserState.isLoading = false
        state.addUserState.error = action.payload ?? action.error.message ?? 'Failed to add user'
      })
  },
})

export const { setUsers, setUser } = userSlice.actions
export const userReducer = userSlice.reducer
