import type { RootState } from '../../store'

export const selectUserState = (state: RootState) => state.user

export const selectUsers = (state: RootState) => state.user.users

export const selectSelectedUser = (state: RootState) => state.user.selectedUser

export const selectSelectedUserVehicles = (state: RootState) => state.user.selectedUserVehicles

export const selectFetchUsersState = (state: RootState) => state.user.fetchUsersState

export const selectFetchSelectedUserState = (state: RootState) => state.user.fetchSelectedUserState

export const selectAddUserState = (state: RootState) => state.user.addUserState

export const selectFetchUsersLoading = (state: RootState) => state.user.fetchUsersState.isLoading

export const selectFetchUsersError = (state: RootState) => state.user.fetchUsersState.error

export const selectFetchSelectedUserLoading = (state: RootState) => state.user.fetchSelectedUserState.isLoading

export const selectFetchSelectedUserError = (state: RootState) => state.user.fetchSelectedUserState.error

export const selectAddUserLoading = (state: RootState) => state.user.addUserState.isLoading

export const selectAddUserError = (state: RootState) => state.user.addUserState.error
