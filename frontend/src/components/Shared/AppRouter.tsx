import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Header from '../Lauout/Header'
import UsersPage from '../../pages/UsersPage/UsersPage'
import UserPage from '../../pages/UserPage/UserPage'
import CreateUserPage from '../../pages/CreateUserPage/CreateUserPage'
import VehiclesPage from '../../pages/VehiclesPage/VehiclesPage'

function AppRouter() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />

        <main className="app-main">
          <Routes>
            <Route path="/" element={<UsersPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/create" element={<CreateUserPage />} />
            <Route path="/users/:id" element={<UserPage />} />
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default AppRouter