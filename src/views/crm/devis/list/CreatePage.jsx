import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

// material-ui
import SendIcon from '@mui/icons-material/Send';
import {
  Autocomplete,
  Divider,
  Box,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField
} from '@mui/material';

// project imports
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { useCreateArticle } from 'services/articles.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';
import { toast } from 'react-toastify';
import { useGetSettingsRoles } from 'services/settings.service';

const UserCreatePage = () => {
  const createArticleMutation = useCreateArticle();

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const fileRef = useRef();

  const methods = useForm({
    // resolver: zodResolver(imageUploadSchema),
  });
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const GetSettingsRolesQuery = useGetSettingsRoles();
  const [formInput, setFormInput] = useState({
    nom: '',
    reference: '',
    prix_unitaire: '',
    remise: '',
    unite_id: '',
    parent: '',
    p_category_article_id: ''
  });

  const navigate = useNavigate();

  const handleFilesChange = (files) => {
    // Update chosen files
    setFormInput((f) => {
      return { ...f, file_name: files[0] };
    });
  };

  const handleChange = (e) => {
    console.log('====================================');
    console.log(e.target.value);
    console.log('====================================');
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    try {
      const formData = new FormData();
      for (let key in formInput) {
        formData.append(key, formInput[key]);
      }
      await createArticleMutation.mutateAsync(formData);
      navigate('/devis/list');
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };

  const onFileDelete = () => {
    // setSheetActualRowCount(null);
    methods.reset();
    fileRef.current.value = null;
  };
  const onSubmitHandler = (values) => {
    const formData = new FormData();
    formData.append('image', values.image);

    if (values.images.length > 0) {
      values.images.forEach((el) => formData.append('images', el));
    }

    // Call the Upload API
    // uploadImage(formData);
  };
  const [isAlertShown, setIsAlertShown] = useState(false);

  const handlePhoneChange = (event) => {
    const phoneNumber = event.target.value;
    const sanitizedPhoneNumber = phoneNumber.replace('+', ''); // Remove the "+" symbol

    // Update the form input state with the sanitized phone number
    setFormInput((prevState) => ({
      ...prevState,
      phone_number: sanitizedPhoneNumber
    }));
  };
  const showInputErrorToast = (message) => {
    toast.error(message, { autoClose: 3000 }); // Display the error toast with a timeout of 3000 milliseconds
  };
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleChange = (event, value) => {
    setSelectedRole(value);
    setFormInput((prevFormInput) => ({
      ...prevFormInput,
      role_id: value ? value.id : ''
    }));
  };
  return (
    <MainCard title="Ajouter Devis" backButton goBackLink="/devis/list">
      <div>
        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
            {/* <Grid item xs={12} md={6}>
              <TextField variant="standard" fullWidth label="Référence*" value={formInput?.reference || ''} disabled />
            </Grid> */}
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                fullWidth
                label="Identifient*"
                value={formInput?.identifient || ''}
                name="identifient"
                onChange={handleChange}
                error={!!formErrors?.data?.identifient}
                helperText={renderArrayMultiline(formErrors?.data?.identifient)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                fullWidth
                label="Nom*"
                value={formInput?.name || ''}
                name="name"
                onChange={handleChange}
                error={!!formErrors?.data?.name}
                helperText={renderArrayMultiline(formErrors?.data?.name)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                fullWidth
                label="E-mail*"
                value={formInput?.email || ''}
                name="email"
                onChange={handleChange}
                error={!!formErrors?.data?.email}
                helperText={renderArrayMultiline(formErrors?.data?.email)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                name="address"
                onChange={handleChange}
                fullWidth
                label="Adresse"
                value={formInput?.address || ''}
                error={!!formErrors?.data?.address}
                helperText={renderArrayMultiline(formErrors?.data?.address)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                name="city"
                onChange={handleChange}
                fullWidth
                label="Ville"
                value={formInput?.city || ''}
                error={!!formErrors?.data?.city}
                helperText={renderArrayMultiline(formErrors?.data?.city)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                name="postal_code"
                onChange={handleChange}
                fullWidth
                label="Code Postale"
                value={formInput?.postal_code || ''}
                error={!!formErrors?.data?.postal_code}
                helperText={renderArrayMultiline(formErrors?.data?.postal_code)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                type="number"
                inputProps={{
                  pattern: '^\\d{8,17}$', // Specify the pattern for 8 to 17 digits
                  onChange: handlePhoneChange // Custom function to handle phone number change
                }}
                variant="standard"
                name="phone_number"
                fullWidth
                label="Numéro de téléphone"
                value={formInput?.phone_number || ''}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                name="gender"
                onChange={handleChange}
                fullWidth
                label="Genre"
                value={formInput?.gender || ''}
                error={!!formErrors?.data?.gender}
                helperText={renderArrayMultiline(formErrors?.data?.gender)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl error={!!!!formErrors?.data?.password} sx={{ width: '100%' }} variant="standard">
                <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                <Input
                  name="password"
                  id="standard-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  onChange={handleChange}
                  fullWidth
                  label="Mot de passe*"
                  defaultValue=""
                  error={!!formErrors?.data?.password}
                  helperText={renderArrayMultiline(formErrors?.data?.password)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText>{renderArrayMultiline(formErrors?.data?.password)}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Autocomplete
                id="autocomplete"
                options={GetSettingsRolesQuery.data}
                getOptionLabel={(role) => role.name}
                value={selectedRole}
                onChange={handleRoleChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Selectionner Role*"
                    variant="standard"
                    fullWidth
                    value={selectedRole ? selectedRole?.id : ''}
                    onChange={(event) => setSelectedRole({ id: event.target.value })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <div
                style={{
                  marginBottom: 4
                }}
              >
                <label htmlFor="color">Choisir un indicateur</label>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}
              >
                <input id="color" onChange={handleChange} name="color" type="color" />
                <p
                  style={{
                    color: '#f44336',
                    fontSize: '0.75rem',
                    fontWeight: '400',
                    fontFamily: "'Inter',sans-serif",
                    lineHeight: '1.66',
                    textAlign: 'left',
                    marginTop: '3px',
                    marginRight: '0',
                    marginBottom: '0',
                    marginLeft: '0'
                  }}
                >
                  {formErrors?.data?.color}
                </p>
              </div>
            </Grid>

            <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
              <LoadingButton
                loadingPosition="end"
                endIcon={<SendIcon />}
                loading={createArticleMutation.isLoading}
                variant="contained"
                type="submit"
              >
                Ajouter
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
        <Divider
          style={{
            margin: 20
          }}
        />
      </div>
    </MainCard>
  );
};

UserCreatePage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default UserCreatePage;
