import EditIcon from '@mui/icons-material/Edit';

import { Grid, IconButton } from '@mui/material';

// project imports
import { useGetSocieteSettings } from 'services/settings.service';
import { gridSpacing } from 'store/constant';
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
              navigate(`/settings/societe/${societeData?.id}/update`);
            }}
          >
            <EditIcon sx={{ fontSize: '1.3rem' }} />
          </IconButton>
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
