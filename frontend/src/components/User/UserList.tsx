import { Link } from 'react-router-dom';
import type { UserModel } from '../../lib/models/userModel';

type UserListProps = {
  users: UserModel[];
};

function UserList({ users }: UserListProps) {
  return (
    <div className="mt-6">
      {users.length === 0 ? (
        <p className="text-gray-500">No users found</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Link
              key={user.id}
              to={`/users/${user.id}`}
              className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
              <p className="mt-2 truncate text-sm text-gray-600">{user.email}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserList;