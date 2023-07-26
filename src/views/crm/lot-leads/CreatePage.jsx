import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

// material-ui
import SendIcon from '@mui/icons-material/Send';
import { Box, Grid, Typography } from '@mui/material';

// project imports
import { LoadingButton } from '@mui/lab';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetClientsContrats } from 'services/contrats.service';
import { useGetUsers } from 'services/users.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';
import CustomFileUpload from '../clients/list/FileUpload';
import useAuth from 'hooks/useAuth';
import { useCreateLotLead } from 'services/lot-leads.service';

const LotChantierCreatePage = () => {
  const fileRef = useRef();

  const onSubmitHandler = (values) => {
    const formData = new FormData();
    formData.append('image', values.image);

    if (values.images.length > 0) {
      values.images.forEach((el) => formData.append('images', el));
    }

    // Call the Upload API
    // uploadImage(formData);
  };
  const methods = useForm({
    // resolver: zodResolver(imageUploadSchema),
  });

  const navigate = useNavigate();
  const location = useLocation();
  const goBackLink = location.state?.goBackLink;
  const createLotChantiersMutation = useCreateLotLead();

  const initialFormState = {
    percentage: 0,
    d_contrat_id: null,
    chemin_fichier: null,
    generate_interventions: 0
  };
  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState(initialFormState);

  const [sheetActualRowCount, setSheetActualRowCount] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    const formData = new FormData();

    for (let [key, value] of Object.entries(formInput)) {
      formData.append(key, value);
    }

    try {
      const res = await createLotChantiersMutation.mutateAsync(formData);
      navigate(`/lot-leads/${res?.data?.id}/details`);
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    } finally {
    }
  };

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
        });
      };
    }
  };

  return (
    <MainCard title="Importer Leads" backButton goBackLink={goBackLink}>
      <div
        style={{
          maxWidth: 650,
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        <>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
              <Grid item xs={12} md={12}>
                <>
                  <Typography variant="h3" component="div">
                    Importer Leads
                  </Typography>

                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
                      <Grid item xs={12}>
                        <FormProvider {...methods}>
                          <Box component="form" noValidate autoComplete="off" onSubmit={methods.handleSubmit(onSubmitHandler)}>
                            <CustomFileUpload
                              fileTypes={['xlsx']}
                              ref={fileRef}
                              limit={1}
                              multiple={false}
                              name="file"
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
                  </form>
                </>
              </Grid>

              <Grid item sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={12}>
                <LoadingButton
                  loadingPosition="end"
                  endIcon={<SendIcon />}
                  loading={createLotChantiersMutation.isLoading}
                  variant="contained"
                  type="submit"
                >
                  Créer
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </>
      </div>
    </MainCard>
  );
};

LotChantierCreatePage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default LotChantierCreatePage;
