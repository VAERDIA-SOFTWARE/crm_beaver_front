import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';

// material-ui
import { Button, Grid, IconButton } from '@mui/material';
import { useState, useEffect } from 'react';

// project imports
import { useNavigate, useParams } from 'react-router-dom';
import { useChangeLeadToClient, useDeleteUser, useGetUser } from 'services/users.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';

import LeadsDataCard from './LeadsDataCard';
import { DeleteOutline } from '@mui/icons-material';

const LeadsDetailsPage = () => {
  const { leadsId } = useParams();

  const getLeadsQuery = useGetUser(leadsId);
  const clientData = getLeadsQuery?.data?.user;
  const leadToClientMutation = useChangeLeadToClient(leadsId);
  const deleteMutation = useDeleteUser(leadsId);
  const LotId = localStorage.getItem('LotId');

  console.log('====================================');
  console.log(LotId);
  console.log('====================================');

  const [toggleAuth, setToggleAuth] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setToggleAuth(clientData?.auth);
  }, [clientData, getLeadsQuery.isSuccess]);
  return (
    <MainCard
      title={`Leads ${clientData?.reference ? '- ' + clientData?.reference : ''}`}
      backButton
      goBackLink="/lot-leads/list"
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
              navigate(`/leads/${leadsId}/update`);
            }}
          >
            <EditIcon sx={{ fontSize: '1.3rem' }} />
          </IconButton>
          <IconButton
            color="secondary"
            size="large"
            onClick={async (e) => {
              await deleteMutation.mutateAsync();
              navigate(`/lot-leads/${LotId}/details`);
            }}
          >
            <DeleteOutline sx={{ fontSize: '1.3rem' }} />
          </IconButton>
          <Button
            sx={{ marginX: '1rem' }}
            variant="contained"
            onClick={async (e) => {
              await leadToClientMutation.mutateAsync();
              navigate(`/lot-leads/${LotId}/details`);
            }}
          >
            Convertir en client
          </Button>
        </div>
      }
    >
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <LeadsDataCard clientData={clientData} />
        </Grid>
      </Grid>
    </MainCard>
  );
};

LeadsDetailsPage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default LeadsDetailsPage;