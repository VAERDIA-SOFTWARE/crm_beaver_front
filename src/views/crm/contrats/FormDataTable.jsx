import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
const modality = [
  {
    value: '0',
    label: 'Modalité de Facturation'
  },
  {
    value: '1',
    label: 'Par Mois'
  },
  {
    value: '2',
    label: 'Par An'
  },
  {
    value: '3',
    label: 'Par Triméstre'
  },
  {
    value: '4',
    label: 'Par Semestre'
  }
];
const formData = {
  // Other form data properties...
  modFacturation: '2'
};

const selectedModality = modality.find((item) => item.value === formData.modFacturation);

const FormDataTable = ({ formData }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Client Lead</TableCell>
            <TableCell>Marque PAC</TableCell>
            <TableCell>First Mise En Place Date</TableCell>
            <TableCell>Contrat Start Date</TableCell>
            <TableCell>Contrat End Date</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Nbr Interventions</TableCell>
            <TableCell>Par</TableCell>
            <TableCell>Mod Facturation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Client {formData?.clientLead}</TableCell>
            <TableCell>{formData?.marquePAC}</TableCell>
            <TableCell>{formData?.firstMiseEnPlaceDate}</TableCell>
            <TableCell>{formData?.contratStartDate}</TableCell>
            <TableCell>{formData?.contratEndDate}</TableCell>
            <TableCell>{formData?.duration}</TableCell>
            <TableCell>{formData?.nbrInterventions}</TableCell>
            <TableCell>{formData?.par === 1 ? 'Mois' : 'An'}</TableCell>
            <TableCell>{selectedModality.label}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FormDataTable;
