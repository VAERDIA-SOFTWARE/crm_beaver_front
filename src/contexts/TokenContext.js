import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';

// third-party
import { Chance } from 'chance';
import jwtDecode from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

// project imports
import Loader from 'ui-component/Loader';
// import axios from 'utils/axios';
import axiosClient from 'axiosClient';
import { useNavigate } from 'react-router-dom';
import { useGetLoggedInUser } from 'services/auth.service';

const chance = new Chance();

// constant
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const verifyToken = async (authToken) => {
  if (!authToken) {
    return false;
  }

  const response = await axiosClient.get(`${process.env.REACT_APP_BASE_URL}web/loggedInUser`);

  const decoded = jwtDecode(authToken);
  /**
   * Property 'exp' does not exist on type '<T = unknown>(token, options?: JwtDecodeOptions | undefined) => T'.
   */
  return decoded.exp > Date.now() / 1000;
};

const setSession = (authToken) => {
  if (authToken) {
    localStorage.setItem('authToken', authToken);
    axiosClient.defaults.headers.common.Authorization = `Bearer ${authToken}`;
  } else {
    localStorage.removeItem('authToken');
    delete axiosClient.defaults.headers.common.Authorization;
  }
};

const TokenContext = createContext(null);
TokenContext.displayName = 'Auth';

export const TokenProvider = ({ children }) => {
  const [state, dispatch] = useReducer(accountReducer, initialState);

  const navigate = useNavigate();

  // const loggedInUserQuery = useGetLoggedInUser();

  useEffect(() => {
    const init = async () => {
      try {
        const authToken = window.localStorage.getItem('authToken');
        if (authToken && '(await verifyToken(authToken))') {
          setSession(authToken);

          const response = await axiosClient.get(`${process.env.REACT_APP_BASE_URL}web/loggedInUser`);
          const { user } = response.data;
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user
            }
          });
        } else {
          dispatch({
            type: LOGOUT
          });
          // navigate('/login');
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: LOGOUT
        });
        // navigate('/login');
      }
    };

    init();
  }, []);

  useEffect(() => {
    async function getUser() {
      const response = await axiosClient.get(`${process.env.REACT_APP_BASE_URL}web/loggedInUser`);
      const user = response.data;
      dispatch({
        type: LOGIN,
        payload: {
          isLoggedIn: true,
          user
        }
      });
    }

    try {
      getUser();
    } catch (error) {}

    return () => {};
  }, []);

  const login = async ({ email, password }) => {
    await axiosClient.get(`${process.env.REACT_APP_BASE_URL}web/xsrf-token`);
    const response = await axiosClient.post(`${process.env.REACT_APP_BASE_URL}web/login`, { email, password });
    const { token, user } = response.data;

    setSession(token);

    dispatch({
      type: LOGIN,
      payload: {
        isLoggedIn: true,
        user
      }
    });
  };

  const register = async (email, password, firstName, lastName) => {
    // todo: this flow need to be recode as it not verified
    const id = chance.bb_pin();
    const response = await axiosClient.post('/api/account/register', {
      id,
      email,
      password,
      firstName,
      lastName
    });

    let users = response.data;

    if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
      const localUsers = window.localStorage.getItem('users');
      users = [
        ...JSON.parse(localUsers),
        {
          id,
          email,
          password,
          name: `${firstName} ${lastName}`
        }
      ];
    }

    window.localStorage.setItem('users', JSON.stringify(users));
  };

  const logout = async () => {
    await axiosClient.get(`${process.env.REACT_APP_BASE_URL}web/logout`);

    setSession(null);
    dispatch({ type: LOGOUT });
  };

  const resetPassword = (email) => console.log(email);

  const updateProfile = () => {};

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return (
    <TokenContext.Provider value={{ ...state, login, logout, register, resetPassword, updateProfile }}>{children}</TokenContext.Provider>
  );
};

TokenProvider.propTypes = {
  children: PropTypes.node
};

export default TokenContext;
