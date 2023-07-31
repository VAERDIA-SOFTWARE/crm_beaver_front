import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';

// material-ui
import { Button, Grid, IconButton } from '@mui/material';
import { useState, useEffect } from 'react';

// project imports
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteUser, useGetUser } from 'services/users.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';

import ClientsDataCard from './ClientDataCard';
import { DeleteOutline } from '@mui/icons-material';

const ClientsDetailsPage = () => {
  const { clientId } = useParams();

  const getClientsQuery = useGetUser(clientId);
  const clientData = getClientsQuery?.data?.user;
  const deleteMutation = useDeleteUser(clientId);

  const [toggleAuth, setToggleAuth] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setToggleAuth(clientData?.auth);
  }, [clientData, getClientsQuery.isSuccess]);
  return (
    <MainCard
      title={`Client ${clientData?.reference ? '- ' + clientData?.reference : ''}`}
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
            color="secondary"
            size="large"
            onClick={(e) => {
              // handleOpenEditDialog(e);
              navigate(`/clients/${clientId}/update`);
            }}
          >
            <EditIcon sx={{ fontSize: '1.3rem' }} />
          </IconButton>
          {/* <IconButton
            color="secondary"
            size="large"
            onClick={async (e) => {
              await deleteMutation.mutateAsync();
              navigate(`/clients/list`);
            }}
          >
            <DeleteOutline sx={{ fontSize: '1.3rem' }} />
          </IconButton> */}
        </div>
      }
    >
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <ClientsDataCard clientData={clientData} />
        </Grid>
      </Grid>
    </MainCard>
  );
};

ClientsDetailsPage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default ClientsDetailsPage;
