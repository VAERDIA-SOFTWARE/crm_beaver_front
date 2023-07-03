import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import Loadable from 'ui-component/Loadable';

const PagesLanding = Loadable(lazy(() => import('views/pages/landing')));
const AppClientsList = Loadable(lazy(() => import('views/crm/clients/list/index')));

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  let routeItems = [];

  if (process.env.NODE_ENV !== 'development') {
    routeItems = [
      MainRoutes,
      // {
      //   path: '/',
      //   //  element: <PagesLanding />
      //   element: <AppClientsList />
      // },
      // AuthenticationRoutes,
      LoginRoutes
    ];
  } else {
    routeItems = [
      MainRoutes,
      // {
      //   path: '/',
      //   //  element: <PagesLanding />
      //   element: <AppClientsList />
      // },
      AuthenticationRoutes,
      LoginRoutes
    ];
  }

  return useRoutes(routeItems);
}
