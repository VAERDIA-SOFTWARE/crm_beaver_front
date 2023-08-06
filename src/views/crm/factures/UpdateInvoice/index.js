import React, { useEffect, useState } from 'react';

// material-ui

import MainCard from 'ui-component/cards/MainCard';

// third-party

import EditForm from '../forms/EditForm';
import { useParams } from 'react-router-dom';

// yup validation-schema

// ==============================|| CREATE INVOICE ||============================== //

function UpdateInvoice() {
  const { factureId } = useParams();

  return <EditForm invoiceId={factureId} />;
}

export default UpdateInvoice;
