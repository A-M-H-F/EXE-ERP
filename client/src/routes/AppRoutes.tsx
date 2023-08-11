import { Stack } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom'

// auth route
import AuthRoute from './AuthRoute';

// hooks
import { useLoader } from '@hooks/useLoader';

// pages
import { NotFound } from '@pages/error/notFound';
import { LoginPage } from '@pages/auth/login';
import { Dashboard } from '@pages/dashboard';
import { ProfilePage } from '@pages/profile';
import { RolesPage } from '@pages/roles';
import { AddNewRolePage } from '@pages/roles/addNewRole';
import { ScrumBoard } from '@pages/scrumBoard';

const AppRoutes = () => {
  const auth = useSelector((state: any) => state.auth)
  const { isLogged } = auth
  const extreme: boolean | any = localStorage.getItem('extreme')

  {/* With Loader */ }
  const NotFoundWithLoader = useLoader(NotFound)
  const LoginWithLoader = useLoader(LoginPage)
  const DashboardWithLoader = useLoader(Dashboard)
  const ProfilePageWithLoader = useLoader(ProfilePage)

  const RolesPageWithLoader = useLoader(RolesPage)
  const AddNewRolePageWithLoader = useLoader(AddNewRolePage)

  return (
    <Stack>
      <Routes key={location.pathname} location={location}>
        <Route path='*' element={!extreme || !isLogged ? <LoginWithLoader /> : <NotFoundWithLoader />} />

        <Route path='/not-found' element={<NotFoundWithLoader />} />

        {/* Dashboard Page */}
        <Route
          path="/"
          element={<AuthRoute
            element={<DashboardWithLoader />}
            targetPage="Dashboard"
            requiredPermission="Read"
            requiresPermission={true}
          />}
        />

        {/* Profile page */}
        <Route
          path="/profile"
          element={<AuthRoute
            element={<ProfilePageWithLoader />}
            requiresPermission={false}
          />}
        />

        {/* Roles Page */}
        <Route
          path="/roles"
          element={<AuthRoute
            element={<RolesPageWithLoader />}
            targetPage="Roles"
            requiredPermission="Read"
            requiresPermission={true}
          />}
        />

        {/* Add New Role Page */}
        <Route
          path="/roles/addNew"
          element={<AuthRoute
            element={<AddNewRolePageWithLoader />}
            targetPage="Roles"
            requiredPermission="Create"
            requiresPermission={true}
          />}
        />

        {/* Scrum Board Page */}
        <Route
          path="/boards"
          element={<AuthRoute
            element={<ScrumBoard />}
            targetPage="ScrumBoard"
            requiredPermission="Read"
            requiresPermission={false}
          />}
        />

        {/* BoardId Page */}
        <Route
          path="/boards/:boardId"
          element={<AuthRoute
            element={<ScrumBoard />}
            targetPage="ScrumBoard"
            requiredPermission="Read"
            requiresPermission={false}
          />}
        />

      </Routes>
    </Stack>
  )
}

export default AppRoutes