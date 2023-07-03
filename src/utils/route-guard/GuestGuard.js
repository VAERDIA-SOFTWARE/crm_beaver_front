import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

// project imports
import useAuth from 'hooks/useAuth';
import { DASHBOARD_PATH } from 'config';

// ==============================|| GUEST GUARD ||============================== //

/**
 * Guest guard for routes having no auth required
 * @param {PropTypes.node} children children element/node
 */

const GuestGuard = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();
  const doesAnyHistoryEntryExist = location.key !== 'default';

  const query = new URLSearchParams(location.search);

  useEffect(() => {
    if (isLoggedIn) {
      navigate(
        {
          // to: doesAnyHistoryEntryExist ? -1 : DASHBOARD_PATH,
          pathname: query.get('redirectTo') || DASHBOARD_PATH

          // search: `?redirectTo=${location.pathname}`
        },
        { replace: true }
      );
    }
  }, [isLoggedIn, navigate]);

  return children;
};

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default GuestGuard;
