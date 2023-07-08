import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { Box, Grid, IconButton, Stack, Tab, Tabs, Typography } from '@mui/material';

// project imports
import { useNavigate, useParams } from 'react-router-dom';

import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import UserDataCard from './userDataCard';

import { useGetUser } from 'services/users.service';
import AccessDataCard from './AccessDataCard';
import AuthToggleCard from './AuthToggleCard';

const UserDetailsPage = () => {
  const { userId } = useParams();

  const getUserQuery = useGetUser(userId);
  const userData = getUserQuery.data;
  const [toggleAuth, setToggleAuth] = useState(false);
  const navigate = useNavigate();

  const [value, setValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    setToggleAuth(userData?.authentication);
  }, [userData]);

  return (
    <MainCard
      title={`User ${userData?.reference ? '- ' + userData?.reference : ''}`}
      circle={userData?.color}
      backButton
      goBackLink="/users/list"
      secondary={
        <IconButton
          color="secondary"
          size="large"
          onClick={(e) => {
            navigate(`/users/${userId}/update`);
          }}
        >
          <EditIcon sx={{ fontSize: '1.3rem' }} />
        </IconButton>
      }
    >
      <div>
        <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
          <Grid item xs={12}>
            <UserDataCard userData={userData} title="Informations du contact" />
          </Grid>
        </Grid>
        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            marginTop: 40
          }}
        >
          <Typography variant="h5">Créé le {userData?.created_at}</Typography>
        </div>
      </div>
    </MainCard>
  );
};

UserDetailsPage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default UserDetailsPage;
