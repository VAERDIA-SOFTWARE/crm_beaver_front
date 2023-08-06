import React, { useEffect, useState } from 'react';

// material-ui

import MainCard from 'ui-component/cards/MainCard';

// third-party

import { useParams } from 'react-router-dom';
import EditForm from 'views/crm/factures/forms/EditForm';

// yup validation-schema

// ==============================|| CREATE INVOICE ||============================== //

function UpdateInvoice() {
  const { devisId } = useParams();

  return <EditForm invoiceId={devisId} title={'Editer  Devis'} goBackLink={'/devis/list'} type={0} />;
}

export default UpdateInvoice;
