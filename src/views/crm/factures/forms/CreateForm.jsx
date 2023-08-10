// ** React Imports
import { useContext, useEffect, useState } from 'react';

// ** MUI Imports
import Grid from '@mui/material/Grid';

// ** Third Party Components
import axios from 'axios';

// ** Demo Components Imports
// import AddNewCustomers from 'src/views/apps/invoice/add/AddNewCustomer';

// ** Styled Component
import AddCard from '../cards/AddCard';
import { useCreateInvoice, useGetHeaderTotal, useGetNextRefrence } from 'services/facture.service';
// import { useGetClientArticles, useGetDossier } from 'services/dossier.service';
import { useGetSettingsPreferences } from 'services/settings.service';
// import { ArrayContext } from 'src/context/ArrayContext';
import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';
import { useGetArticles } from 'services/articles.service';
import AddActions from '../cards/AddActions';
import { useGetCompanie } from 'services/companies.service';
import MainCard from 'ui-component/cards/MainCard';

const CreateForm = ({ type = 1, title = 'Créer  Facture', goBackLink = '/factures/list' }) => {
  const router = useNavigate();

  // const { dataArray, setDataArray } = useContext(ArrayContext);
  const [dataArray, setDataArray] = useState(JSON.stringify([]));

  // const toggleAddCustomerDrawer = () => setAddCustomerOpen(!addCustomerOpen)
  const createInvoiceMutation = useCreateInvoice();
  const [items, setItems] = useState([]);
  const [reglementIds, setReglementIds] = useState([]);
  const [totalHeader, setTotalHeader] = useState({
    montant_HT_total: '',
    montant_TTC_total: '',
    montant_TVA_total: '',
    montant_HTNet_total: '',
    montant_Remise: ''
  });
  const [articles, setArticles] = useState([]);
  const [invoiceNumber, setinvoiceNumber] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [date, setDate] = useState(new Date());
  const [object, setObject] = useState('');
  const [count, setCount] = useState(1);
  const [operation, setOperation] = useState(null);
  const [numeroPiece, setNumeroPiece] = useState('');

  const dossiersQuery = useGetArticles({});
  const clientArticlesData = dossiersQuery?.data;
  const preferencesQeury = useGetSettingsPreferences();
  const preferencesData = preferencesQeury?.data;
  const nextRefrenceQuery = useGetNextRefrence(type);
  const nextRefrenceData = nextRefrenceQuery?.data;
  // const headerTotalQeury = useGetHeaderTotal(items);
  // const headerTotalData = headerTotalQeury?.data;
  const companiesQuery = useGetCompanie();
  const companiesData = companiesQuery?.data;
  useEffect(() => {
    if (dossiersQuery?.isSuccess) {
      setArticles([...clientArticlesData]);
      setCount(1);
      setSelectedCompany(companiesData);
      return () => {
        setDataArray([]);
      };
    }
  }, [clientArticlesData, dossiersQuery?.isSuccess, companiesData]);
  useEffect(() => {
    setinvoiceNumber(nextRefrenceData?.prochaine_facture);
    setNumeroPiece(nextRefrenceData?.prochaine_facture);
  }, [nextRefrenceData]);

  const handleSubmit = async () => {
    const filteredArray = items.filter((value) => value !== undefined);

    const form = {
      object: object,
      client_id: selectedClient?.id,
      p_society_id: selectedCompany?.id,
      date_facture: date,
      comment: '',
      num_piece: numeroPiece,
      factureLignes: [...filteredArray],
      type: type
    };

    try {
      await createInvoiceMutation.mutateAsync({ values: form });
      router(goBackLink);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <MainCard headerColor={true} title={title} backButton goBackLink={goBackLink}>
      <Grid container spacing={6}>
        <Grid item xl={9} md={8} xs={12}>
          <AddCard
            reglementIds={reglementIds}
            setReglementIds={setReglementIds}
            totalHeader={totalHeader}
            setTotalHeader={setTotalHeader}
            numeroPiece={numeroPiece}
            setNumeroPiece={setNumeroPiece}
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
            // headerTotalQeury={headerTotalQeury}
            // headerTotalData={headerTotalData}
            count={count}
            setCount={setCount}
            operation={operation}
            setOperation={setOperation}
          />
        </Grid>
        <Grid item xl={3} md={4} xs={12}>
          <AddActions handleSubmit={handleSubmit} />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default CreateForm;
