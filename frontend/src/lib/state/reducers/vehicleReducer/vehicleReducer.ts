import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { mapServerVehicleToVehicleModel } from '../../../mappers'
import { vehicleApi } from '../../../api/vehicleApi/vehicleApi'
import type { GetVehiclesRequestDto } from '../../../api/vehicleApi/dto/request'
import type { CreateVehicleRequestDto } from '../../../api/vehicleApi/dto/request'
import { isAppError } from '../../../api/appError'
import type { VehicleModel } from '../../../models/vehicleModel'

interface RequestState {
  isLoading: boolean
  error: string | null
}

export interface VehicleState {
  vehicles: VehicleModel[]
  selectedVehicle: VehicleModel | null
  fetchVehiclesState: RequestState
  addVehicleState: RequestState
}

const createRequestState = (): RequestState => ({
  isLoading: false,
  error: null,
})

const initialState: VehicleState = {
  vehicles: [],
  selectedVehicle: null,
  fetchVehiclesState: createRequestState(),
  addVehicleState: createRequestState(),
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

const normalizeVehiclesResponse = (response: Awaited<ReturnType<typeof vehicleApi.getVehicles>>): VehicleModel[] => {
  return response.items.map(mapServerVehicleToVehicleModel)
}

export const fetchVehiclesAsync = createAsyncThunk<
  VehicleModel[],
  GetVehiclesRequestDto | undefined,
  { rejectValue: string }
>('vehicle/fetchVehicles', async (requestDto, thunkApi) => {
  try {
    const response = await vehicleApi.getVehicles(requestDto)

    return normalizeVehiclesResponse(response)
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error, 'Failed to load vehicles'))
  }
})

export const addVehicleAsync = createAsyncThunk<
  VehicleModel,
  CreateVehicleRequestDto,
  { rejectValue: string }
>('vehicle/addVehicle', async (vehicleDto, thunkApi) => {
  try {
    const response = await vehicleApi.createVehicle(vehicleDto)

    return mapServerVehicleToVehicleModel(response)
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error, 'Failed to add vehicle'))
  }
})

const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState,
  reducers: {
    setVehicles(state, action: PayloadAction<VehicleModel[]>) {
      state.vehicles = action.payload
      state.fetchVehiclesState.error = null
    },
    setVehicle(state, action: PayloadAction<VehicleModel | null>) {
      state.selectedVehicle = action.payload
      state.addVehicleState.error = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchVehiclesAsync.pending, state => {
        state.fetchVehiclesState.isLoading = true
        state.fetchVehiclesState.error = null
      })
      .addCase(fetchVehiclesAsync.fulfilled, (state, action) => {
        state.fetchVehiclesState.isLoading = false
        state.vehicles = action.payload
        state.fetchVehiclesState.error = null
      })
      .addCase(fetchVehiclesAsync.rejected, (state, action) => {
        state.fetchVehiclesState.isLoading = false
        state.fetchVehiclesState.error = action.payload ?? action.error.message ?? 'Failed to load vehicles'
      })
      .addCase(addVehicleAsync.pending, state => {
        state.addVehicleState.isLoading = true
        state.addVehicleState.error = null
      })
      .addCase(addVehicleAsync.fulfilled, (state, action) => {
        state.addVehicleState.isLoading = false
        state.vehicles.push(action.payload)
        state.selectedVehicle = action.payload
        state.addVehicleState.error = null
      })
      .addCase(addVehicleAsync.rejected, (state, action) => {
        state.addVehicleState.isLoading = false
        state.addVehicleState.error = action.payload ?? action.error.message ?? 'Failed to add vehicle'
      })
  },
})

export const { setVehicles, setVehicle } = vehicleSlice.actions
export const vehicleReducer = vehicleSlice.reducer
