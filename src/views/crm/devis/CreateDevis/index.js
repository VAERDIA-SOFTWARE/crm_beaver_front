import React, { useEffect, useState } from 'react';
import CreateForm from 'views/crm/factures/forms/CreateForm';

// yup validation-schema

// ==============================|| CREATE INVOICE ||============================== //

function CreateInvoice() {
  return <CreateForm title={'Créer  Devis'} goBackLink={'/devis/list'} type={0} />;
}

export default CreateInvoice;
