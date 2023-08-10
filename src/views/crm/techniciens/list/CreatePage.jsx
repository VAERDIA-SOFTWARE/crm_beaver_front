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
import { useCreateUser } from 'services/users.service';
import { useGetOperations, useGetZonesVilles } from 'services/zone-villes.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';
import CustomFileUpload from '../../clients/list/FileUpload';

const TechnicienCreatePage = () => {
  const getZonesVillesQuery = useGetZonesVilles();
  const zonesVillesData = getZonesVillesQuery.data;

  const getOperationsQuery = useGetOperations();

  const createUserMutation = useCreateUser();

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

  const [formInput, setFormInput] = useState({
    default_pagination: '',
    email: '',
    fax: '',
    address: '',
    phone_number: '',
    password: '',
    p_zone_ville_ids: '',
    qualifications: '',
    couleur: '',
    role: 'collaborator',
    signature: '',
    auth: 1
  });

  const navigate = useNavigate();

  const handleFilesChange = (files) => {
    // Update chosen files
    setFormInput((f) => {
      return { ...f, signature: files[0] };
    });
  };

  const handleChange = (e) => {
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
      await createUserMutation.mutateAsync(formData);
      navigate('/techniciens/list');
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
  return (
    <MainCard headerColor={true} title="Ajouter Collaborateur" backButton goBackLink="/techniciens/list">
      <div>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
            <Grid item xs={12} md={6}>
              <TextField variant="standard" fullWidth label="Référence*" value={formInput?.reference || ''} disabled />
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
                label="Adresse*"
                value={formInput?.address || ''}
                error={!!formErrors?.data?.address}
                helperText={renderArrayMultiline(formErrors?.data?.address)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                name="phone_number"
                onChange={handleChange}
                fullWidth
                label="Numéro de téléphone*"
                value={formInput?.phone_number || ''}
                error={!!formErrors?.data?.phone_number}
                helperText={renderArrayMultiline(formErrors?.data?.phone_number)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                name="fax"
                onChange={handleChange}
                fullWidth
                label="Fax"
                value={formInput?.fax || ''}
                error={!!formErrors?.data?.fax}
                helperText={renderArrayMultiline(formErrors?.data?.fax)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                onChange={(event, newValue) => {
                  const arr = newValue.map((e) => e?.id);
                  setFormInput((formData) => {
                    return { ...formData, p_zone_ville_ids: arr };
                  });
                }}
                multiple
                options={zonesVillesData || []}
                getOptionLabel={(option) => option?.nom}
                renderInput={(params) => (
                  <TextField
                    variant="standard"
                    {...params}
                    autoComplete="off"
                    label="Zone*"
                    error={!!formErrors?.data?.p_zone_ville_ids}
                    helperText={renderArrayMultiline(formErrors?.data?.p_zone_ville_ids)}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                onChange={(event, newValue) => {
                  const arr = newValue.map((e) => e?.id);
                  setFormInput((formData) => {
                    return { ...formData, qualifications: arr };
                  });
                }}
                multiple={true}
                options={getOperationsQuery?.data || []}
                getOptionLabel={(option) => option?.nom}
                renderInput={(params) => (
                  <TextField
                    variant="standard"
                    {...params}
                    autoComplete="off"
                    label="Qualifications*"
                    // value={formInput?.qualifications}
                    error={!!formErrors?.data?.qualifications}
                    helperText={renderArrayMultiline(formErrors?.data?.qualifications)}
                  />
                )}
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
            <Grid item xs={12} md={6}>
              <div
                style={{
                  marginBottom: 4
                }}
              >
                <label htmlFor="couleur">Choisir un indicateur</label>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}
              >
                <input id="couleur" onChange={handleChange} name="couleur" type="color" />
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
                  {formErrors?.data?.couleur}
                </p>
              </div>
            </Grid>
            <Grid item xs={12}>
              <FormProvider {...methods}>
                <Box component="form" noValidate autoComplete="off" onSubmit={methods.handleSubmit(onSubmitHandler)}>
                  <CustomFileUpload
                    fileTypes={['png']}
                    ref={fileRef}
                    limit={1}
                    multiple={false}
                    name="image"
                    handleFilesChange={handleFilesChange}
                    onFileDelete={onFileDelete}
                  />

                  {formErrors?.data?.signature && (
                    <div
                      style={{
                        color: '#f44336',
                        fontSize: '0.75rem',
                        fontWeight: '400',
                        fontFamily: "'Inter',sans-serif",
                        lineHeight: '1.66',
                        textAlign: 'left',
                        marginTop: '22px',
                        marginRight: '14px',
                        marginBottom: '0',
                        marginLeft: '14px'
                      }}
                    >
                      {renderArrayMultiline(formErrors?.data?.signature)}
                    </div>
                  )}
                </Box>
              </FormProvider>
            </Grid>
            <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
              <LoadingButton
                loadingPosition="end"
                endIcon={<SendIcon />}
                loading={createUserMutation.isLoading}
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

TechnicienCreatePage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default TechnicienCreatePage;
