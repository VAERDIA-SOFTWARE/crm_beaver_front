import { useRef, useState } from 'react';

// material-ui
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { Autocomplete, Box, Grid, Tab, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// project imports
import { LoadingButton, TabList, useTabContext } from '@mui/lab';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import moment from 'moment';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCreateDocument, useGetDocumentsCategories } from 'services/document.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';
import '../../../custom-ck-editor.css';
import CustomFileUpload from '../clients/list/FileUpload';
// import { GeneralHtmlSupport } from '@ckeditor/ckeditor5-html-support';

const DocumentCreatePage = () => {
  const location = useLocation();
  const goBackLink = location.state?.goBackLink;
  // const { clientId } = useParams();
  const fileRef = useRef();

  const [activeTab, setActiveTab] = useState(1);
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const methods = useForm({
    // resolver: zodResolver(imageUploadSchema),
  });

  const getCategoriesQuery = useGetDocumentsCategories();
  const getCategoriesQueryData = getCategoriesQuery.data;

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
      return { ...f, link: files[0] };
    });
  };

  const createDocumentMutation = useCreateDocument();

  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    intitule: '',
    description: '',
    date_debut: new Date(),
    link: null
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
        ...formInput
        // date_debut: format(formInput?.date_debut, 'yyyy-MM-dd'),
        // date_fin: format(formInput?.date_fin, 'yyyy-MM-dd')
      };
      const formData = new FormData();
      for (let key in f) {
        // if (key === 'operationsList') formData.append(key, JSON.stringify(f[key]));
        // else
        formData.append(key, f[key]);
      }

      const res = await createDocumentMutation.mutateAsync(formData);
      navigate('/documents');
      // setActiveTab((t) => t + 1);
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };

  return (
    <MainCard title="Ajouter Document" backButton goBackLink={goBackLink}>
      {/* <TabContext value={activeTab}> */}
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
        {false && (
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
            <Tab label="1 - Informations Globales" value={1} disabled />
            <Tab
              label="2 - Détails Opérations"
              disabled
              // disabled={!contratData?.id}
              value={2}
            />
            <Tab label="3 - Structure" disabled value={3} />
            <Tab label="4 - Validation" disabled value={4} />
          </TabList>
        )}

        {/* <TabPanel value={1}> */}
        <form onSubmit={handleSubmit}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
              {/* <Grid item xs={12}>
                  <Typography variant="h5" component="div">
                    A. Informations générales:
                  </Typography>
                </Grid> */}
              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  fullWidth
                  label="Intitule"
                  value={formInput?.intitule || ''}
                  name="intitule"
                  onChange={handleChange}
                  error={!!formErrors?.data?.intitule}
                  helperText={renderArrayMultiline(formErrors?.data?.intitule)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
              </Grid>
              {/* <Grid item xs={12}>
                  <Divider />
                </Grid> */}
              {/* <Grid item xs={12}>
                  <Typography variant="h5" component="div">
                    B. Infos résidentielles:
                  </Typography>
                </Grid> */}
              {false && (
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
                        variant="standard"
                        {...params}
                        error={!!formErrors?.data?.date_debut}
                        helperText={renderArrayMultiline(formErrors?.data?.date_debut)}
                      />
                    )}
                  />
                </Grid>
              )}

              <Grid item xs={12} md={6}>
                <Autocomplete
                  onChange={(event, newValue) => {
                    // const ids = newValue?.map((e) => e?.id);
                    setFormInput((formData) => {
                      return { ...formData, category_id: newValue?.id };
                    });
                  }}
                  multiple={false}
                  options={getCategoriesQueryData || []}
                  getOptionLabel={(option) => option?.intitule}
                  renderInput={(params) => (
                    <TextField
                      variant="standard"
                      {...params}
                      autoComplete="off"
                      label="Categories*"
                      error={!!formErrors?.data?.category_id}
                      helperText={renderArrayMultiline(formErrors?.data?.category_id)}
                    />
                  )}
                />
              </Grid>

              {true && (
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

                      {formErrors?.data?.link && (
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
                          {renderArrayMultiline(formErrors?.data?.link)}
                        </div>
                      )}
                    </Box>
                  </FormProvider>
                </Grid>
              )}

              <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                <LoadingButton
                  loadingPosition="end"
                  endIcon={<NavigateNextRoundedIcon />}
                  loading={createDocumentMutation.isLoading}
                  // disabled={!contratData?.id}
                  variant="contained"
                  type="submit"
                >
                  Créer
                  {/* Générer structure du contrat */}
                </LoadingButton>
              </Grid>
            </Grid>
          </LocalizationProvider>
        </form>
        {/* </TabPanel> */}
      </div>
      {/* </TabContext> */}
    </MainCard>
  );
};

export default DocumentCreatePage;

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
