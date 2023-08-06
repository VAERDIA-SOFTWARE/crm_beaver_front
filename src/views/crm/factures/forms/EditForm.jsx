// ** React Imports
import { useContext, useEffect, useState } from 'react';

// ** MUI Imports
import Grid from '@mui/material/Grid';

// ** Third Party Components
import axios from 'axios';

// ** Demo Components Imports
import AddActions from '../cards/AddActions';

// ** Styled Component
import AddCard from '../cards/AddCard';
import {
  useCancelInvoice,
  useCreateInvoiceAvoir,
  useGetHeaderTotal,
  useGetInvoiceById,
  useGetNextRefrence,
  useUpdateInvoice,
  useValidateInvoice
} from 'services/facture.service';
// import { useGetClientArticles, useGetDossier } from 'services/dossier.service';
import { useGetSettingsPreferences } from 'services/settings.service';
// import { ArrayContext } from 'src/context/ArrayContext';
import { toast } from 'react-toastify';
import { useGetArticles } from 'services/articles.service';

import moment from 'moment/moment';
import InvoicePdfDialog from '../dialog/InvoicePdfDialog';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { useGetCompanie } from 'services/companies.service';
import MainCard from 'ui-component/cards/MainCard';

const EditForm = ({ invoiceId, type = 1, title = 'Editer Facture', goBackLink = '/factures/list' }) => {
  const router = useNavigate();

  // const toggleAddCustomerDrawer = () => setAddCustomerOpen(!addCustomerOpen)
  const [totalHeader, setTotalHeader] = useState({
    montant_HT_total: '',
    montant_TTC_total: '',
    montant_TVA_total: '',
    montant_HTNet_total: '',
    montant_Remise: ''
  });
  // const createInvoiceAvoirMutation = useCreateInvoiceAvoir(invoiceId);
  const updateInvoiceMutation = useUpdateInvoice(invoiceId);
  const validateInvoiceMutation = useValidateInvoice(invoiceId);
  const cancelInvoiceMutation = useCancelInvoice(invoiceId);
  const [items, setItems] = useState([]);
  const [articles, setArticles] = useState([]);
  const [reglementIds, setReglementIds] = useState([]);
  const [count, setCount] = useState(1);
  const [invoiceNumber, setinvoiceNumber] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showInvoice, setShowInvoice] = useState(false);
  const [object, setObject] = useState('');
  const [disabled, setDisabled] = useState(false);
  // const [avoir, setAvoir] = useState(false);
  const [numeroPiece, setNumeroPiece] = useState('');
  const [operation, setOperation] = useState(null);

  const dossiersQuery = useGetArticles({});
  const clientArticlesData = dossiersQuery?.data;
  const preferencesQeury = useGetSettingsPreferences();
  const preferencesData = preferencesQeury?.data;
  const invoiceQuery = useGetInvoiceById(invoiceId);
  const invoiceData = invoiceQuery?.data;
  const companiesQuery = useGetCompanie();
  const companiesData = companiesQuery?.data;
  useEffect(() => {
    if (invoiceQuery?.isSuccess) {
      if (invoiceData?.status?.status !== 0) {
        setDisabled(true);
      }
      setinvoiceNumber(invoiceData?.reference);
      setSelectedClient(invoiceData?.user);
      setSelectedCompany(companiesData);
      setObject(invoiceData?.object);
      setOperation(invoiceData?.operation);
      setNumeroPiece(invoiceData?.num_piece);

      setDate(new Date(moment(invoiceData?.date_facture, 'YYYY-MM-DD HH:mm:ss').format()));
      invoiceQuery?.isSuccess && setItems([...invoiceData?.facture_lignes]);
      dossiersQuery?.isSuccess && setArticles([...clientArticlesData]);
      setCount(invoiceData?.invoice_lines?.length === 0 ? 1 : invoiceData?.facture_lignes?.length);
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
      reference: invoiceNumber,
      object: object,
      client_id: selectedClient?.id,
      p_society_id: selectedCompany?.id,
      date_facture: date,
      num_piece: numeroPiece,
      comment: '',
      factureLignes: [...filteredArray],
      type: type
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
            reglementIds={reglementIds}
            setReglementIds={setReglementIds}
            totalHeader={totalHeader}
            setTotalHeader={setTotalHeader}
            numeroPiece={numeroPiece}
            setNumeroPiece={setNumeroPiece}
            operation={operation}
            setOperation={setOperation}
            disabled={disabled}
            items={items}
            setItems={setItems}
            invoiceNumber={invoiceNumber}
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
            selectedCompany={selectedCompany}
            setSelectedCompany={setSelectedCompany}
            date={date}
            setDate={setDate}
            object={object}
            setObject={setObject}
            clientArticlesData={articles}
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
      <div style={{ width: 1300 }}>
        <InvoicePdfDialog reference={invoiceNumber} invoiceId={invoiceId} setOpen={setShowInvoice} open={showInvoice} />
      </div>
    </MainCard>
  );
};

export default EditForm;
