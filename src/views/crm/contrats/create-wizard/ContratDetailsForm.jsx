import PropTypes from 'prop-types';

// material-ui
import { Button, Checkbox, FormControlLabel, Grid, Stack, Typography, TextField, Slider, Input, Autocomplete } from '@mui/material';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import moment from 'moment';
import renderArrayMultiline from 'utilities/utilities';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useCreateContrat } from 'services/contrats.service';
import { useGetOperations } from 'services/zone-villes.service';
import { useGetUsers } from 'services/users.service';

// const validationSchema = yup.object({
//   titre: yup.string().required('date_debut is required')
//   // date_fin: yup.string().required('date_fin is required')
// });

// ==============================|| FORM WIZARD - VALIDATION  ||============================== //

const ContratDetailsForm = ({ shippingData, setShippingData, handleNext, setErrorIndex }) => {
  // const formik = useFormik({
  //   initialValues: {
  //     firstName: shippingData.firstName,
  //     lastName: shippingData.lastName
  //   },
  //   validationSchema,
  //   onSubmit: (values) => {
  //     console.log(values);
  //     setShippingData({
  //       firstName: values.firstName,
  //       lastName: values.lastName
  //     });
  //     handleNext();
  //   }
  // });

  const location = useLocation();
  const clientId = location.state?.clientId;

  const createClientMutation = useCreateContrat({ clientId });

  const getOperationsQuery = useGetOperations();
  const operationsData = getOperationsQuery.data;

  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    titre: '',
    // description: '',
    date_debut: new Date(),
    date_fin: new Date(),
    user_id: clientId || null,
    pdf_path: null,
    percentage: 0
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    });
  };

  const getClientsQuery = useGetUsers({ role: 'client', paginated: false });

  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Détails contrat
      </Typography>
      <form
        onSubmit={async (e) => {
          // formik.handleSubmit(e);

          e.preventDefault();
          setFormErrors({});
          try {
            const f = {
              ...formInput,
              date_debut: format(formInput?.date_debut, 'yyyy-MM-dd'),
              date_fin: format(formInput?.date_fin, 'yyyy-MM-dd')
            };
            const formData = new FormData();
            for (let key in f) {
              formData.append(key, f[key]);
            }

            await createClientMutation.mutateAsync(formData);

            //     setShippingData({
            //       firstName: values.firstName,
            //       lastName: values.lastName
            //     });
            //     handleNext();

            navigate('/contrats/list');
          } catch (error) {
            const errorsObject = error?.response?.data;
            setFormErrors(errorsObject);
          }
        }}
        id="validation-forms"
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                variant="standard"
                fullWidth
                label="Titre*"
                value={formInput?.titre || ''}
                name="titre"
                onChange={handleChange}
                error={!!formErrors?.data?.titre}
                helperText={renderArrayMultiline(formErrors?.data?.titre)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                variant="standard"
                fullWidth
                label="Description"
                value={formInput?.description || ''}
                name="description"
                onChange={handleChange}
                error={!!formErrors?.data?.description}
                helperText={renderArrayMultiline(formErrors?.data?.description)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DesktopDatePicker
                label="Date de début"
                inputFormat="dd/MM/yyyy"
                value={moment(formInput?.date_debut, 'DD-MM-YYYY').toDate()}
                // value={getDateInFormat(formInput?.date_debut, 'dd/MM/yyyy')}
                onChange={(v) => {
                  try {
                    setFormInput((f) => {
                      return { ...f, date_debut: v };
                    });
                  } catch (error) {}
                }}
                renderInput={(params) => (
                  <TextField
                    required
                    variant="standard"
                    {...params}
                    error={!!formErrors?.data?.date_debut}
                    helperText={renderArrayMultiline(formErrors?.data?.date_debut)}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DesktopDatePicker
                label="Date de fin"
                inputFormat="dd/MM/yyyy"
                value={moment(formInput?.date_fin, 'DD-MM-YYYY').toDate()}
                onChange={(v) =>
                  setFormInput((f) => {
                    return { ...f, date_fin: v };
                  })
                }
                renderInput={(params) => (
                  <TextField
                    required
                    variant="standard"
                    {...params}
                    error={!!formErrors?.data?.date_fin}
                    helperText={renderArrayMultiline(formErrors?.data?.date_fin)}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                onChange={(event, newValue) => {
                  const ids = newValue?.map((e) => e?.id);
                  setFormInput((formData) => {
                    return { ...formData, operations: ids };
                  });
                }}
                multiple={true}
                options={operationsData || []}
                getOptionLabel={(option) => option?.nom}
                renderInput={(params) => (
                  <TextField
                    // required
                    variant="standard"
                    {...params}
                    autoComplete="off"
                    label="Operations*"
                    error={!!formErrors?.data?.operations}
                    helperText={renderArrayMultiline(formErrors?.data?.operations)}
                  />
                )}
              />
            </Grid>
            {!clientId && (
              <Grid item xs={12} md={6}>
                <Autocomplete
                  onChange={(event, newValue) => {
                    // const arr = newValue.map((e) => e?.id);
                    setFormInput((formData) => {
                      return { ...formData, user_id: newValue?.id };
                    });
                  }}
                  multiple={false}
                  options={getClientsQuery?.data || []}
                  getOptionLabel={(option) => option?.name}
                  // defaultValue={[top100Films[0], top100Films[4]]}
                  renderInput={(params) => (
                    <TextField
                      required
                      variant="standard"
                      {...params}
                      label="Client*"
                      error={!!formErrors?.data?.user_id}
                      helperText={renderArrayMultiline(formErrors?.data?.user_id)}
                    />
                  )}
                />
              </Grid>
            )}{' '}
            <Grid item xs={12}>
              <Typography gutterBottom>Pourcentage d'échantillonnage</Typography>
              <div
                style={{
                  display: 'flex',
                  gap: 16,
                  alignItems: 'center'
                }}
              >
                <Slider valueLabelDisplay="auto" defaultValue={formInput?.percentage} name="percentage" onChange={handleChange} />
                <Input
                  readOnly
                  value={formInput?.percentage}
                  size="small"
                  inputProps={{
                    min: 0,
                    max: 100,
                    type: 'number'
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="flex-end">
                <AnimateButton>
                  <Button variant="contained" sx={{ my: 3, ml: 1 }} type="submit" onClick={() => setErrorIndex(0)}>
                    Next
                  </Button>
                </AnimateButton>
              </Stack>
            </Grid>
          </Grid>{' '}
        </LocalizationProvider>
      </form>
    </>
  );
};

ContratDetailsForm.propTypes = {
  shippingData: PropTypes.object,
  setShippingData: PropTypes.func,
  handleNext: PropTypes.func,
  setErrorIndex: PropTypes.func
};

export default ContratDetailsForm;
