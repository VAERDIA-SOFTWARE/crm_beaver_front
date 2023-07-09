import React, { useEffect } from 'react';
import { Autocomplete, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { DateTimePicker, LocalizationProvider, frFR } from '@mui/x-date-pickers';
import { useGetArticles } from 'services/articles.service';
import { useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import moment from 'moment';

const InterventionRows = ({
  contractArticles,
  setContractArticles,
  interventionNumber,
  modeIntervention,
  // selectedModeIntitule={selectedModeIntitule}
  duration,
  nbrInterventions,
  contratStartDate,
  contratEndDate
}) => {
  const articlesQeury = useGetArticles();
  const articleData = articlesQeury.data;
  useEffect(() => {
    const nbModeInterventions = Math.ceil(duration / modeIntervention?.valeur);
    console.log(modeIntervention, 'nbModeInterventions');
    const nombreArticle = interventionNumber * nbModeInterventions;
    console.log(nombreArticle, 'nombreArticle');
    let newContractArticles = [];
    for (let index = 1; index <= nbModeInterventions; index++) {
      for (let index2 = 1; index2 <= interventionNumber; index2++) {
        newContractArticles.push({
          title: `Intervention ${index2}${modeIntervention?.intitule.replace('Par', '')} ${index}`,
          p_operation_id: '',
          prix_unitaire: '',
          p_category_article_id: '',
          p_category_intitule: '',
          remise: '',
          date_prevu: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        });
      }
    }
    setContractArticles(newContractArticles);
  }, [interventionNumber, modeIntervention, duration]);
  console.log(contractArticles);

  const handleContractArticleUpdate = (index, property, value) => {
    const updatedArticles = [...contractArticles];
    updatedArticles[index][property] = value;
    setContractArticles(updatedArticles);
  };
  const handleContractArticleOprationChange = (index, property, value) => {
    const updatedArticles = [...contractArticles];
    updatedArticles[index]['p_operation_id'] = value?.id;
    updatedArticles[index]['p_category_article_id'] = value?.p_category_article_id;
    updatedArticles[index]['p_category_intitule'] = value?.category?.intitule;
    updatedArticles[index]['remise'] = value?.remise;
    updatedArticles[index]['prix_unitaire'] = value?.prix_unitaire;
    setContractArticles(updatedArticles);
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Intervention</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contractArticles.map((contractArticle, index) => (
            <TableRow key={index}>
              <TableCell>{contractArticle.title}</TableCell>
              <TableCell>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  // adapterLocale="fr"
                  localeText={frFR.components.MuiLocalizationProvider.defaultProps.localeText}
                >
                  <DateTimePicker
                    ampm={false}
                    inputFormat="dd/MM/yyyy HH:mm"
                    renderInput={(params) => <TextField variant="standard" {...params} />}
                    label="Date de fin Prévu"
                    value={moment(contractArticle.date_prevu).format('YYYY-MM-DD HH:mm:ss')}
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
                  renderInput={(params) => (
                    <TextField
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
                  value={contractArticle.prix_unitaire}
                  onChange={(e) => handleContractArticleUpdate(index, 'prix_unitaire', e.target.value)}
                  // Additional props for the TextField component
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={contractArticle.p_category_intitule}
                  disabled
                  // Additional props for the TextField component
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={contractArticle.remise}
                  onChange={(e) => handleContractArticleUpdate(index, 'remise', e.target.value)}
                  // Additional props for the TextField component
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const articleDetailsRow = () => {};
export default InterventionRows;
