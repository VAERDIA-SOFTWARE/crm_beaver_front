// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Paper, TextField, Typography } from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';

// assets

import { useGetpointages } from 'services/rh.service';
import moment from 'moment';
import MainCard from 'ui-component/cards/MainCard';
import { useState } from 'react';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { gridSpacing } from 'store/constant';

const TimeLineCol = ({ searchFilter, setSearchFilter, pointages }) => {
  const theme = useTheme();

  const paper = {
    p: 2.5,
    boxShadow: 'none',
    background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
    border: '1px dashed',
    borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.dark : theme.palette.primary.dark
  };
  return (
    <>
      {pointages && pointages.length > 0 ? (
        <Timeline position="alternate">
          {/* <MainCard> */}
          {pointages.map((element) => (
            <div key={element.id}>
              <TimelineItem>
                <TimelineOppositeContent>
                  <Typography variant="body2" color="textSecondary">
                    {element.date_debut && element.date_debut != null
                      ? moment(element.date_debut).format('DD/MM/YYYY, h:mm:ss a')
                      : 'Le Date est Vide '}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="success" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Paper elevation={3} sx={paper}>
                    <Typography variant="h5" component="h1">
                      {element.emplacement}
                    </Typography>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineOppositeContent>
                  <Typography variant="body2" color="textSecondary">
                    {moment(element.date_fin).format('DD/MM/YYYY, h:mm:ss a')}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="warning" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Paper elevation={3} sx={paper}>
                    <Typography variant="h5" component="h1">
                      {element.emplacement_fin}
                    </Typography>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            </div>
          ))}
          {/* </MainCard> */}
        </Timeline>
      ) : (
        <Typography variant="body1">No Pointages available.</Typography>
      )}
    </>
  );
};
export default function PointageList({ pointageList, searchFilter, setSearchFilter, pointages }) {
  return (
    <MainCard title="Liste de pointage" content={false} secondary={<Grid item xs={12} sm={12} sx={{ textAlign: 'start' }}></Grid>}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <>
          <Grid container spacing={gridSpacing} sx={{ padding: 5 }}>
            <Grid item xs={12} md={6}>
              <DesktopDatePicker
                label="Date de début"
                inputFormat="dd/MM/yyyy"
                value={moment(searchFilter?.date_debut).format('YYYY-MM-DD')}
                onChange={(v) => {
                  try {
                    const date = moment(v).format('YYYY/MM/DD');
                    console.log(date);
                    setSearchFilter((f) => {
                      return { ...f, date_debut: date };
                    });
                  } catch (error) {}
                }}
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    required
                    variant="standard"
                    {...params}
                    //   error={!!formErrors?.data?.date_debut}
                    //   helperText={renderArrayMultiline(formErrors?.data?.date_debut)}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <DesktopDatePicker
                label="Fin du journée"
                inputFormat="dd/MM/yyyy"
                value={moment(searchFilter?.date_fin).format('YYYY-MM-DD')}
                onChange={(v) => {
                  try {
                    const date = moment(v).format('YYYY/MM/DD');
                    setSearchFilter((f) => {
                      return { ...f, date_fin: date };
                    });
                  } catch (error) {}
                }}
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    required
                    variant="standard"
                    {...params}
                    //   error={!!formErrors?.data?.date_debut}
                    //   helperText={renderArrayMultiline(formErrors?.data?.date_debut)}
                  />
                )}
              />
            </Grid>
          </Grid>
        </>
      </LocalizationProvider>
      <TimeLineCol searchFilter={searchFilter} setSearchFilter={setSearchFilter} pointages={pointages} />
    </MainCard>
  );
}
