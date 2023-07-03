import { DateTimePicker, LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import SaveIcon from '@mui/icons-material/Save';

// material-ui
import {
  Autocomplete,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  Skeleton,
  Stack,
  TextField
} from '@mui/material';

// third-party
import { Form, FormikProvider, useFormik } from 'formik';
import _ from 'lodash';
import * as Yup from 'yup';

// project imports
import { gridSpacing } from 'store/constant';

// assets
import DateRangeIcon from '@mui/icons-material/DateRange';
import { useState } from 'react';
import { useGetInspectionsTechniciens } from 'services/inspections.service';
import renderArrayMultiline from 'utilities/utilities';
import { LoadingButton } from '@mui/lab';
import { useQueryClient } from '@tanstack/react-query';
import moment from 'moment-timezone';
import { fr } from 'date-fns/locale';
import MomentUtils from '@date-io/moment';
import 'moment/locale/fr';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { format } from 'date-fns';

// constant
const getInitialValues = (event, range) => {
  const newEvent = {
    title: '',
    technicien: '',
    ville: '',
    color: '#2196f3',
    textColor: '',
    allDay: false,
    start: range ? new Date(range.start) : new Date(),
    end: range ? new Date(range.end) : new Date()
  };

  if (event || range) {
    return _.merge({}, newEvent, event);
  }

  return newEvent;
};

const AddEventFrom = ({ event, range, handleDelete, handleCreate, handleUpdate, onCancel, editMode }) => {
  const isCreating = !event;
  const queryClient = useQueryClient();

  console.log(event);

  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    // user_id: null
  });

  const getInspectionTechniciensQuery = useGetInspectionsTechniciens({ userId: event?.id });
  const inspectionTechniciensData = getInspectionTechniciensQuery.data;

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required'),
    technicien: Yup.string().max(255),
    ville: Yup.string().max(5000),
    end: Yup.string(),
    start: Yup.string(),
    // end: Yup.date().when('start', (start, schema) => start && schema.min(start, 'End date must be later than start date')),
    // start: Yup.date(),
    color: Yup.string().max(255),
    textColor: Yup.string().max(255)
  });

  const formik = useFormik({
    initialValues: getInitialValues(
      {
        ...event,
        operation: event?.operation?.reference,
        technicien: event?.technicien?.name,
        ville: event?.chantier?.ville,
        nameBenificaire: event?.chantier?.nom_benificiaire + ' ' + event?.chantier?.prenom_benificiary
      },
      range
    ),
    validationSchema: EventSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const data = {
          ...event,
          nameBenificaire: values.name,
          title: values.title,
          technicien: values.technicien,
          ville: values.ville,
          color: values.color,
          textColor: values.textColor,
          allDay: values.allDay,
          debut: values.start,
          fin: values.end,
          ...formInput
        };

        if (event) {
          try {
            await handleUpdate(event.id, data);
          } catch (error) {
            const errorsObject = error?.response?.data;
            setFormErrors(errorsObject);
          }
        } else {
          handleCreate(data);
        }

        resetForm();
        onCancel();
        setSubmitting(false);
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

  return (
    <FormikProvider value={formik}>
      <LocalizationProvider
        dateAdapter={AdapterMoment}
        // dateLibInstance={moment.utc}

        // libInstance={moment}
        // utils={MomentUtils}
        // adapterLocale={'fr'}
      >
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          {editMode ? (
            <DialogTitle>{event ? 'Modifier Intervention' : 'Ajouter Intervention'}</DialogTitle>
          ) : (
            <DialogTitle>{'Details Intervention'}</DialogTitle>
          )}
          <Divider />
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <TextField
                  disabled
                  variant="standard"
                  fullWidth
                  label="Référence"
                  {...getFieldProps('title')}
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  disabled
                  variant="standard"
                  fullWidth
                  label="Nom bénéficiaire"
                  {...getFieldProps('nameBenificaire')}
                  error={Boolean(touched.nameBenificaire && errors.nameBenificaire)}
                  helperText={touched.nameBenificaire && errors.nameBenificaire}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  disabled
                  variant="standard"
                  fullWidth
                  label="Ville"
                  {...getFieldProps('ville')}
                  error={Boolean(touched.ville && errors.ville)}
                  helperText={touched.ville && errors.ville}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  disabled
                  variant="standard"
                  fullWidth
                  label="Opération"
                  {...getFieldProps('operation')}
                  error={Boolean(touched.operation && errors.operation)}
                  helperText={touched.operation && errors.operation}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                {event?.id ? (
                  event?.technicien && Array.isArray(inspectionTechniciensData) ? (
                    <Autocomplete
                      value={formInput?.user_id}
                      onChange={(event, newValue) => {
                        setFormInput((formData) => {
                          return { ...formData, user_id: newValue?.id };
                        });
                      }}
                      options={inspectionTechniciensData || []}
                      getOptionLabel={(option) => {
                        return option?.name;
                      }}
                      disabled={!editMode}
                      defaultValue={inspectionTechniciensData?.find((e) => event?.technicien?.id === e?.id)}
                      renderInput={(params) => <TextField variant="standard" {...params} label="Sélectionner un technicien" />}
                      error={!!formErrors?.data?.user_id}
                      helperText={renderArrayMultiline(formErrors?.data?.user_id)}
                    />
                  ) : (
                    <Skeleton variant="rounded" width={'100%'} height={40} />
                  )
                ) : (
                  <TextField value={event?.technicien?.name} disabled variant="standard" fullWidth label="Téchnicien" />
                )}
              </Grid>
              {/* <Grid item xs={12}>
                <FormControlLabel control={<Switch checked={values.allDay} {...getFieldProps('allDay')} />} label="Toute la journée" />
              </Grid> */}
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  // {...getFieldProps('start')}
                  disabled={!editMode}
                  label="Date de début"
                  // value={moment(new Date(values.start), 'DD-MM-YYYY hh:mm:ss').utc().format()}
                  // value={moment(new Date(values.start), 'DD-MM-YYYY hh:mm:ss').toDate()}
                  // value={moment(new Date(values.start), 'DD-MM-YYYY hh:mm:ss').utc().format()}
                  // value={values.start}
                  value={moment(values.start).tz('Europe/Paris', true).toDate()}
                  // inputFormat="dd/MM/yyyy HH:mm"
                  onChange={(date) => {
                    // const formattedDate = format(date, 'yyyy-MM-dd hh:mm');

                    return setFieldValue('start', date);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      fullWidth
                      // InputProps={{
                      //   endAdornment: (
                      //     <InputAdornment position="end">
                      //       <DateRangeIcon />
                      //     </InputAdornment>
                      //   )
                      // }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  // {...getFieldProps('end')}
                  disabled={!editMode}
                  label="Date de fin"
                  value={moment(values.end).tz('Europe/Paris', true).toDate()}
                  // value={values.end}
                  // inputFormat="dd/MM/yyyy hh:mm"
                  onChange={(date) => setFieldValue('end', date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      // {...getFieldProps('end')}
                      variant="standard"
                      fullWidth
                      error={Boolean(touched.end && errors.end)}
                      helperText={touched.end && errors.end}
                      // InputProps={{
                      //   endAdornment: (
                      //     <InputAdornment position="end">
                      //       <DateRangeIcon />
                      //     </InputAdornment>
                      //   )
                      // }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                {/* {!isCreating && editMode && (
                  <Tooltip title="Supprimer">
                    <IconButton onClick={() => handleDelete(event?.id)} size="large">
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                )} */}
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button type="button" variant="outlined" onClick={onCancel}>
                    {editMode ? 'Annuler' : 'Quitter'}
                  </Button>
                  {editMode && (
                    <LoadingButton
                      disabled={isSubmitting}
                      type="submit"
                      loadingPosition="start"
                      startIcon={<SaveIcon />}
                      loading={isSubmitting}
                      color={'success'}
                      variant="contained"
                    >
                      {/* <SaveIcon fontSize="small" sx={{ mr: 0.75 }} /> */}
                      {event ? 'Sauvegarder' : 'Ajouter'}
                    </LoadingButton>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </DialogActions>
        </Form>
      </LocalizationProvider>
    </FormikProvider>
  );
};

export default AddEventFrom;
