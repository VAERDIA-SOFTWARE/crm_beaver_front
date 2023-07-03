import { useEffect, useRef, useState } from 'react';

// material-ui
import DeleteIcon from '@mui/icons-material/Delete';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { Box, Divider, Grid, Tab, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// project imports
import { LoadingButton, TabList, useTabContext } from '@mui/lab';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { useConfirm } from 'material-ui-confirm';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDeleteCategorie, useGetCategorie, useUpdateCategorie } from 'services/categorie.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';

const CategorieUpdatePage = () => {
  const { categorieId } = useParams();
  const location = useLocation();
  const goBackLink = location.state?.goBackLink;
  const fileRef = useRef();

  const deleteCategorieMutation = useDeleteCategorie(categorieId);

  const confirm = useConfirm();

  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    intitule: '',
    description: '',
    date_debut: new Date(),
    link: null
  });

  const [activeTab, setActiveTab] = useState(1);
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const methods = useForm({
    // resolver: zodResolver(imageUploadSchema),
  });

  const getCategorieQuery = useGetCategorie(categorieId);
  const categorieQueryData = getCategorieQuery.data;

  useEffect(() => {
    if (getCategorieQuery.isSuccess) {
      setFormInput((f) => {
        return { ...f, ...categorieQueryData };
      });
    }
  }, [categorieQueryData, getCategorieQuery.isSuccess]);

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

  const updateCategorieMutation = useUpdateCategorie();

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
        if (f[key] === null) formData.append(key, '');
        else formData.append(key, f[key]);
      }

      const res = await updateCategorieMutation.mutateAsync({ categorieId, values: formData });
      // setActiveTab((t) => t + 1);
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };

  return (
    <MainCard
      title={`Modifier Document ${categorieQueryData?.intitule ? '- ' + categorieQueryData?.intitule : ''}`}
      backButton
      goBackLink={goBackLink}
    >
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

              <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                <LoadingButton
                  loadingPosition="end"
                  endIcon={<NavigateNextRoundedIcon />}
                  loading={updateCategorieMutation.isLoading}
                  // disabled={!contratData?.id}
                  variant="contained"
                  type="submit"
                >
                  Modifier
                  {/* Générer structure du contrat */}
                </LoadingButton>
              </Grid>
            </Grid>
          </LocalizationProvider>
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
            disabled={getCategorieQuery.isLoading}
            loadingPosition="start"
            startIcon={<DeleteIcon />}
            loading={deleteCategorieMutation.isLoading}
            variant="outlined"
            color="error"
            onClick={() =>
              confirm({
                description: `Êtes-vous sûr de vouloir supprimer ${categorieQueryData?.intitule}.`,
                title: `Veuillez confirmer la suppression`
              })
                .then(async () => {
                  try {
                    await deleteCategorieMutation.mutateAsync({ documentId: categorieId });
                    navigate('/documents', {
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

        {/* </TabPanel> */}
      </div>
      {/* </TabContext> */}
    </MainCard>
  );
};

export default CategorieUpdatePage;

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
