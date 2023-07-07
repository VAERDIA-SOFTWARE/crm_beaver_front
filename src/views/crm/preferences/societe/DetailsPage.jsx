import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';

// material-ui
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Box, Grid, IconButton, Typography } from '@mui/material';

// project imports
import { useGetSocieteSettings } from 'services/settings.service';
import { gridSpacing } from 'store/constant';
import HoverDataCard from 'ui-component/cards/HoverDataCard';
import MainCard from 'ui-component/cards/MainCard';
import { SocieteDataCard } from './SocieteDataCard';
import { useNavigate } from 'react-router-dom';

const SocieteDetailsPage = () => {
  const getSocieteSettingsQuery = useGetSocieteSettings();
  const societeData = getSocieteSettingsQuery.data;

  const navigate = useNavigate();

  return (
    <MainCard
      title={`Société ${societeData?.intitule ? '- ' + societeData?.intitule : ''}`}
      secondary={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5
          }}
        >
          <IconButton
            color="secondary"
            size="large"
            onClick={(e) => {
              // handleOpenEditDialog(e);
              navigate(`/settings/societe/${societeData?.id}/update`);
            }}
          >
            <EditIcon sx={{ fontSize: '1.3rem' }} />
          </IconButton>
          {/* <Typography variant="subtitle1">Created at {clientData?.created_at}</Typography> */}
        </div>
      }
    >
      <Grid container spacing={gridSpacing} rowSpacing={5}>
        <Grid item xs={12}>
          <SocieteDataCard data={societeData} />
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default SocieteDetailsPage;
