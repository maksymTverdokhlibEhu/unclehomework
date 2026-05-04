import type { RootState } from '../../store'

export const selectVehicleState = (state: RootState) => state.vehicle

export const selectVehicles = (state: RootState) => state.vehicle.vehicles

export const selectSelectedVehicle = (state: RootState) => state.vehicle.selectedVehicle

export const selectFetchVehiclesState = (state: RootState) =>
  state.vehicle.fetchVehiclesState

export const selectAddVehicleState = (state: RootState) => state.vehicle.addVehicleState

export const selectFetchVehiclesLoading = (state: RootState) =>
  state.vehicle.fetchVehiclesState.isLoading

export const selectFetchVehiclesError = (state: RootState) =>
  state.vehicle.fetchVehiclesState.error

export const selectAddVehicleLoading = (state: RootState) =>
  state.vehicle.addVehicleState.isLoading

export const selectAddVehicleError = (state: RootState) =>
  state.vehicle.addVehicleState.error
