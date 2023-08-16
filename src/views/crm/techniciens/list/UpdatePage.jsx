import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

// material-ui
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { Autocomplete, Divider, Grid, Skeleton, TextField, Box } from '@mui/material';

// project imports
import { LoadingButton } from '@mui/lab';
import { useConfirm } from 'material-ui-confirm';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteUserMutation, useGetUser, useToggleUserStatus, useUpdateUser } from 'services/users.service';
import { useGetOperations, useGetZonesVilles } from 'services/zone-villes.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';
import CustomFileUpload from '../../clients/list/FileUpload';

const TechnicienUpdatePage = () => {
  const { technicienId } = useParams();
  const fileRef = useRef();

  const methods = useForm({
    // resolver: zodResolver(imageUploadSchema),
  });
  const getZonesVillesQuery = useGetZonesVilles();
  const zonesVillesData = getZonesVillesQuery.data;

  const toggleClientStatusMutation = useToggleUserStatus(technicienId);
  const deleteUserMutation = useDeleteUserMutation(technicienId);
  const updateTechnicienMutation = useUpdateUser(technicienId);
  const getTechnicienQuery = useGetUser(technicienId);
  const technicienData = getTechnicienQuery.data?.user;

  const getOperationsQuery = useGetOperations();
  const operationsData = getOperationsQuery.data;

  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    default_pagination: '',
    name: '',
    email: '',
    fax: '',
    address: '',
    phone_number: '',
    password: '',
    p_zone_ville_ids: '',
    qualifications: '',
    couleur: '',
    signature: null
  });

  const navigate = useNavigate();

  const confirm = useConfirm();

  useEffect(() => {
    if (getTechnicienQuery.isSuccess) {
      setFormInput((f) => {
        return {
          ...f,
          ...technicienData,
          p_zone_ville_ids: technicienData?.zone_villes ? technicienData?.zone_villes?.map((e) => e?.id) : [],
          qualifications: technicienData?.operations && technicienData?.operations?.map((e) => e?.id)
        };
      });
    }
  }, [getTechnicienQuery.isSuccess, technicienData]);

  const handleChange = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    });
  };

  const handleFilesChange = (files) => {
    // Update chosen files
    setFormInput((f) => {
      return { ...f, signature: files[0] };
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
      await updateTechnicienMutation.mutateAsync(formData);
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
    <MainCard
      headerColor={true}
      title={`Collaborateur ${technicienData?.reference ? '- ' + technicienData?.reference : ''}`}
      backButton
      goBackLink={`/techniciens/${technicienId}/details`}
    >
      {'getTechnicienQuery.isSuccess' && (
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
                  label="Fax*"
                  value={formInput?.fax || ''}
                  error={!!formErrors?.data?.fax}
                  helperText={renderArrayMultiline(formErrors?.data?.fax)}
                />
              </Grid>
              {/* <Grid item xs={12} md={6}>
                {technicienData && Array.isArray(zonesVillesData) ? (
                  <Autocomplete
                    onChange={(event, newValue) => {
                      const arr = newValue.map((e) => e?.id);
                      setFormInput((formData) => {
                        return { ...formData, p_zone_ville_ids: arr };
                      });
                    }}
                    multiple
                    options={zonesVillesData || []}
                    getOptionLabel={(option) => {
                      return option?.nom;
                    }}
                    defaultValue={returnEqualValuesInArray(zonesVillesData, technicienData?.zone_villes)}
                    renderInput={(params) => (
                      <TextField
                        variant="standard"
                        {...params}
                        label="Zones"
                        error={!!formErrors?.data?.p_zone_ville_ids}
                        helperText={renderArrayMultiline(formErrors?.data?.p_zone_ville_ids)}
                      />
                    )}
                  />
                ) : (
                  <Skeleton variant="rounded" width={'100%'} height={40} />
                )}
              </Grid> */}

              {/* <Grid item xs={12} md={6}>
                {technicienData && Array.isArray(operationsData) ? (
                  <Autocomplete
                    onChange={(event, newValue) => {
                      const arr = newValue.map((e) => e?.id);
                      setFormInput((formData) => {
                        return { ...formData, qualifications: arr };
                      });
                    }}
                    multiple
                    options={getOperationsQuery?.data || []}
                    getOptionLabel={(option) => option?.nom}
                    defaultValue={returnEqualValuesInArray(operationsData, technicienData?.operations)}
                    renderInput={(params) => (
                      <TextField
                        variant="standard"
                        {...params}
                        label="Qualifications*"
                        error={!!formErrors?.data?.operations}
                        helperText={renderArrayMultiline(formErrors?.data?.operations)}
                      />
                    )}
                  />
                ) : (
                  <Skeleton variant="rounded" width={'100%'} height={40} />
                )}
              </Grid> */}

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
                  <input id="couleur" onChange={handleChange} value={formInput?.couleur} name="couleur" type="color" />
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
              {/* <Grid item xs={12} md={7}>
                <TextField variant="standard" fullWidth label="Nom fichier" value={formInput?.nom_fichier || ''} disabled />
              </Grid> */}
              {/* <Grid item xs={12}>
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
              </Grid> */}
              <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                <LoadingButton
                  disabled={getTechnicienQuery.isLoading}
                  loadingPosition="start"
                  startIcon={<SendIcon />}
                  loading={updateTechnicienMutation.isLoading}
                  variant="contained"
                  type="submit"
                >
                  Modifier
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
          <Divider
            style={{
              margin: 20
            }}
          />
          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'start'
            }}
          >
            <LoadingButton
              disabled={getTechnicienQuery.isLoading}
              loading={toggleClientStatusMutation.isLoading}
              variant="outlined"
              onClick={() =>
                confirm({
                  description: `Êtes-vous sûr de vouloir ${technicienData?.active_status ? 'désactiver' : 'activer'} ${
                    technicienData?.name
                  }.`,
                  title: `Veuillez confirmer ${technicienData?.active_status ? 'la désactivation' : "l'activation"}`
                })
                  .then(() => toggleClientStatusMutation.mutate())
                  .catch(() => console.log('Deactivation cancelled.'))
              }
            >
              {technicienData?.active_status ? 'Désactiver' : 'Activer'}
            </LoadingButton>

            <LoadingButton
              disabled={getTechnicienQuery.isLoading}
              loadingPosition="start"
              startIcon={<DeleteIcon />}
              loading={deleteUserMutation.isLoading}
              variant="outlined"
              color="error"
              onClick={() =>
                confirm({
                  description: `Êtes-vous sûr de vouloir supprimer ${technicienData?.name}.`,
                  title: `Veuillez confirmer la suppression`
                })
                  .then(async () => {
                    try {
                      await deleteUserMutation.mutateAsync();
                      navigate('/clients/list', {
                        replace: true
                      });
                    } catch (error) {}
                  })
                  .catch(() => console.log('Utilisateur supprimé avec succès.'))
              }
            >
              {'Supprimer'}
            </LoadingButton>
          </div>
        </div>
      )}
    </MainCard>
  );
};

TechnicienUpdatePage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default TechnicienUpdatePage;

const returnEqualValuesInArray = (a, b) => {
  const t = [];

  a.forEach((aElement) => {
    b.forEach((bElement) => {
      if (aElement?.id === bElement?.id) {
        t.push(aElement);
      }
    });
  });
  return t;
};
