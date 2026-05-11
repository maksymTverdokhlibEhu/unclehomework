import { useEffect } from "react";
import { UserList } from "../../components/User";
import { useAppDispatch, useAppSelector } from "../../lib/state/hooks";
import { fetchUsersAsync } from "../../lib/state/reducers/userReducer/userReducer";
import { selectUsers, selectFetchUsersLoading, selectFetchUsersError } from "../../lib/state/reducers/userReducer/userSelectors";

function UsersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const isLoading = useAppSelector(selectFetchUsersLoading);
  const error = useAppSelector(selectFetchUsersError);

  useEffect(() => {
    dispatch(fetchUsersAsync());
  }, [dispatch]);

  return (
    <section className="route-card p-2.5">
      test deploy variant 2
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Users page</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <UserList users={users} />
      )}
    </section>
  );
}

export default UsersPage;
