import type { VehicleModel } from '../../lib/models/vehicleModel'

type VehicleListProps = {
  vehicles: VehicleModel[]
}

function VehicleList({ vehicles }: VehicleListProps) {
  return (
    <div className="mt-6">
      {vehicles.length === 0 ? (
        <p className="text-gray-500">No vehicles found</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => (
            <div key={v.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900">{v.model} — {v.make}</h3>
              <p className="mt-2 text-sm text-gray-600">Owner ID: {v.userId}</p>
              <p className="mt-1 text-sm text-gray-600">Year: {v.year ?? '—'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VehicleList
