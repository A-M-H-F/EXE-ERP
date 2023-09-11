import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom'

// auth route
import AuthRoute from './AuthRoute';

// hooks
import { useLoader } from '@hooks/useLoader';
import { AuthState } from '@features/reducers/auth';
import { NotFound } from '@pages/error/notFound';
import { LoginPage } from '@pages/auth/login';
import { DashboardPage } from '@pages/dashboard';
import { ProfilePage } from '@pages/profile';
import { RolesPage } from '@pages/roles';
import { AddNewRolePage } from '@pages/roles/addNewRole';
import { RoleInfoPage } from '@pages/roles/roleInfo';
import { ScrumBoard } from '@pages/scrumBoard';
import { UsersPage } from '@pages/users';
import { ISPPage } from '@pages/isp';
import { InternetServicesPage } from '@pages/internetServices';
import { LocationsPage } from '@pages/locations';
import { LocationInfoPage } from '@pages/locations/locationInfo';
import { AddNewLocationPage } from '@pages/locations/addNew';
import { CustomerInfoPage } from '@pages/customers/customerInfo';
import { CustomersPage } from '@pages/customers';
import { CustomersSubscriptionsPage } from '@pages/subscriptions';
import { CustomerSubscriptionHistoryPage } from '@pages/subscriptions/history';
import SubscriptionInvoicesPage from '@pages/subscriptionInvoices/page';
import { CustomerSubscriptionInvoicesPage } from '@pages/subscriptionInvoices/customer';
import { InvoiceInfoPage } from '@pages/subscriptionInvoices/invoiceInfo';
import { UserInfoPage } from '@pages/users/userInfo';

const AppRoutes = () => {
  const auth = useSelector((state: AuthState) => state.auth)
  const { isLogged } = auth

  const extreme: boolean | any = localStorage.getItem('extreme')

  {/* With Loader */ }
  const NotFoundWithLoader = useLoader(NotFound)
  const LoginWithLoader = useLoader(LoginPage)

  return (
    <>
      <Routes key={location.pathname} location={location}>
        <Route path='*' element={!extreme || !isLogged ? <LoginWithLoader /> : <NotFoundWithLoader />} />

        <Route path='/not-found' element={<NotFoundWithLoader />} />

        {/* Dashboard Page */}
        <Route
          path="/"
          element={<AuthRoute
            element={<DashboardPage />}
            targetPage="Dashboard"
            requiredPermission="Read"
            requiresPermission={true}
          />}
        />

        {/* Profile page */}
        <Route
          path="/profile"
          element={<AuthRoute
            element={<ProfilePage />}
            requiresPermission={false}
          />}
        />

        {/* Scrum Board Page */}
        <Route
          path="/boards"
          element={<AuthRoute
            element={<ScrumBoard />}
            targetPage="Scrum Board"
            requiredPermission="Read"
            requiresPermission={true}
          />}
        />
        {/* BoardId Page */}
        <Route
          path="/boards/:boardId"
          element={<AuthRoute
            element={<ScrumBoard />}
            targetPage="Scrum Board"
            requiredPermission="Read"
            requiresPermission={false}
          />}
        />

        {/* Roles Page */}
        <Route
          path="/roles"
          element={<AuthRoute
            element={<RolesPage />}
            targetPage="Roles"
            requiredPermission="Read"
            requiresPermission={true}
          />}
        />
        {/* Add New Role Page */}
        <Route
          path="/roles/addNew"
          element={<AuthRoute
            element={<AddNewRolePage />}
            targetPage="Roles"
            requiredPermission="Create"
            requiresPermission={true}
          />}
        />
        {/* Role Info */}
        <Route
          path="/roles/:roleId"
          element={<AuthRoute
            element={<RoleInfoPage />}
            targetPage="Roles"
            requiredPermission="Read"
            requiresPermission={true}
          />}
        />

        {/* Users */}
        <Route
          path="/users"
          element={<AuthRoute
            element={<UsersPage />}
            targetPage="Users"
            requiredPermission="Read"
            requiresPermission={true}
          />}
        />
        <Route
          path="/users/:userId"
          element={<AuthRoute
            element={<UserInfoPage />}
            targetPage="Users"
            requiredPermission="Read"
            requiresPermission={true}
          />}
        />

        {/* ISP */}
        <Route
          path="/isp"
          element={<AuthRoute
            element={<ISPPage />}
            targetPage="Internet Service Providers"
            requiredPermission="Read"
            requiresPermission={true}
          />}
        />

        {/* Internet Services */}
        <Route
          path="/services/internet"
          element={<AuthRoute
            element={<InternetServicesPage />}
            targetPage="Internet Services"
            requiredPermission="Read"
            requiresPermission={true}
          />}
        />

        {/* Locations */}
        <Route
          path="/locations"
          element={<AuthRoute
            element={<LocationsPage />}
            targetPage="Locations"
            requiredPermission="Read"
            requiresPermission={true}
          />}
        />
        <Route
          path="/locations/info/:locationId"
          element={<AuthRoute
            element={<LocationInfoPage />}
            targetPage="Locations"
            requiredPermission="Update"
            requiresPermission={true}
          />}
        />
        <Route
          path="/locations/addNew"
          element={<AuthRoute
            element={<AddNewLocationPage />}
            targetPage="Locations"
            requiredPermission="Create"
            requiresPermission={true}
          />}
        />

        {/* Customers */}
        <Route
          path="/customers"
          element={<AuthRoute
            element={<CustomersPage />}
            targetPage="Customers"
            requiredPermission="Read"
            requiresPermission={true}
          />}
        />
        <Route
          path="/customers/info/:customerId"
          element={<AuthRoute
            element={<CustomerInfoPage />}
            targetPage="Customers"
            requiredPermission="Read"
            requiresPermission={true}
          />}
        />

        {/* Subscriptions */}
        <Route
          path="/subscriptions"
          element={<AuthRoute
            element={<CustomersSubscriptionsPage />}
            targetPage="Customers Subscriptions"
            requiredPermission="Read"
            requiresPermission={true}
          />}
        />
        <Route
          path="/subscriptions/history/:customerId"
          element={<AuthRoute
            element={<CustomerSubscriptionHistoryPage />}
            targetPage="Customers Subscriptions"
            requiredPermission="Read"
            requiresPermission={true}
          />}
        />

        {/* Customers Subscription Invoices */}
        <Route
          path="/invoices/subscription"
          element={<AuthRoute
            element={<SubscriptionInvoicesPage />}
            targetPage="Subscription Invoices"
            requiredPermission="Read"
            requiresPermission={true}
          />}
        />
        <Route
          path="/invoices/subscription/:customerId"
          element={<AuthRoute
            element={<CustomerSubscriptionInvoicesPage />}
            targetPage="Subscription Invoices"
            requiredPermission="Read"
            requiresPermission={true}
          />}
        />
        <Route
          path="/invoices/subscription/info/:invoiceId"
          element={<AuthRoute
            element={<InvoiceInfoPage />}
            targetPage="Subscription Invoices"
            requiredPermission="Read"
            requiresPermission={true}
          />}
        />

      </Routes>
    </>
  )
}

export default AppRoutes