import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';

// material-ui
import { Button, Grid, IconButton } from '@mui/material';
import { useState, useEffect } from 'react';

// project imports
import { useNavigate, useParams } from 'react-router-dom';
import { useChangeLeadToClient, useDeleteUser, useGetUser, useLeadsToClients } from 'services/users.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';

import LeadsDataCard from './LeadsDataCard';
import { DeleteOutline } from '@mui/icons-material';
import SendIcon from '@mui/icons-material/Send';
import { LoadingButton } from '@mui/lab';

const LeadsDetailsPage = () => {
  const { leadsId } = useParams();
  const getLeadsQuery = useGetUser(leadsId);
  const clientData = getLeadsQuery?.data?.user;
  const leadsToClientMutation = useLeadsToClients();
  const deleteMutation = useDeleteUser(leadsId);

  const [toggleAuth, setToggleAuth] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setToggleAuth(clientData?.auth);
  }, [clientData, getLeadsQuery.isSuccess]);
  return (
    <MainCard
      headerColor={true}
      title={`Lead ${clientData?.reference && '- ' + clientData?.reference}`}
      backButton
      goBackLink={-1}
      secondary={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5
          }}
        >
          <IconButton
            color="text"
            size="large"
            onClick={(e) => {
              // handleOpenEditDialog(e);
              navigate(`/leads/${leadsId}/update`);
            }}
          >
            <EditIcon sx={{ fontSize: '1.3rem' }} />
          </IconButton>
          {/* <IconButton
            color="secondary"
            size="large"
            onClick={async (e) => {
              await deleteMutation.mutateAsync();
              navigate(`/leads/list`);
            }}
          >
            <DeleteOutline sx={{ fontSize: '1.3rem' }} />
          </IconButton> */}
          <LoadingButton
            color="success"
            sx={{ marginX: '1rem' }}
            variant="contained"
            endIcon={<SendIcon />}
            loading={leadsToClientMutation?.isLoading}
            onClick={async () => {
              await leadsToClientMutation.mutateAsync({ team_leads: [leadsId] });
              navigate(`/leads/list`);
            }}
          >
            Convertir en client
          </LoadingButton>
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
