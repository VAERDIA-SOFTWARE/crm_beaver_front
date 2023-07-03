import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// project imports
import useAuth from 'hooks/useAuth';

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
const AuthGuard = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();
  const doesAnyHistoryEntryExist = location.key !== 'default';

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(
        {
          // to: doesAnyHistoryEntryExist ? -1 : DASHBOARD_PATH,
          pathname: 'login',

          search: `?redirectTo=${location.pathname}`
        },
        { replace: true }
      );
    }
  }, [isLoggedIn, navigate]);

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node
};

export default AuthGuard;
