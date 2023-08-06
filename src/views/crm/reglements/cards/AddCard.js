// ** React Imports
import { useState, forwardRef, useEffect, memo } from 'react';

// ** MUI Imports
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Collapse from '@mui/material/Collapse';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import { styled, alpha, useTheme } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import CardContent from '@mui/material/CardContent';

// ** Icon Imports
import Icon from 'ui-component/icon';

// ** Third Party Imports

// ** Configs

// ** Custom Component Imports
import Repeater from 'ui-component/repeater';
import { useGetUsers } from 'services/users.service';
// import { useGetCompanies } from 'src/services/companies.service';

import { FormControl } from '@mui/material';
import { MONTANTHT, MONTANTHTNET, MONTANTTTC, PUHTNET, PUTTC, totalHeaderCalucle } from '../calculate/calcule';
import { DatePicker, DateTimePicker, frFR, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import moment from 'moment/moment';
import { reference } from '@popperjs/core';
import { toast } from 'react-toastify';
const CustomInput = forwardRef(({ ...props }, ref) => {
  return (
    <TextField
      size="small"
      inputRef={ref}
      sx={{ width: { sm: '250px', xs: '170px' }, '& .MuiInputBase-input': { color: 'text.secondary' } }}
      {...props}
    />
  );
});

const getDistinctObjects = (array1, array2) => {
  const uniqueIds = new Set();
  const distinctArray = [];

  // Process array1
  for (const obj of array1) {
    const id = obj?.id;

    if (id && !uniqueIds.has(id)) {
      uniqueIds.add(id);
      distinctArray.push(obj);
    }
  }

  // Process array2 and remove common items
  for (const obj of array2) {
    const id = obj?.id;

    if (id && !uniqueIds.has(id)) {
      uniqueIds.add(id);
      distinctArray.push(obj);
    } else if (id && uniqueIds.has(id)) {
      const index = distinctArray.findIndex((item) => item.id === id);
      if (index !== -1) {
        distinctArray.splice(index, 1);
      }
    }
  }

  return distinctArray;
};

const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  padding: `${theme.spacing(1, 0)} !important`
}));

const CalcWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}));

const RepeatingContent = styled(Grid)(({ theme }) => ({
  paddingRight: 0,
  display: 'flex',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '& .col-title': {
    top: '-1.5rem',
    position: 'absolute'
  },
  '& .MuiInputBase-input': {
    color: theme.palette.text.secondary
  },
  [theme.breakpoints.down('lg')]: {
    '& .col-title': {
      top: '0',
      position: 'relative'
    }
  }
}));

const RepeaterWrapper = styled(CardContent)(({ theme }) => ({
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(5.5),
  '& .repeater-wrapper + .repeater-wrapper': {
    marginTop: theme.spacing(5)
  }
}));

const InvoiceAction = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: theme.spacing(2, 1),
  borderLeft: `1px solid ${theme.palette.divider}`
}));

const CustomSelectItem = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.success.main,
  backgroundColor: 'transparent !important',
  '&:hover': { backgroundColor: `${alpha(theme.palette.success.main, 0.1)} !important` }
}));
const now = new Date();
const tomorrowDate = now.setDate(now.getDate() + 7);

const AddCard = ({
  items,
  setItems,
  clientArticlesData,
  setClientArticlesData,
  preferencesData,
  count,
  setCount,
  disabled = false,
  totalHeader,
  setTotalHeader,
  reglementData,
  rest,
  setRest
}) => {
  // ** States
  const [selected, setSelected] = useState('');
  const [localeArticles, setLocaleArticles] = useState([]);

  // ** React Query
  const clientsQuery = useGetUsers({
    role: 'client',
    type: 1,
    paginated: false
  });
  const clientsData = clientsQuery?.data;

  useEffect(() => {
    setLocaleArticles([...getDistinctObjects(items, clientArticlesData)]);
  }, [clientArticlesData, items]);

  // ** Hook

  // ** Deletes form
  const deleteForm = async (e, i) => {
    e.preventDefault();
    const updatedItems = [...items];
    const item = updatedItems[i];
    updatedItems[i] = undefined;
    const itemBack = clientArticlesData?.find((checkItem) => checkItem?.reference === item?.reference);
    setLocaleArticles((prev) => [...prev, itemBack]);
    // console.log(updatedItems)
    setItems([...updatedItems]);
    setRest((prev) => prev + item?.montant_TTC_total);

    // @ts-ignore
    await e.target.closest('.repeater-wrapper').remove();

    // setCount(updatedItems.length)
  };

  const updateFields = (index, fieldName, fieldValue) => {
    const updatedItems = [...items];
    const newIndex = localeArticles?.findIndex((e) => e?.id === fieldValue);
    const item = localeArticles[newIndex];
    const articles = [...localeArticles];
    if (rest === 0) {
      toast.error('m');
      return 0;
    }

    articles.splice(index, 1);
    setLocaleArticles([...articles]);
    updatedItems[index] = {
      ...updatedItems[index],
      ...item,
      rest_a_payer: rest - item?.montant_TTC_total >= 0 ? 0 : item?.montant_TTC_total - rest
    };
    setRest((prev) => (prev - item?.montant_TTC_total <= 0 ? 0 : prev - item?.montant_TTC_total));
    setItems([...updatedItems]);

    // setItems([...updatedItems])
  };

  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid item xl={6} xs={12} sx={{ mb: { xl: 0, xs: 4 } }}>
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 0, width: '80px' }}>
                Reference :
              </Typography>
              <TextField
                size="small"
                value={reglementData?.reference}
                sx={{ width: { sm: '160px', xs: '160px' } }}
                InputProps={{
                  disabled: true,
                  startAdornment: <InputAdornment position="start">#</InputAdornment>
                }}
              />
            </Box>
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 0, width: '80px' }}>
                Client :
              </Typography>
              <TextField
                size="small"
                value={reglementData?.client?.name}
                sx={{ width: { sm: '160px', xs: '160px' } }}
                InputProps={{
                  disabled: true
                }}
              />
            </Box>
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 0, width: '80px' }}>
                Date de creation :
              </Typography>
              <TextField
                size="small"
                value={reglementData?.created_at}
                sx={{ width: { sm: '160px', xs: '160px' } }}
                InputProps={{
                  disabled: true
                }}
              />
            </Box>
          </Grid>
          <Grid item xl={6} xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xl: 'flex-end', xs: 'flex-start' } }}>
              <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mr: 0, width: '80px' }}>
                  mode regelment :
                </Typography>
                <TextField
                  size="small"
                  value={reglementData?.mode_de_reglement?.intitule}
                  sx={{ width: { sm: '160px', xs: '160px' } }}
                  InputProps={{
                    disabled: true
                  }}
                />
              </Box>
              {(reglementData?.mode_de_reglement?.intitule === 'traite' || reglementData?.mode_de_reglement?.intitule === 'cheque') && (
                <>
                  <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 0, width: '80px' }}>
                      Date echeance :
                    </Typography>
                    <TextField
                      size="small"
                      value={reglementData?.date_echeance}
                      sx={{ width: { sm: '160px', xs: '160px' } }}
                      InputProps={{
                        disabled: true
                      }}
                    />
                  </Box>
                  <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 0, width: '80px' }}>
                      Reference :
                    </Typography>
                    <TextField
                      size="small"
                      value={reglementData?.reference_cheque || reglementData?.reference_traite}
                      sx={{ width: { sm: '160px', xs: '160px' } }}
                      InputProps={{
                        disabled: true
                      }}
                    />
                  </Box>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <Divider sx={{ my: (theme) => `${theme.spacing(1)} !important` }} />

      <CardContent sx={{ pb: 2 }}>
        <Grid container justifyContent={'space-around'}>
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 0, width: '90px' }}>
              MONTANT :
            </Typography>
            <span
              style={{
                fontSize: '1.25rem',
                color: '#212121'
              }}
            >
              {reglementData?.montant}
            </span>
          </Box>
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 0, width: '60px' }}>
              REST :
            </Typography>
            <span
              style={{
                fontSize: '1.25rem',
                color: '#212121'
              }}
            >
              {rest}
            </span>
          </Box>
        </Grid>
      </CardContent>

      <Divider />

      <RepeaterWrapper>
        <Repeater ml={2} count={count}>
          {(i) => {
            const Tag = i === 0 ? Box : Collapse;

            const item = items[i];

            // let LocalItems = [...items]
            // LocalItems.push(item)
            // setItems(LocalItems)

            return (
              <Tag key={i} className="repeater-wrapper" {...(i !== 0 ? { in: true } : {})}>
                <Grid container flex>
                  <RepeatingContent item xs={12}>
                    <Grid
                      container
                      alignItems={'center'}
                      justifyContent={'space-evenly'}
                      gap={0}
                      sx={{ py: 2, width: '100%', pr: { lg: 0, xs: 2 }, pl: { lg: 0, xs: 2 } }}
                      flex
                    >
                      <Grid item>
                        <>
                          <Typography variant="subtitle2" className="col-title" sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}>
                            Article
                          </Typography>
                          {!item?.reference ? (
                            <FormControl sx={{ minWidth: 120, ml: '1rem' }}>
                              <InputLabel>Article</InputLabel>
                              <Select
                                displayEmpty
                                label="Article"
                                size="small"
                                value={item?.id}
                                onChange={(event) => updateFields(i, 'p_operation_id', event?.target?.value)}
                              >
                                {localeArticles?.map((article) => (
                                  <MenuItem key={article?.id} value={article?.id}>
                                    {article?.reference}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          ) : (
                            <>
                              <TextField
                                disabled
                                size="small"
                                sx={{ width: 100 }}
                                value={item?.reference}
                                InputProps={{ inputProps: { min: 0 } }}
                                InputLabelProps={{ shrink: true }}
                              />
                            </>
                          )}
                        </>
                      </Grid>
                      {/* <Grid item> */}
                      {/* <Typography
                          variant='subtitle2'
                          className='col-title'
                          sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                        >
                          Tva
                        </Typography> */}
                      {/* <TextField
                          label='TVA'
                          sx={{ width: 80 }}
                          onChange={event => {
                            const inputValue = event.target.value
                            const numbersOnly = inputValue.replace(/[^0-9.]/g, '')
                            updateFields(i, 'tva_rate', numbersOnly)
                          }}
                          size='small'
                          value={item?.tva_rate}
                          InputProps={{
                            inputProps: { min: 0 },
                            endAdornment: <InputAdornment position='end'>%</InputAdornment>
                          }}
                        />
                      </Grid> */}
                      {/* <Grid item>
                        <Typography
                          variant='subtitle2'
                          className='col-title'
                          sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                        >
                          PU HTNet
                        </Typography>
                        <TextField
                          disabled
                          size='small'
                          sx={{ width: 100 }}
                          value={item?.price_unitaire_HTNet}
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </Grid> */}
                      {/* <Grid item>
                        <Typography
                          variant='subtitle2'
                          className='col-title'
                          sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                        >
                          PU TTC
                        </Typography>
                        <TextField
                          disabled
                          sx={{ width: 100 }}
                          size='small'
                          value={item?.price_unitaire_TTC}
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </Grid> */}
                      {/* <Grid item>
                        <Typography
                          variant='subtitle2'
                          className='col-title'
                          sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                        >
                          Montant HT
                        </Typography>
                        <TextField
                          sx={{ width: 100 }}
                          disabled
                          size='small'
                          type='number'
                          value={item?.amount_HT}
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </Grid> */}
                      <Grid item>
                        <Typography variant="subtitle2" className="col-title" sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}>
                          Montant TTC
                        </Typography>
                        <TextField
                          sx={{ width: 120 }}
                          disabled
                          size="small"
                          type="number"
                          value={item?.montant_TTC_total}
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle2" className="col-title" sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}>
                          Reste a payer
                        </Typography>
                        <TextField
                          sx={{ width: 120 }}
                          disabled
                          size="small"
                          type="number"
                          value={item?.rest_a_payer}
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </Grid>
                      {/* <Grid item>
                        <Typography
                          variant='subtitle2'
                          className='col-title'
                          sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                        >
                          Montant tva
                        </Typography>
                        <TextField
                          sx={{ width: 100 }}
                          disabled
                          size='small'
                          type='number'
                          value={item?.amount_TVA}
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </Grid> */}
                      {/* <Grid item>
                        <Typography
                          variant='subtitle2'
                          className='col-title'
                          sx={{ mb: { md: 2, xs: 0 }, color: 'text.primary' }}
                        >
                          Montant TTC
                        </Typography>
                        <TextField
                          sx={{ width: 100 }}
                          disabled
                          size='small'
                          type='number'
                          value={item?.amount_TTC}
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </Grid> */}
                    </Grid>
                    <InvoiceAction>
                      {!disabled && (
                        <IconButton size="small" onClick={(event) => deleteForm(event, i)}>
                          <Icon icon="mdi:close" fontSize={20} />
                        </IconButton>
                      )}
                    </InvoiceAction>
                  </RepeatingContent>
                </Grid>
              </Tag>
            );
          }}
        </Repeater>

        <Grid container sx={{ mt: 4.75 }}>
          <Grid item xs={12} sx={{ px: 0 }}>
            {!disabled && (
              <Button
                disabled={rest === 0}
                size="small"
                variant="contained"
                startIcon={<Icon icon="mdi:plus" fontSize={20} />}
                onClick={() => {
                  setItems((prev) => [...prev, { nom: '', tva_rate: preferencesData?.taux_tva, qte: 0, remise: 0, p_operation_id: null }]);
                  setCount(count + 1);
                }}
              >
                Ajouter Facture
              </Button>
            )}
          </Grid>
        </Grid>
      </RepeaterWrapper>

      <Divider />

      {/* <CardContent>
        <Grid container>
           <Grid item xs={12} sm={9} sx={{ order: { sm: 1, xs: 2 } }}>
            <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body2" sx={{ mr: 2, color: 'text.primary', fontWeight: 900, letterSpacing: '.25px' }}>
                COORDONNEES BANCAIRES :
              </Typography>
              <Typography variant="body2" sx={{ mr: 2, color: 'text.primary', fontWeight: 600 }}>
                IBAN : {selectedCompany?.iban}
              </Typography>
              <Typography variant="body2" sx={{ mr: 2, color: 'text.primary', fontWeight: 600 }}>
                BIC : {selectedCompany?.bic}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3} sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}>
            <CalcWrapper>
              <Typography variant="body2">Montant HT:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
                {Math.round((totalHeader?.montant_HT_total + Number.EPSILON) * 100) / 100}
              </Typography>
            </CalcWrapper>
            <CalcWrapper>
              <Typography variant="body2">Remise:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>

                {Math.round((totalHeader?.montant_Remise + Number.EPSILON) * 100) / 100}
              </Typography>
            </CalcWrapper>
            <CalcWrapper>
              <Typography variant="body2">Tva:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
                {`${preferencesData?.taux_tva} %`}
              </Typography>
            </CalcWrapper>
            <Divider sx={{ mt: (theme) => `${theme.spacing(6)} !important`, mb: (theme) => `${theme.spacing(1.5)} !important` }} />
            <CalcWrapper>
              <Typography variant="body2">Total:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', lineHeight: '.25px' }}>
                {Math.round((totalHeader?.montant_TTC_total + Number.EPSILON) * 100) / 100}
              </Typography>
            </CalcWrapper>
          </Grid>
        </Grid>
      </CardContent>

      <Divider sx={{ my: (theme) => `${theme.spacing(1)} !important` }} /> */}

      {/* <CardContent sx={{ pt: 4 }}>
        <InputLabel htmlFor="invoice-note">Pieds de page:</InputLabel>
        <TextField
          disabled
          rows={2}
          fullWidth
          multiline
          id="invoice-note"
          sx={{ '& .MuiInputBase-input': { color: 'text.secondary' } }}
          defaultValue={selectedCompany?.footer1}
        />
      </CardContent> */}
    </Card>
  );
};

export default AddCard;
