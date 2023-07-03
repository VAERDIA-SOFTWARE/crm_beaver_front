import React from 'react';
import { Link } from 'react-router-dom';

// material-ui
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LoginIcon from '@mui/icons-material/Login';

// third party
import { Formik } from 'formik';

// project imports
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { LoadingButton } from '@mui/lab';
import { useQueryClient } from '@tanstack/react-query';

const FirebaseLogin = ({ loginProp, ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const [checked, setChecked] = React.useState(true);

  const { login } = useAuth();

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null
        }}
        // validationSchema={Yup.object().shape({
        //   email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        //   password: Yup.string().max(255).required('Password is required')
        // })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            // await firebaseEmailPasswordSignIn(values.email, values.password).then(
            await login({ email: values.email, password: values.password }).then(
              () => {
                // WARNING: do not set any formik state here as formik might be already destroyed here. You may get following error by doing so.
                // Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application.
                // To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
                // github issue: https://github.com/formium/formik/issues/2430
              },
              (err) => {
                if (scriptedRef.current) {
                  setStatus({ success: false });
                  setErrors({ submit: err?.response?.data?.message });
                  // setErrors({ submit: err.message });
                  setSubmitting(false);
                }
              }
            );
          } catch (err) {
            console.error(err.message);
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err?.response?.data?.message });
              // setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-login">Addresse email</InputLabel>
              <OutlinedInput
                type="email"
                defaultValue={values.email}
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Addresse email"
                inputProps={{}}
              />
              {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-login">Mot de passe</InputLabel>
              <OutlinedInput
                type={showPassword ? 'text' : 'password'}
                defaultValue={values.password}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
            </FormControl>
            {false && (
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                <FormControlLabel
                  control={
                    <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
                  }
                  label="Remember me"
                />
                <Typography
                  variant="subtitle1"
                  component={Link}
                  to={loginProp ? `/pages/forgot-password/forgot-password${loginProp}` : '/pages/forgot-password/forgot-password3'}
                  color="secondary"
                  sx={{ textDecoration: 'none' }}
                >
                  Forgot Password?
                </Typography>
              </Stack>
            )}
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <LoadingButton
                loadingPosition="start"
                startIcon={<LoginIcon />}
                loading={isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="secondary"
              >
                Se connecter
              </LoadingButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseLogin;
