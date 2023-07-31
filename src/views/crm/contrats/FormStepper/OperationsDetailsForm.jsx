import {
  Autocomplete,
  Button,
  Divider,
  Grid,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import { format } from 'date-fns';
import moment from 'moment';
import { useEffect, useState } from 'react';
import renderArrayMultiline from 'utilities/utilities';
import PropTypes from 'prop-types';
import AnimateButton from 'ui-component/extended/AnimateButton';

import { DateTimePicker, LocalizationProvider, frFR } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useUpdateContrat } from 'services/contrats.service';
import { useGetArticles } from 'services/articles.service';
const DetailsInterventions = ({ handleNext, handleBack, contractForm, setContractForm }) => {
  // const location = useLocation();
  // const clientId = location.state?.clientId;
  const [formErrors, setFormErrors] = useState({});
  const articlesQuery = useGetArticles({});
  const articleData = articlesQuery?.data;
  const updateClientMutation = useUpdateContrat();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    try {
      const formattedInput = {
        ...contractForm,
        date_debut: moment(contractForm?.date_debut).format('YYYY-MM-DD'),
        date_fin: moment(contractForm?.date_fin).format('YYYY-MM-DD'),
        mise_en_place_date: moment(contractForm?.date_debut).format('YYYY-MM-DD')
      };

      const response = await updateClientMutation.mutateAsync(formattedInput);
      setContractForm({ ...contractForm, ...response?.data });

      handleNext(1);
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };

  const handleContractArticleUpdate = (index, property, value) => {
    const updatedArticles = [...contractForm?.operations];
    updatedArticles[index][property] = value;
    setContractForm({ ...contractForm, operations: updatedArticles });
  };
  const handleContractArticleOprationChange = (index, property, value) => {
    const updatedArticles = [...contractForm?.operations];
    updatedArticles[index]['p_operation_id'] = value?.id;
    updatedArticles[index]['p_category_article_id'] = value?.p_category_article_id;
    updatedArticles[index]['remise'] = value?.remise;
    updatedArticles[index]['prix_unitaire'] = value?.prix_unitaire;
    updatedArticles[index]['category'] = value?.category;
    updatedArticles[index]['unite'] = value?.unite;
    updatedArticles[index]['unite_id'] = value?.unite?.id;
    setContractForm({ ...contractForm, operations: updatedArticles });
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={2}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: 250 }}>Intervention</TableCell>
                      <TableCell sx={{ width: 200 }}>Date Intervention</TableCell>
                      <TableCell sx={{ width: 300 }}>Article</TableCell>
                      <TableCell sx={{ width: 100 }}>Prix U</TableCell>
                      <TableCell sx={{ width: 100 }}>Remise</TableCell>
                      <TableCell sx={{ width: 80 }}>Unité</TableCell>
                      <TableCell>Catégorie</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {contractForm?.operations.map((contractArticle, index) => (
                      <TableRow key={index}>
                        <TableCell>{contractArticle?.designation}</TableCell>
                        <TableCell>
                          <LocalizationProvider
                            dateAdapter={AdapterDateFns}
                            // adapterLocale="fr"
                            localeText={frFR.components.MuiLocalizationProvider.defaultProps.localeText}
                          >
                            <DateTimePicker
                              ampm={false}
                              inputFormat="dd/MM/yyyy"
                              renderInput={(params) => <TextField fullWidth variant="standard" {...params} />}
                              label="Date de fin Prévu"
                              value={moment(contractArticle?.date_prevu).format('YYYY-MM-DD HH:mm:ss')}
                              onChange={(v) => {
                                try {
                                  const formattedDate = moment(v).format('YYYY-MM-DD HH:mm:ss');
                                  handleContractArticleUpdate(index, 'date_prevu', formattedDate);
                                } catch (error) {}
                              }}
                            />
                          </LocalizationProvider>
                        </TableCell>
                        <TableCell>
                          <Autocomplete
                            onChange={(event, newValue) => {
                              handleContractArticleOprationChange(index, 'p_operation_id', newValue);
                            }}
                            multiple={false}
                            options={articleData || []}
                            getOptionLabel={(option) => option?.reference}
                            defaultValue={articleData?.find((item) => item?.id === contractForm?.operations[index]?.p_operation_id)}
                            renderInput={(params) => (
                              <TextField
                                fullWidth
                                required
                                variant="standard"
                                {...params}
                                label="Selectionner une Mode"
                                // error={!!formErrors?.data?.mode_id}
                                // helperText={renderArrayMultiline(formErrors?.data?.mode_id)}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            variant="standard"
                            margin="normal"
                            value={contractArticle?.prix_unitaire}
                            onChange={(e) => handleContractArticleUpdate(index, 'prix_unitaire', e.target.value)}
                            // Additional props for the TextField component
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            variant="standard"
                            margin="normal"
                            value={contractArticle.remise}
                            onChange={(e) => handleContractArticleUpdate(index, 'remise', e.target.value)}
                            // Additional props for the TextField component
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            variant="standard"
                            margin="normal"
                            value={contractArticle?.unite?.intitule}
                            disabled
                            // Additional props for the TextField component
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            variant="standard"
                            margin="normal"
                            value={contractArticle?.category?.intitule}
                            disabled
                            // Additional props for the TextField component
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between">
              <Button onClick={handleBack} sx={{ my: 3, ml: 1 }}>
                Back
              </Button>
              <AnimateButton>
                <Button variant="contained" onClick={handleSubmit} sx={{ my: 3, ml: 1 }}>
                  Next
                </Button>
              </AnimateButton>
            </Stack>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Box>
  );
};
DetailsInterventions.propTypes = {
  shippingData: PropTypes.object,
  setShippingData: PropTypes.func,
  handleNext: PropTypes.func
};
export default DetailsInterventions;
