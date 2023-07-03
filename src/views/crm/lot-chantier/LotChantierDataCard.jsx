import { Grid, Stack, Typography, linearProgressClasses, LinearProgress, Button, IconButton } from '@mui/material';
import { useTheme, withStyles } from '@mui/styles';
import React from 'react';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

const BorderLinearProgress = withStyles(() => ({
  root: {
    height: 10,
    borderRadius: 5
  },
  bar: {
    borderRadius: 5
  }
}))(LinearProgress);

export default function LotChantierDataCard({ data, sx = {}, user }) {
  const theme = useTheme();
  const navigate = useNavigate();


  return (
    <MainCard
      title="Interventions "
      sx={{ ...sx }}
      secondary={
        user?.role.includes('admin') &&
        data?.validated === -1 && (
          <IconButton
            color="secondary"
            size="large"
            onClick={(e) => {
              // handleOpenEditDialog(e);
              navigate(`/lot-chantier/${data?.id}/change-percentage`);
            }}
          >
            <EditIcon sx={{ fontSize: '1.3rem' }} />
          </IconButton>
        )
      }
    >
      <Stack spacing={2}>
        {/* <Typography variant="h4">Lot Contrat</Typography> */}
        <Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="subtitle1">Référence :</Typography>
            <Typography variant="body2">{data?.reference}</Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        spacing={2}
        style={{
          marginTop: 10
        }}
      >
        <Typography variant="h5">Interventions Proposer</Typography>
        <Stack
          style={{
            marginTop: 0
          }}
        >
          <Stack direction="row" spacing={1}>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item xs>
                <BorderLinearProgress variant="determinate" color="primary" value={data?.percentage * 100} />
              </Grid>
              <Grid item>
                <Typography variant="h6">{Math.round(data?.percentage * 100)}%</Typography>
              </Grid>
            </Grid>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        spacing={2}
        style={{
          marginTop: 10
        }}
      >
        <Typography variant="h5">Interventions Planifié</Typography>
        <Stack
          style={{
            marginTop: 0
          }}
        >
          <Stack direction="row" spacing={1}>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item xs>
                <BorderLinearProgress variant="determinate" color="warning" value={data?.inspections_progress} />
              </Grid>
              <Grid item>
                <Typography variant="h6">{Math.round(data?.inspections_progress)}%</Typography>
              </Grid>
            </Grid>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        spacing={2}
        style={{
          marginTop: 10
        }}
      >
        <Typography variant="h5">Interventions Effectué</Typography>
        <Stack
          style={{
            marginTop: 0
          }}
        >
          <Stack direction="row" spacing={1}>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item xs>
                <BorderLinearProgress
                  variant="determinate"
                  color="primary"
                  value={data?.completed_inspections_progress}
                  sx={{
                    backgroundColor: '#bbf7d0',
                    [`& .${linearProgressClasses.bar}`]: {
                      borderRadius: 5,
                      backgroundColor: theme.palette.mode === 'light' ? '#4ade80' : '#4ade80'
                    }
                  }}
                />
              </Grid>
              <Grid item>
                <Typography variant="h6">{Math.round(data?.completed_inspections_progress)}%</Typography>
              </Grid>
            </Grid>
          </Stack>
          <div
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
              marginTop: '2rem'
            }}
          >
            <a
              style={{
                textDecoration: 'none',
                color: 'inherit'
              }}
              href={data?.excel_download_link}
              target="_blank"
              rel="noreferrer"
            >
              <Button size="small" variant="outlined" startIcon={<DownloadIcon />}>
                Exporter Excel
              </Button>
            </a>
          </div>
        </Stack>
      </Stack>
    </MainCard>
  );
}
