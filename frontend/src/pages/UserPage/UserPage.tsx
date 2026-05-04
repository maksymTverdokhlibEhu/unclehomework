import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../lib/state/hooks'
import {
  fetchUserByIdAsync,
} from '../../lib/state/reducers/userReducer/userReducer'
import {
  selectFetchSelectedUserError,
  selectFetchSelectedUserLoading,
  selectSelectedUser,
  selectSelectedUserVehicles,
} from '../../lib/state/reducers/userReducer/userSelectors'

function formatDate(value?: string) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

function UserPage() {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const selectedUser = useAppSelector(selectSelectedUser)
  const vehicles = useAppSelector(selectSelectedUserVehicles)
  const isLoading = useAppSelector(selectFetchSelectedUserLoading)
  const error = useAppSelector(selectFetchSelectedUserError)

  useEffect(() => {
    if (!id) {
      return
    }

    void dispatch(fetchUserByIdAsync(id))
  }, [dispatch, id])

  return (
    <section className="route-card p-[10px]">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">User details</h1>

      {!id ? (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
          Missing user id
        </div>
      ) : isLoading ? (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-800">
          Loading...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          Error: {error}
        </div>
      ) : selectedUser ? (
        <div className="space-y-6 mt-5">
          {/* User Info Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Profile Information</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-600">Name</p>
                <p className="mt-1 text-lg text-gray-900">{selectedUser.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="mt-1 break-all text-lg text-gray-900">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">User ID</p>
                <p className="mt-1 font-mono text-sm text-gray-900">{selectedUser.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Created</p>
                <p className="mt-1 text-sm text-gray-900">{formatDate(selectedUser.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Last Updated</p>
                <p className="mt-1 text-sm text-gray-900">{formatDate(selectedUser.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Vehicles Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Vehicles ({vehicles.length})</h2>
            {vehicles.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-gray-600">
                No vehicles found
              </div>
            ) : (
              <div className="grid gap-3">
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex items-start justify-between rounded-lg border border-gray-100 bg-gray-50 p-4 hover:bg-gray-100"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Year: {vehicle.year ?? '—'}
                      </p>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="font-mono text-xs text-gray-500">{vehicle.id}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-600">
          No user found
        </div>
      )}
    </section>
  )
}

export default UserPage
