import { useEffect } from 'react'
import { VehicleList } from '../../components/Vehicle'
import { useAppDispatch, useAppSelector } from '../../lib/state/hooks'
import { fetchVehiclesAsync } from '../../lib/state/reducers/vehicleReducer/vehicleReducer'
import { selectVehicles, selectFetchVehiclesLoading, selectFetchVehiclesError } from '../../lib/state/reducers/vehicleReducer/vehicleSelectors'

function VehiclesPage() {
  const dispatch = useAppDispatch()
  const vehicles = useAppSelector(selectVehicles)
  const isLoading = useAppSelector(selectFetchVehiclesLoading)
  const error = useAppSelector(selectFetchVehiclesError)

  useEffect(() => {
    void dispatch(fetchVehiclesAsync())
  }, [dispatch])

  return (
    <section className="route-card p-2.5">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Vehicles page</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <VehicleList vehicles={vehicles} />
      )}
    </section>
  )
}

export default VehiclesPage
