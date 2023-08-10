import { useEffect, useState } from 'react';
// material-ui
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { Autocomplete, Divider, Grid, Skeleton, TextField, Typography } from '@mui/material';
import { DateTimePicker, DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';

// project imports
import { LoadingButton } from '@mui/lab';
import { useConfirm } from 'material-ui-confirm';
import { useNavigate, useParams } from 'react-router-dom';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import { useGetReglement, useUpdateReglement } from 'services/reglements.service';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import moment from 'moment/moment';
import AddActions from '../cards/AddActions';
import AddCard from '../cards/AddCard';
import {
  useCancelInvoice,
  useGetFactures,
  useGetInvoiceById,
  useGetInvoices,
  useUpdateInvoice,
  useValidateInvoice
} from 'services/facture.service';
import { useGetArticles } from 'services/articles.service';
import { useGetSettingsPreferences } from 'services/settings.service';
import { useGetCompanie } from 'services/companies.service';

const UpdateReglement = ({ invoiceId, type = 1, title = 'Editer Reglement', goBackLink = '/factures/list' }) => {
  const router = useNavigate();
  const { reglementId } = useParams();

  // const toggleAddCustomerDrawer = () => setAddCustomerOpen(!addCustomerOpen)
  const [totalHeader, setTotalHeader] = useState({
    montant_HT_total: '',
    montant_TTC_total: '',
    montant_TVA_total: '',
    montant_HTNet_total: '',
    montant_Remise: ''
  });
  // const createInvoiceAvoirMutation = useCreateInvoiceAvoir(invoiceId);
  const updateInvoiceMutation = useUpdateReglement(reglementId);
  const validateInvoiceMutation = useValidateInvoice(reglementId);
  const cancelInvoiceMutation = useCancelInvoice(reglementId);
  const [reglementData, setReglementData] = useState({
    libelle: '',
    p_mode_de_reglement_id: '',
    date_echeance: new Date(),
    date: new Date(),
    reference_cheque: '',
    reference_traite: '',
    montant: '',
    factures: [],
    client_id: ''
  });
  const [items, setItems] = useState([]);
  const [articles, setArticles] = useState([]);
  const [count, setCount] = useState(1);

  const [showInvoice, setShowInvoice] = useState(false);
  const [disabled, setDisabled] = useState(false);
  // const [avoir, setAvoir] = useState(false);
  const [rest, setRest] = useState(0);
  const [operation, setOperation] = useState(null);

  const dossiersQuery = useGetFactures({ payed: '0', paginated: false, clientId: reglementData?.client_id });
  const clientArticlesData = dossiersQuery?.data;
  const preferencesQeury = useGetSettingsPreferences();
  const preferencesData = preferencesQeury?.data;
  const invoiceQuery = useGetReglement(reglementId);
  const invoiceData = invoiceQuery?.data;
  const companiesQuery = useGetCompanie();
  const companiesData = companiesQuery?.data;
  useEffect(() => {
    if (invoiceQuery?.isSuccess) {
      if (invoiceData?.reste === 0) {
        setDisabled(true);
      }
      setReglementData({ ...invoiceData });
      setRest(invoiceData?.reste);
      invoiceQuery?.isSuccess && setItems([...invoiceData?.factures]);
      dossiersQuery?.isSuccess && setArticles([...clientArticlesData]);
      setCount(invoiceData?.factures?.length === 0 ? 1 : invoiceData?.factures?.length);
    }
  }, [dossiersQuery?.isSuccess, clientArticlesData, invoiceData, invoiceQuery?.isSuccess, companiesData]);

  // useEffect(() => {
  // }, [nextRefrenceData])
  const handlePrintInvoice = () => {
    const fileURL = `${process.env.REACT_APP_API_URL}factures/${invoiceId}/pdf`;
    const link = document.createElement('a');
    link.href = fileURL;
    link.target = '_blank';
    link.download = 'download.pdf';
    link.click();
  };

  const handleSubmit = async () => {
    const filteredArray = items.filter((value) => value !== undefined);

    const form = {
      ...reglementData,
      factures: [...filteredArray]
    };

    try {
      await updateInvoiceMutation.mutateAsync(form);

      router(goBackLink);
    } catch (error) {
      // toast.error(error?.response?.data?.message);
    }
  };

  return (
    <MainCard
      title={title}
      headerColor={true}
      backButton
      goBackLink={goBackLink}
      secondary={
        <div style={{ display: 'flex', gap: '1rem' }}>
          {invoiceData?.status?.status === 0 && (
            <>
              <LoadingButton
                loadingPosition="end"
                loading={validateInvoiceMutation.isLoading}
                onClick={async () => {
                  try {
                    await validateInvoiceMutation.mutateAsync();
                    router(goBackLink);
                  } catch {}
                }}
                variant="contained"
                type="submit"
                sx={{
                  backgroundColor: '#2ea50d'
                }}
              >
                {invoiceData?.p_type === 21 ? 'Generer Facture' : 'Valider'}
              </LoadingButton>
              <LoadingButton
                sx={{
                  backgroundColor: 'rgb(239, 68, 68)'
                }}
                loadingPosition="end"
                loading={cancelInvoiceMutation.isLoading}
                onClick={async () => {
                  try {
                    await cancelInvoiceMutation.mutateAsync();
                    router(goBackLink);
                  } catch {}
                }}
                variant="contained"
                type="submit"
              >
                Annuler
              </LoadingButton>
            </>
          )}

          {/* {invoiceData?.state?.state === 1 && invoiceData?.nature?.nature === '1' && (
            <LoadingButton
              loadingPosition='end'
              loading={validateInvoiceMutation.isLoading}
              onClick={async () => {
                try {
                  await createInvoiceAvoirMutation.mutateAsync()
                  router.push('/invoices')
                } catch {}
              }}
              variant='contained'
              type='submit'
              sx={{
                backgroundColor: 'rgb(239, 68, 68)'
              }}
            >
              Facture AVoir
            </LoadingButton>
          )} */}
        </div>
      }
    >
      <Grid container spacing={6}>
        <Grid item xl={9} md={8} xs={12}>
          <AddCard
            rest={rest}
            setRest={setRest}
            reglementData={reglementData}
            totalHeader={totalHeader}
            setTotalHeader={setTotalHeader}
            disabled={disabled}
            items={items}
            setItems={setItems}
            clientArticlesData={articles}
            setClientArticlesData={setArticles}
            preferencesData={preferencesData}
            count={count}
            setCount={setCount}
          />
        </Grid>
        <Grid item xl={3} md={4} xs={12}>
          <AddActions
            disabled={disabled}
            edit={true}
            mainAction="Editer"
            handleSubmit={handleSubmit}
            showInvoice={showInvoice}
            setShowInvoice={setShowInvoice}
            printInvoice={handlePrintInvoice}
          />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default UpdateReglement;
