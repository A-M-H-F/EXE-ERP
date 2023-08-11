import React from 'react';
import { hasPermission } from '../utils/roles/permissionUtils';
import { useSelector } from 'react-redux';
import { useLoader } from '@hooks/useLoader';
import { LoginPage } from '@pages/auth/login';
import { NoPermissionPage } from '@pages/error/noPermission';

interface CustomRouteProps {
  element: React.ReactNode;
  requiresPermission: boolean;
  requiredPermission?: string | any;
  targetPage?: string | any;
}

const AuthRoute: React.FC<CustomRouteProps> = ({
  element,
  requiresPermission,
  requiredPermission,
  targetPage
}) => {
  const LoginWithLoader = useLoader(LoginPage)
  const NoPermissionPageWithLoader = useLoader(NoPermissionPage)

  const auth = useSelector((state: any) => state.auth)
  const { role, isLogged } = auth
  const extreme: boolean | any = localStorage.getItem('extreme')

  const checkPermissions = (targetPage: string, requiredPermission: string) => {
    // Implement your hasPermission function here
    // Assuming it returns true or false based on user's role and requiredPermission
    return hasPermission(role, targetPage, requiredPermission)
  }

  const shouldRenderElement = () => {
    if (!extreme || !isLogged) {
      // If the user is not logged in or extreme is false,
      // render the NotFoundWithLoader component.
      return <LoginWithLoader />
    }

    if (requiresPermission && !checkPermissions(targetPage, requiredPermission || '')) {
      // If the route requires a permission check but the user doesn't have the required permission,
      // render the NotFoundWithLoader component.
      return <NoPermissionPageWithLoader />
    }

    return element
  }

  // Return the `element` or `NotFoundWithLoader` based on the conditions
  return <React.Fragment>{shouldRenderElement()}</React.Fragment>
};

export default AuthRoute