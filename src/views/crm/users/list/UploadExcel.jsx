import PropTypes from 'prop-types';
import { forwardRef, useEffect, useRef, useState } from 'react';

// material-ui
import SendIcon from '@mui/icons-material/Send';
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Input,
  Slide,
  Slider,
  Switch,
  TextField,
  Typography
} from '@mui/material';

// project imports
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useGetClientsContrats } from 'services/contrats.service';
import { useCreateLotChantier } from 'services/lot-chantiers.service';
import { gridSpacing } from 'store/constant';
import renderArrayMultiline from 'utilities/utilities';
import CustomFileUpload from './FileUpload';

// animation
const Transition = forwardRef((props, ref) => <Slide direction="left" ref={ref} {...props} />);

const UploadExcel = ({ open, handleCloseDialog, rowData }) => {
  const clientId = rowData?.id;
  const fileRef = useRef();

  const onSubmitHandler = (values) => {
    const formData = new FormData();
    formData.append('image', values.image);

    if (values.images.length > 0) {
      values.images.forEach((el) => formData.append('images', el));
    }

    console.log(values);

    // Call the Upload API
    // uploadImage(formData);
  };
  const methods = useForm({
    // resolver: zodResolver(imageUploadSchema),
  });

  const [isLoadingOverlayOpen, setIsLoadingOverlayOpen] = useState(false);
  const handleCloseLoadingOverlay = () => {
    setIsLoadingOverlayOpen(false);
  };
  const handleOpenLoadingOverlay = () => {
    setIsLoadingOverlayOpen(true);
  };

  const navigate = useNavigate();

  const createLotChantiersMutation = useCreateLotChantier();

  const getClientContratsQuery = useGetClientsContrats({ clientId });
  const initialFormState = {
    percentage: null,
    d_contrat_id: null,
    chemin_fichier: null,
    generate_inspections: 0
  };
  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState(initialFormState);

  const [sheetActualRowCount, setSheetActualRowCount] = useState(null);

  const handleChange = (e) => {
    let targetValue = null;

    if (['generate_inspections'].includes(e.target.name)) {
      targetValue = e.target.checked ? 1 : 0;
      if (!e.target.checked) {
        setFormInput({
          ...formInput,
          percentage: 0
        });
      }
    } else {
      targetValue = e.target.value;
    }

    setFormInput({
      ...formInput,
      [e.target.name]: targetValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    const formData = new FormData();

    for (let [key, value] of Object.entries(formInput)) {
      formData.append(key, value);
    }

    try {
      handleOpenLoadingOverlay();
      const res = await createLotChantiersMutation.mutateAsync(formData);
      navigate(`/lot-chantier/${res?.data?.id}/details`, {
        // state: {
        //   LotChantierId: res?.data?.id
        // }
      });
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    } finally {
      handleCloseLoadingOverlay();
    }
  };

  const [filesToUpload, setFilesToUpload] = useState([]);

  const onFileDelete = () => {
    setSheetActualRowCount(null);
    fileRef.current.value = null;
  };

  const handleFilesChange = (files) => {
    // Update chosen files
    setFormInput({
      ...formInput,
      chemin_fichier: files[0]
    });

    const Excel = require('exceljs');
    const workbook = new Excel.Workbook();

    setSheetActualRowCount(null);

    if (files[0]) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(files[0]);
      reader.onload = () => {
        const buffer = reader.result;
        workbook.xlsx.load(buffer).then((workbook) => {
          console.log(workbook, 'workbook instance');
          console.log(workbook.worksheets[0].actualRowCount, 'rowcount');

          const actualRowCount = workbook.worksheets[0].actualRowCount;

          setSheetActualRowCount(actualRowCount);

          // workbook.eachSheet((sheet, id) => {
          //   sheet.eachRow((row, rowIndex) => {
          //     console.log(row.values, rowIndex);
          //   });
          // });
        });
      };
    }
    // if (files[0]) {
    //   workbook.xlsx.readFile(files[0]).then(function () {
    //     const ws = workbook.getWorksheet('Sheet1');
    //     const cell = ws.getCell('A1').value;
    //     console.log(cell);
    //   });
    // }

    setFilesToUpload([...files]);
  };

  const uploadFiles = () => {
    // Create a form and post it to server
    let formData = new FormData();
    filesToUpload.forEach((file) => formData.append('files', file));

    fetch('/file/upload', {
      method: 'POST',
      body: formData
    });
  };

  const [selectedContrat, setSelectedContrat] = useState(null);
  useEffect(() => {
    setFormInput({
      ...formInput,
      percentage: selectedContrat?.percentage
    });

    return () => {};
  }, [selectedContrat?.id]);

  return (
    <Dialog open={open} TransitionComponent={Transition} onClose={handleCloseDialog}>
      <DialogTitle>Importer la liste des chantiers</DialogTitle>
      <form onSubmit={handleSubmit} noValidate>
        <DialogContent>
          <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
            <Grid item xs={12}>
              <Autocomplete
                onChange={(event, newValue) => {
                  setSelectedContrat(newValue);

                  setFormInput((formData) => {
                    return { ...formData, d_contrat_id: newValue?.id };
                  });
                }}
                options={getClientContratsQuery?.data || []}
                getOptionLabel={(option) => option.titre}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Contrat*"
                    error={!!formErrors?.data?.d_contrat_id}
                    helperText={renderArrayMultiline(formErrors?.data?.d_contrat_id)}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <FormGroup row>
                  <FormControlLabel
                    control={<Switch checked={formInput?.generate_inspections} name="generate_inspections" onChange={handleChange} />}
                    label="Generer inspections"
                  />
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Pourcentage</Typography>
              <Slider
                disabled={!formInput?.generate_inspections}
                value={formInput?.percentage}
                aria-label="Default"
                valueLabelDisplay="on"
                name="percentage"
                onChange={handleChange}
              />
              <Input
                value={formInput?.percentage}
                size="small"
                // onChange={handleInputChange}
                // onBlur={handleBlur}
                inputProps={{
                  min: 0,
                  max: 100,
                  type: 'number',
                  'aria-labelledby': 'input-slider'
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormProvider {...methods}>
                <Box component="form" noValidate autoComplete="off" onSubmit={methods.handleSubmit(onSubmitHandler)}>
                  <CustomFileUpload
                    fileTypes={['xlsx']}
                    limit={1}
                    ref={fileRef}
                    multiple={false}
                    name="image"
                    handleFilesChange={handleFilesChange}
                    onFileDelete={onFileDelete}
                  />
                  {sheetActualRowCount && <div>Nombre total de lignes: {sheetActualRowCount}</div>}

                  {formErrors?.data?.chemin_fichier && (
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
                      {renderArrayMultiline(formErrors?.data?.chemin_fichier)}
                    </div>
                  )}
                </Box>
              </FormProvider>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={createLotChantiersMutation.isLoading}
            loadingPosition="start"
            startIcon={<SendIcon />}
            variant="contained"
            type="submit"
          >
            Créer
          </LoadingButton>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoadingOverlayOpen}
            // onClick={handleCloseLoadingOverlay}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <Button variant="text" color="error" onClick={handleCloseDialog}>
            Fermer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

UploadExcel.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default UploadExcel;
