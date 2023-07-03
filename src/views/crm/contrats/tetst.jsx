import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// material-ui
import AddIcon from '@mui/icons-material/AddTwoTone';
import SendIcon from '@mui/icons-material/Send';
import {
  Autocomplete,
  Box,
  Grid,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';

// project imports
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { LoadingButton, TabContext, TabList, useTabContext } from '@mui/lab';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import moment from 'moment';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useCreateContrat,
  useGetContratsOperations,
  useGetContratsSkeleton,
  useUpdateContratsOperations,
  useToggleContratStatus,
  useUpdateContrat,
  useUpdateContratSkeleton
} from 'services/contrats.service';
import { useGetUsers } from 'services/users.service';
import { useGetOperations } from 'services/zone-villes.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';
import '../../../custom-ck-editor.css';
import CustomFileUpload from '../clients/list/FileUpload';
import { cloneDeep } from 'lodash';
import { toast } from 'react-toastify';
import TextEditor from './TextEditor';
// import { GeneralHtmlSupport } from '@ckeditor/ckeditor5-html-support';

const ContratCreatePage = () => {
  const location = useLocation();
  const clientId = location.state?.clientId;
  const goBackLink = location.state?.goBackLink;
  // const { clientId } = useParams();
  console.log(clientId);
  const fileRef = useRef();

  const [activeTab, setActiveTab] = React.useState('1');
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const [contratData, setContratData] = useState(null);

  const getContratsSkeletonQuery = useGetContratsSkeleton({
    contratId: contratData?.id
  });

  const [contratSkeletonLocalData, setContratSkeletonLocalData] = useState(null);

  React.useEffect(() => {
    setContratSkeletonLocalData(getContratsSkeletonQuery.data?.data);

    return () => {};
  }, [getContratsSkeletonQuery.data?.data]);

  const methods = useForm({
    // resolver: zodResolver(imageUploadSchema),
  });

  const contratsOperationsQuery = useGetContratsOperations({ contratId: contratData?.id });

  const [localContratsOperations, setLocalContratsOperations] = useState({});

  useEffect(() => {
    if (contratsOperationsQuery.isSuccess) {
      setLocalContratsOperations(contratsOperationsQuery.data);
    }

    return () => {};
  }, [contratsOperationsQuery.data, contratsOperationsQuery.isSuccess]);

  const updateContratOperationsMutation = useUpdateContratsOperations({ contratId: contratData?.id });

  const toggleContratStatusMutation = useToggleContratStatus(contratData?.id);
  const updateContratMutation = useUpdateContrat(contratData?.id);

  const updateContratSkeletonMutation = useUpdateContratSkeleton();

  const getOperationsQuery = useGetOperations();
  const serverOperationsData = getOperationsQuery.data;

  const onSubmitHandler = (values) => {
    const formData = new FormData();
    formData.append('image', values.image);

    if (values.images.length > 0) {
      values.images.forEach((el) => formData.append('images', el));
    }

    // Call the Upload API
    // uploadImage(formData);
  };

  const onFileDelete = () => {
    // setSheetActualRowCount(null);
    methods.reset();
    fileRef.current.value = null;
  };

  const handleFilesChange = (files) => {
    // Update chosen files
    setFormInput((f) => {
      return { ...f, pdf_path: files[0] };
    });
  };

  const createContratMutation = useCreateContrat({ clientId });

  const getClientsQuery = useGetUsers({ role: 'client', paginated: false });
  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    titre: '',
    // description: '',
    date_debut: new Date(),
    date_fin: new Date(),
    user_id: clientId || null,
    pdf_path: null,
    percentage: 0,
    operationsList: []
  });

  const navigate = useNavigate();

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
      const f = {
        ...formInput,
        date_debut: format(formInput?.date_debut, 'yyyy-MM-dd'),
        date_fin: format(formInput?.date_fin, 'yyyy-MM-dd')
      };
      const formData = new FormData();
      for (let key in f) {
        if (key === 'operationsList') formData.append(key, JSON.stringify(f[key]));
        else formData.append(key, f[key]);
      }

      f['operations_json'] = f?.operations?.map((e) => serverOperationsData?.find((d) => d?.id == e)?.reference);

      formData.append('operations_json', JSON.stringify(f['operations_json']));
      setActiveTab((t) => t + 1);
      // if (contratData?.id) {
      //   const res = await updateContratMutation.mutateAsync(formData);
      //   setContratData(res.data);
      //   setActiveTab((t) => t + 1);
      // } else {
      //   const res = await createContratMutation.mutateAsync(formData);
      //   setContratData(res.data);
      //   setActiveTab((t) => t + 1);
      // }
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };

  const [activeOperationFilter, setActiveOperationFilter] = useState(null);

  const selectedOperations = formInput?.operations?.map((formOp) => {
    return serverOperationsData?.find((o) => o?.id === formOp);
  });
  const [duration, setDuration] = useState(0);
  const calculateDuration = () => {
    const startDate = moment(formInput?.date_debut, 'DD-MM-YYYY');
    const endDate = moment(formInput?.date_fin, 'DD-MM-YYYY');
    const duration = endDate.diff(startDate, 'days');
    setDuration(duration);
  };
  const [billingFrequency, setBillingFrequency] = useState('');

  const handleBillingFrequencyChange = (event) => {
    setBillingFrequency(event.target.value);
  };
  return (
    <MainCard title="Ajouter Contrat" backButton goBackLink={goBackLink}>
      <TabContext value={activeTab}>
        <div
          style={{
            maxWidth: 2000,
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        >
          {/* <Grid item xs={12} md={9} lg={7}>
          <ValidationWizard />
        </Grid> */}
          <TabList
            value={activeTab}
            indicatorColor="primary"
            onChange={handleTabChange}
            sx={{
              mb: 3,
              minHeight: 'auto',
              '& button': {
                minWidth: 100
              },
              '& a': {
                minHeight: 'auto',
                minWidth: 10,
                py: 1.5,
                px: 1,
                mr: 2.25,
                color: 'grey.600'
              },
              '& a.Mui-selected': {
                color: 'primary.main'
              }
            }}
            variant="fullWidth"
          >
            <Tab label="1 - Informations Globales" value={'1'} disabled />
            <Tab
              label="2 - Détails Interventions"
              disabled
              // disabled={!contratData?.id}
              value={'2'}
            />
            <Tab label="3 - Structure" disabled value={'3'} />
            <Tab label="4 - Modalité de Facturation" disabled value={'4'} />
          </TabList>

          <TabPanel value="1">
            <form onSubmit={handleSubmit}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
                  {/* <Grid item xs={12}>
                  <Typography variant="h5" component="div">
                    A. Informations générales:
                  </Typography>
                </Grid> */}
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
                            variant="standard"
                            {...params}
                            label="Client / Lead"
                            error={!!formErrors?.data?.user_id}
                            helperText={renderArrayMultiline(formErrors?.data?.user_id)}
                          />
                        )}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="standard"
                      fullWidth
                      label="Marque PAC"
                      value={formInput?.titre || ''}
                      name="titre"
                      onChange={handleChange}
                      error={!!formErrors?.data?.titre}
                      helperText={renderArrayMultiline(formErrors?.data?.titre)}
                    />
                  </Grid>
                  {/* <Grid item xs={12} md={6}>
                    <TextField
                      variant="standard"
                      fullWidth
                      label="Description"
                      value={formInput?.description || ''}
                      name="description"
                      onChange={handleChange}
                      error={!!formErrors?.data?.description}
                      helperText={renderArrayMultiline(formErrors?.data?.description)}
                    />
                  </Grid> */}
                  {/* <Grid item xs={12}>
                  <Divider />
                </Grid> */}
                  {/* <Grid item xs={12}>
                  <Typography variant="h5" component="div">
                    B. Infos résidentielles:
                  </Typography>
                </Grid> */}
                  <Grid item xs={12} md={6}>
                    <DesktopDatePicker
                      label="Date de 1er Mise En Place"
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
                          fullWidth
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
                      label="Date de débu
                      t"
                      inputFormat="dd/MM/yyyy"
                      value={formInput.date_debut}
                      onChange={(v) => {
                        setFormInput((f) => ({ ...f, date_debut: v }));
                        calculateDuration();
                      }}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
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
                      value={formInput.date_fin}
                      onChange={(v) => {
                        setFormInput((f) => ({ ...f, date_fin: v }));
                        calculateDuration();
                      }}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          variant="standard"
                          {...params}
                          error={!!formErrors?.data?.date_fin}
                          helperText={renderArrayMultiline(formErrors?.data?.date_fin)}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField label="Duration (in days)" variant="standard" value={duration} disabled fullWidth />
                  </Grid>
                  {/* <Grid item xs={12} md={6}>
                    <Autocomplete
                      onChange={(event, newValue) => {
                        const ids = newValue?.map((e) => e?.id);
                        setFormInput((formData) => {
                          return { ...formData, operations: ids };
                        });
                      }}
                      multiple={true}
                      options={serverOperationsData || []}
                      getOptionLabel={(option) => option?.reference}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          variant="standard"
                          {...params}
                          autoComplete="off"
                          label="Operations*"
                          error={!!formErrors?.data?.operations_json}
                          helperText={renderArrayMultiline(formErrors?.data?.operations_json)}
                        />
                      )}
                    />
                  </Grid> */}
                  {/* {!clientId && (
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
                            variant="standard"
                            {...params}
                            label="Client*"
                            error={!!formErrors?.data?.user_id}
                            helperText={renderArrayMultiline(formErrors?.data?.user_id)}
                          />
                        )}
                      />
                    </Grid>
                  )} */}
                  {/* <Grid item xs={12}>
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
                  </Grid> */}
                  {/* {false && (
                    <Grid item xs={12}>
                      <FormProvider {...methods}>
                        <Box component="form" noValidate autoComplete="off" onSubmit={methods.handleSubmit(onSubmitHandler)}>
                          <CustomFileUpload
                            fileTypes={['pdf']}
                            ref={fileRef}
                            limit={1}
                            multiple={false}
                            name="image"
                            handleFilesChange={handleFilesChange}
                            onFileDelete={onFileDelete}
                          />

                          {formErrors?.data?.pdf_path && (
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
                              {renderArrayMultiline(formErrors?.data?.pdf_path)}
                            </div>
                          )}
                        </Box>
                      </FormProvider>
                    </Grid>
                  )} */}

                  <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                    <LoadingButton
                      loadingPosition="end"
                      endIcon={<NavigateNextRoundedIcon />}
                      loading={createContratMutation.isLoading || updateContratMutation.isLoading}
                      // disabled={!contratData?.id}
                      variant="contained"
                      type="submit"
                    >
                      Suivant
                      {/* Générer structure du contrat */}
                    </LoadingButton>
                  </Grid>

                  {false && (
                    <OperationsTable
                      activeOperationFilter={activeOperationFilter}
                      setFormInput={setFormInput}
                      setActiveOperationFilter={setActiveOperationFilter}
                      selectedOperations={selectedOperations}
                      formInput={formInput}
                      serverOperationsData={serverOperationsData}
                    />
                  )}
                </Grid>
              </LocalizationProvider>
            </form>
          </TabPanel>

          <TabPanel value="2">
            <form onSubmit={handleSubmit}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      variant="standard"
                      fullWidth
                      label="Nombre des Interventions Par Mois"
                      value={formInput?.titre || ''}
                      name="titre"
                      type="Number"
                      onChange={handleChange}
                      error={!!formErrors?.data?.titre}
                      helperText={renderArrayMultiline(formErrors?.data?.titre)}
                    />
                  </Grid>

                  {false && (
                    <OperationsTable
                      activeOperationFilter={activeOperationFilter}
                      setFormInput={setFormInput}
                      setActiveOperationFilter={setActiveOperationFilter}
                      selectedOperations={selectedOperations}
                      formInput={formInput}
                      serverOperationsData={serverOperationsData}
                    />
                  )}
                </Grid>
                <div
                  style={{
                    marginBottom: 25,
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 20,
                    paddingTop: '2rem'
                  }}
                >
                  <LoadingButton
                    variant="outlined"
                    onClick={async () => {
                      setActiveTab((t) => t - 1);
                    }}
                  >
                    Précédent
                  </LoadingButton>
                  <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                    <LoadingButton
                      loadingPosition="end"
                      endIcon={<NavigateNextRoundedIcon />}
                      loading={createContratMutation.isLoading || updateContratMutation.isLoading}
                      // disabled={!contratData?.id}
                      variant="contained"
                      type="submit"
                    >
                      Suivant
                      {/* Générer structure du contrat */}
                    </LoadingButton>
                  </Grid>
                </div>
              </LocalizationProvider>
            </form>
          </TabPanel>

          <TabPanel value="3">
            <div>
              <MainCard content={true}>
                <div>
                  <TextEditor />
                </div>
              </MainCard>
            </div>
            <div
              style={{
                marginBottom: 25,
                display: 'flex',
                justifyContent: 'space-between',
                gap: 20,
                paddingTop: '2rem'
              }}
            >
              <LoadingButton
                variant="outlined"
                onClick={async () => {
                  setActiveTab((t) => t - 1);
                }}
              >
                Précédent
              </LoadingButton>
              <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                <LoadingButton
                  loadingPosition="end"
                  endIcon={<NavigateNextRoundedIcon />}
                  loading={createContratMutation.isLoading || updateContratMutation.isLoading}
                  // disabled={!contratData?.id}
                  variant="contained"
                  type="submit"
                  onClick={async () => {
                    setActiveTab((t) => t + 1);
                  }}
                >
                  Suivant
                  {/* Générer structure du contrat */}
                </LoadingButton>
              </Grid>
            </div>
          </TabPanel>

          <TabPanel value="4">
            <form onSubmit={handleSubmit}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
                  <Grid item xs={12} md={6}>
                    <InputLabel id="billing-frequency-label">Modalité de facturation:</InputLabel>

                    <Select
                      labelId="billing-frequency-label"
                      id="billing-frequency"
                      value={billingFrequency}
                      onChange={handleBillingFrequencyChange}
                      variant="standard"
                      fullWidth
                    >
                      <MenuItem value="">Sélectionner</MenuItem>
                      <MenuItem value="mois">Par mois</MenuItem>
                      <MenuItem value="an">Par an</MenuItem>
                      <MenuItem value="3mois">Tous les 3 mois</MenuItem>
                      {/* Add more MenuItem components as needed */}
                    </Select>
                  </Grid>

                  {false && (
                    <OperationsTable
                      activeOperationFilter={activeOperationFilter}
                      setFormInput={setFormInput}
                      setActiveOperationFilter={setActiveOperationFilter}
                      selectedOperations={selectedOperations}
                      formInput={formInput}
                      serverOperationsData={serverOperationsData}
                    />
                  )}
                </Grid>
                <div
                  style={{
                    marginTop: 25,
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <LoadingButton
                    variant="outlined"
                    onClick={async () => {
                      setActiveTab((t) => t - 1);
                    }}
                  >
                    Précédent
                  </LoadingButton>

                  <LoadingButton
                    // disabled={!contratData?.id}
                    loadingPosition="end"
                    endIcon={<SendIcon />}
                    // loading={toggleContratStatusMutation.isLoading}
                    variant="contained"
                    // type="submit"
                    // onClick={async () => {
                    //   await toggleContratStatusMutation.mutateAsync(contratData?.id);
                    //   navigate('/contrats/list');
                    // }}
                    onClick={navigate('/contrats/list')}
                  >
                    Confirmer
                  </LoadingButton>
                </div>
              </LocalizationProvider>
            </form>
            {/* <div
            style={{
              marginTop: 25
            }}
          >
            <div
              style={{
                marginBottom: 25,
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <LoadingButton
                variant="outlined"
                onClick={async () => {
                  setActiveTab((t) => t - 1);
                }}
              >
                Précédent
              </LoadingButton>

              <LoadingButton
                disabled={!contratData?.id}
                loadingPosition="end"
                endIcon={<SendIcon />}
                loading={toggleContratStatusMutation.isLoading}
                variant="contained"
                // type="submit"
                onClick={async () => {
                  await toggleContratStatusMutation.mutateAsync(contratData?.id);
                  navigate('/contrats/list');
                }}
              >
                Confirmer
              </LoadingButton>
            </div>

            <iframe
              key={activeTab}
              style={{
                borderRadius: 10,
                borderColor: '#90caf975',
                boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
                border: '0px solid'
              }}
              title="contrat-pdf"
              // srcDoc={fetchedRapport}
              src={contratData?.pdf_download_link}
              width="100%"
              height="900px"
            ></iframe>
          </div> */}
          </TabPanel>
        </div>
      </TabContext>
    </MainCard>
  );
};

export default ContratCreatePage;

function OperationDetailsRow({ op, setFormInput, serverOperationsData, formInput, localContratsOperations, setLocalContratsOperations }) {
  const selectedOperations = formInput?.operations?.map((formOp) => {
    return serverOperationsData?.find((o) => o?.id === formOp);
  });

  return (
    <TableRow hover>
      <TableCell sx={{ pl: 3 }} component="th" scope="row">
        <div
          style={{
            width: 300,
            display: 'flex',
            gap: 10,
            alignItems: 'center'
          }}
        >
          {op?.limites_prestastion_condition === 'à' && (
            <TextField
              style={
                {
                  // marginBottom: 10
                }
              }
              InputProps={{ inputProps: { min: 0 } }}
              type="number"
              variant="standard"
              fullWidth
              label="Limites Min*"
              value={op?.limites_prestastion_min || ''}
              onChange={(v) => {
                setLocalContratsOperations((finput) => {
                  return {
                    ...finput,
                    operations: cloneDeep(finput)?.operations?.map((opType) => {
                      if (opType?.title == op?.operationParent) {
                        return {
                          ...opType,
                          operations: opType?.operations?.map((opTypeOp) => {
                            if (opTypeOp?.id == op?.id) {
                              return {
                                ...op,
                                limites_prestastion_min: v.target.value
                                // operation: op?.operation,
                                // operationParent: op?.operationParent
                              };
                            }

                            return opTypeOp;
                          })
                        };
                      }
                      return opType;
                    })
                  };
                });

                // setFormInput((finput) => {
                //   return {
                //     ...finput,
                //     operationsList: [
                //       ...finput?.operationsList?.map((e) => {
                //         if (op?.id == e?.id) {
                //           return { ...e, limites_prestastion_min: v.target.value };
                //         }
                //         return e;
                //       })
                //     ]
                //   };
                // });
              }}
            />
          )}

          <Autocomplete
            style={{
              width: 300
            }}
            // defaultValue={localContratsOperations?.listHoraires?.find((e) => {
            //   return e?.title == op?.operation;
            // })}
            onChange={(event, newValue) => {
              setLocalContratsOperations((finput) => {
                return {
                  ...finput,
                  operations: cloneDeep(finput)?.operations?.map((opType) => {
                    if (opType?.title == op?.operationParent) {
                      return {
                        ...opType,
                        operations: opType?.operations?.map((opTypeOp) => {
                          if (opTypeOp?.id == op?.id) {
                            return {
                              ...op,
                              limites_prestastion_condition: newValue
                              // operation: op?.operation,
                              // operationParent: op?.operationParent
                            };
                          }

                          return opTypeOp;
                        })
                      };
                    }
                    return opType;
                  })
                };
              });
            }}
            multiple={false}
            options={['=', '>', '>=', '<', '<=', 'à'] || []}
            // getOptionLabel={(option) => option?.intitule}
            defaultValue={'='}
            renderInput={(params) => (
              <TextField
                variant="standard"
                {...params}
                label="Condition*"
                // error={!!formErrors?.data?.user_id}
                // helperText={renderArrayMultiline(formErrors?.data?.user_id)}
              />
            )}
          />

          <TextField
            style={
              {
                // marginTop: 10
              }
            }
            InputProps={{ inputProps: { min: 0 } }}
            type="number"
            variant="standard"
            fullWidth
            label={op?.limites_prestastion_condition === 'à' ? 'Limites Max*' : 'Limites*'}
            value={op?.limites_prestastion_max || ''}
            onChange={(v) => {
              setLocalContratsOperations((finput) => {
                return {
                  ...finput,
                  operations: cloneDeep(finput)?.operations?.map((opType) => {
                    if (opType?.title == op?.operationParent) {
                      return {
                        ...opType,
                        operations: opType?.operations?.map((opTypeOp) => {
                          if (opTypeOp?.id == op?.id) {
                            return {
                              ...op,
                              limites_prestastion_max: v.target.value
                              // operation: op?.operation,
                              // operationParent: op?.operationParent
                            };
                          }

                          return opTypeOp;
                        })
                      };
                    }
                    return opType;
                  })
                };
              });

              // setFormInput((finput) => {
              //   return {
              //     ...finput,
              //     operationsList: [
              //       ...finput?.operationsList?.map((e) => {
              //         if (op?.id == e?.id) {
              //           return { ...e, limites_prestastion_max: v.target.value };
              //         }
              //         return e;
              //       })
              //     ]
              //   };
              // });
            }}
          />
        </div>
      </TableCell>

      <TableCell align="center">
        <TextField variant="standard" fullWidth label="Operation*" value={op?.operation || ''} disabled />
      </TableCell>

      <TableCell align="center">
        <TextField variant="standard" fullWidth label="TVA*" value={localContratsOperations?.tva || ''} disabled />
      </TableCell>

      <TableCell sx={{ pr: 3 }} align="center">
        <TextField
          variant="standard"
          fullWidth
          label="Prix unitaire*"
          InputProps={{ inputProps: { min: 0 } }}
          type="number"
          value={op?.prix_unitaire || ''}
          onChange={(v) => {
            setLocalContratsOperations((finput) => {
              return {
                ...finput,
                operations: cloneDeep(finput)?.operations?.map((opType) => {
                  if (opType?.title == op?.operationParent) {
                    return {
                      ...opType,
                      operations: opType?.operations?.map((opTypeOp) => {
                        if (opTypeOp?.id == op?.id) {
                          return {
                            ...op,
                            prix_unitaire: v.target.value
                            // operation: op?.operation,
                            // operationParent: op?.operationParent
                          };
                        }

                        return opTypeOp;
                      })
                    };
                  }
                  return opType;
                })
              };
            });

            // setFormInput((finput) => {
            //   return {
            //     ...finput,
            //     operationsList: [
            //       ...finput?.operationsList?.map((e) => {
            //         if (op?.id == e?.id) {
            //           return { ...e, limites_prestastion: v.target.value };
            //         }
            //         return e;
            //       })
            //     ]
            //   };
            // });
          }}
        />
      </TableCell>

      <TableCell sx={{ pr: 3 }} align="center">
        {true && (
          <Autocomplete
            // defaultValue={localContratsOperations?.listHoraires?.find((e) => {
            //   return e?.title == op?.operation;
            // })}
            onChange={(event, newValue) => {
              setLocalContratsOperations((finput) => {
                return {
                  ...finput,
                  operations: cloneDeep(finput)?.operations?.map((opType) => {
                    if (opType?.title == op?.operationParent) {
                      return {
                        ...opType,
                        operations: opType?.operations?.map((opTypeOp) => {
                          if (opTypeOp?.id == op?.id) {
                            return {
                              ...op,
                              unite: newValue?.id
                              // operation: op?.operation,
                              // operationParent: op?.operationParent
                            };
                          }

                          return opTypeOp;
                        })
                      };
                    }
                    return opType;
                  })
                };
              });

              // setFormInput((finput) => {
              //   return {
              //     ...finput,
              //     operationsList: [
              //       ...finput?.operationsList?.map((e) => {
              //         if (op?.id == e?.id) {
              //           return { ...e, operation: newValue?.id };
              //         }
              //         return e;
              //       })
              //     ]
              //   };
              // });
            }}
            multiple={false}
            options={localContratsOperations?.listUnite || []}
            getOptionLabel={(option) => option?.intitule}
            // defaultValue={localContratsOperations?.listUnite?.[0]}
            renderInput={(params) => (
              <TextField
                variant="standard"
                {...params}
                label="Unite*"
                // error={!!formErrors?.data?.user_id}
                // helperText={renderArrayMultiline(formErrors?.data?.user_id)}
              />
            )}
          />
        )}
      </TableCell>

      <TableCell sx={{ pr: 3 }} align="center">
        <TextField
          variant="standard"
          fullWidth
          label="Durée Intervention*"
          InputProps={{ inputProps: { min: 0 } }}
          type="text"
          value={op?.duree_intervention || ''}
          onChange={(v) => {
            setLocalContratsOperations((finput) => {
              return {
                ...finput,
                operations: cloneDeep(finput)?.operations?.map((opType) => {
                  if (opType?.title == op?.operationParent) {
                    return {
                      ...opType,
                      operations: opType?.operations?.map((opTypeOp) => {
                        if (opTypeOp?.id == op?.id) {
                          return {
                            ...op,
                            duree_intervention: v.target.value
                            // operation: op?.operation,
                            // operationParent: op?.operationParent
                          };
                        }

                        return opTypeOp;
                      })
                    };
                  }
                  return opType;
                })
              };
            });
          }}
        />
      </TableCell>

      <TableCell sx={{ pr: 3 }} align="center">
        {true && (
          <Autocomplete
            // defaultValue={localContratsOperations?.listHoraires?.find((e) => {
            //   return e?.title == op?.operation;
            // })}
            onChange={(event, newValue) => {
              setLocalContratsOperations((finput) => {
                return {
                  ...finput,
                  operations: cloneDeep(finput)?.operations?.map((opType) => {
                    if (opType?.title == op?.operationParent) {
                      return {
                        ...opType,
                        operations: opType?.operations?.map((opTypeOp) => {
                          if (opTypeOp?.id == op?.id) {
                            return {
                              ...op,
                              duree: newValue?.id
                              // operation: op?.operation,
                              // operationParent: op?.operationParent
                            };
                          }

                          return opTypeOp;
                        })
                      };
                    }
                    return opType;
                  })
                };
              });

              // setFormInput((finput) => {
              //   return {
              //     ...finput,
              //     operationsList: [
              //       ...finput?.operationsList?.map((e) => {
              //         if (op?.id == e?.id) {
              //           return { ...e, operation: newValue?.id };
              //         }
              //         return e;
              //       })
              //     ]
              //   };
              // });
            }}
            multiple={false}
            options={localContratsOperations?.listHoraires || []}
            getOptionLabel={(option) => option?.intitule}
            // defaultValue={localContratsOperations?.listHoraires?.[0]}
            renderInput={(params) => (
              <TextField
                variant="standard"
                {...params}
                label="Duree*"
                // error={!!formErrors?.data?.user_id}
                // helperText={renderArrayMultiline(formErrors?.data?.user_id)}
              />
            )}
          />
        )}
      </TableCell>

      <TableCell sx={{ pr: 3 }} align="center">
        {true && (
          <Autocomplete
            // defaultValue={localContratsOperations?.listHoraires?.find((e) => {
            //   return e?.title == op?.operation;
            // })}
            onChange={(event, newValue) => {
              setLocalContratsOperations((finput) => {
                return {
                  ...finput,
                  operations: cloneDeep(finput)?.operations?.map((opType) => {
                    if (opType?.title == op?.operationParent) {
                      return {
                        ...opType,
                        operations: opType?.operations?.map((opTypeOp) => {
                          if (opTypeOp?.id == op?.id) {
                            return {
                              ...op,
                              conditionnement: newValue?.id
                              // operation: op?.operation,
                              // operationParent: op?.operationParent
                            };
                          }

                          return opTypeOp;
                        })
                      };
                    }
                    return opType;
                  })
                };
              });

              // setFormInput((finput) => {
              //   return {
              //     ...finput,
              //     operationsList: [
              //       ...finput?.operationsList?.map((e) => {
              //         if (op?.id == e?.id) {
              //           return { ...e, operation: newValue?.id };
              //         }
              //         return e;
              //       })
              //     ]
              //   };
              // });
            }}
            multiple={false}
            options={localContratsOperations?.listUniteTypes || []}
            getOptionLabel={(option) => option?.intitule}
            // defaultValue={localContratsOperations?.listUniteTypes?.[0]}
            renderInput={(params) => (
              <TextField
                variant="standard"
                {...params}
                label="Conditionnement*"
                // error={!!formErrors?.data?.user_id}
                // helperText={renderArrayMultiline(formErrors?.data?.user_id)}
              />
            )}
          />
        )}
      </TableCell>

      <TableCell sx={{ pr: 3 }} align="center">
        <IconButton
          color="secondary"
          size="large"
          onClick={async (e) => {
            setLocalContratsOperations((finput) => {
              return {
                ...finput,
                operations: cloneDeep(finput)?.operations?.map((opType) => {
                  if (opType?.title == op?.operationParent) {
                    return {
                      ...opType,
                      operations: opType?.operations?.filter((opTypeOp) => {
                        return opTypeOp?.id != op?.id;
                      })
                    };
                  }
                  return opType;
                })
              };
            });
          }}
        >
          <DeleteIcon sx={{ fontSize: '1.3rem' }} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

function OperationsTable({
  setLocalContratsOperations,
  localContratsOperations,
  setFormInput,
  selectedOperations,
  formInput,
  serverOperationsData,
  opParent
}) {
  const [activeOperationFilter, setActiveOperationFilter] = useState(null);

  return (
    <Grid item xs={12}>
      <MainCard
        content={false}
        title={opParent?.title}
        secondary={
          <div
            style={{
              display: 'flex',
              gap: 5,
              flexWrap: 'wrap',
              alignItems: 'center'
            }}
          >
            {activeOperationFilter && (
              <IconButton
                color="primary"
                size="large"
                onClick={() => {
                  setLocalContratsOperations((finput) => {
                    return {
                      ...finput,
                      operations: finput?.operations?.map((op) => {
                        if (op?.title == opParent?.title) {
                          // const aa = [
                          //   // ...finput?.operationsList,
                          //   {
                          //     ...finput?.operations?.[key],
                          //     id: uuidv4(),
                          //     limites_prestastion: '',
                          //     prix_unitaire: '',
                          //     duree_intervention: '',
                          //     operation: activeOperationFilter
                          //   }
                          // ];
                          // return { [key]: aa };
                          return {
                            ...op,
                            operations: [
                              ...op?.operations,
                              {
                                // ...finput?.operations?.[key],
                                id: uuidv4(),
                                limites_prestastion_min: '',
                                limites_prestastion_max: '',
                                limites_prestastion_condition: '=',
                                prix_unitaire: '',
                                duree_intervention: '',
                                operation: activeOperationFilter,
                                operationParent: opParent?.title,
                                tva: localContratsOperations?.tva
                              }
                            ]
                          };
                        }
                        return op;
                      })
                    };
                  });
                }}
              >
                <AddIcon sx={{ fontSize: '1.3rem' }} />
              </IconButton>
            )}

            <Autocomplete
              style={{
                width: 250
              }}
              onChange={(event, newValue) => {
                setActiveOperationFilter(newValue);
              }}
              multiple={false}
              options={opParent?.allowedOperations || []}
              getOptionLabel={(option) => option}
              // defaultValue={[top100Films[0], top100Films[4]]}
              renderInput={(params) => (
                <TextField
                  variant="outlined"
                  {...params}
                  label="Opération*"
                  // error={!!formErrors?.data?.user_id}
                  // helperText={renderArrayMultiline(formErrors?.data?.user_id)}
                />
              )}
            />
          </div>
        }
      >
        {/* table */}
        <TableContainer>
          <Table sx={{ minWidth: 350 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ pl: 3 }}
                  style={{
                    minWidth: 200
                  }}
                >
                  Limites de prestation
                </TableCell>

                <TableCell
                  align="center"
                  style={{
                    minWidth: 300
                  }}
                >
                  Type d'opération
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ pr: 3 }}
                  style={{
                    minWidth: 200
                  }}
                >
                  TVA
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ pr: 3 }}
                  style={{
                    minWidth: 200
                  }}
                >
                  Prix unitaire € H.T.
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ pr: 3 }}
                  style={{
                    minWidth: 200
                  }}
                >
                  Unite
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ pr: 3 }}
                  style={{
                    minWidth: 200
                  }}
                >
                  Durée Intervention
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ pr: 3 }}
                  style={{
                    minWidth: 200
                  }}
                >
                  Duree
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ pr: 3 }}
                  style={{
                    minWidth: 200
                  }}
                >
                  Conditionnement
                </TableCell>

                <TableCell align="center" sx={{ pr: 3 }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {localContratsOperations?.operations
                ?.filter((e) => {
                  return opParent?.id == e?.id;
                })
                ?.map((row) => {
                  return row?.operations?.map((r) => {
                    return (
                      <OperationDetailsRow
                        op={r}
                        setFormInput={setFormInput}
                        formInput={formInput}
                        key={r?.id}
                        serverOperationsData={serverOperationsData}
                        setLocalContratsOperations={setLocalContratsOperations}
                        localContratsOperations={localContratsOperations}
                      />
                    );
                  });
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>
    </Grid>
  );
}

function TabPanel({ children, value, index, ...other }) {
  const { value: contextValue } = useTabContext() || {};

  return (
    <div
      style={{
        display: value === contextValue ? 'block' : 'none'
      }}
      // hidden={value !== index}
      key={value}
      {...other}
    >
      <Box>{children}</Box>

      {/* {value === index && <Box sx={{ p: 0 }}>{children}</Box>} */}
    </div>
  );
}

const ContentEditableWithRef = (props) => {
  const defaultValue = useRef(props.value);

  const handleInput = (event) => {
    if (props.onChange) {
      props.onChange(event);
    }
  };

  return <div contentEditable style={props?.style} onInput={handleInput} dangerouslySetInnerHTML={{ __html: defaultValue.current }} />;
};
