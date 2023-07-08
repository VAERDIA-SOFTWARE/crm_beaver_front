import React from 'react';
import { Autocomplete, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';

const InterventionRows = ({
  selectedModeValue,
  selectedMode,
  duration,
  nbrInterventions,
  contratStartDate,
  contratEndDate,
  interventionDates,
  handleInterventionDateChange
}) => {
  const articlesQeury = useGetArticles();
  const articleData = articlesQeury.data;
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Intervention</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default InterventionRows;
