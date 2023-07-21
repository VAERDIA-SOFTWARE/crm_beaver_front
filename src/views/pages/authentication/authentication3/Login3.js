import { Link, useSearchParams } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthLogin from '../auth-forms/AuthLogin';
import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';
import useAuth from 'hooks/useAuth';
import axiosClient from 'axiosClient';
import { useEffect, useState } from 'react';
import { useGetLoggedInUser } from 'services/auth.service';

// assets

// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
  const loggedInUserQuery = useGetLoggedInUser();
  // const [loggedInUser, setLoggedInUser] = useState(null);
  // useEffect(() => {
  //   async function getLoggedInUser(params) {
  //     const response = await axiosClient.get(`${process.env.REACT_APP_BASE_URL}web/loggedInUser`);
  //     setLoggedInUser(response.data);
  //   }
  //   getLoggedInUser();
  //   return () => {};
  // }, []);

  const theme = useTheme();
  const { isLoggedIn } = useAuth();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  let [searchParams, setSearchParams] = useSearchParams();

  if (loggedInUserQuery.isLoading) {
    return null;
  }

  return (
    <AuthWrapper1>
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item sx={{ mb: 3 }}>
                    <Link to="#">
                      <Logo />
                    </Link>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container direction={matchDownSM ? 'column-reverse' : 'row'} alignItems="center" justifyContent="center">
                      <Grid item>
                        <Stack alignItems="center" justifyContent="center" spacing={1}>
                          {/* <Typography color={theme.palette.secondary.main} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                            Hi, Welcome Back
                          </Typography> */}
                          <Typography variant="caption" fontSize="16px" textAlign={matchDownSM ? 'center' : 'inherit'}>
                            Entrez vos identifiants pour continuer
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <AuthLogin />
                  </Grid>
                  {/* <Grid item xs={12}>
                    <Divider />
                  </Grid> */}
                  {/* <Grid item xs={12}>
                    <Grid item container direction="column" alignItems="center" xs={12}>
                      <Typography
                        component={Link}
                        to={isLoggedIn ? '/pages/register/register3' : '/register'}
                        variant="subtitle1"
                        sx={{ textDecoration: 'none' }}
                      >
                        Don&apos;t have an account?
                      </Typography>
                    </Grid>
                  </Grid> */}
                </Grid>
              </AuthCardWrapper>
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: 10
                }}
              >
                Version 1.0.1
              </div>
              <div
                style={{
                  textAlign: 'center'
                }}
              >
                © 2023
                <a
                  style={{
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                  href={'http://vaerdia.com/'}
                  target="_blank"
                  rel="noreferrer"
                >
                  {' '}
                  Vaerdia{' '}
                </a>
                Tous les droits sont réservés.
              </div>
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid> */}
      </Grid>
    </AuthWrapper1>
  );
};

export default Login;
