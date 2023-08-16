import { Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import SubCard from 'ui-component/cards/SubCard';
import Switch from '@mui/material/Switch';
import { useSyncUserPermissions } from 'services/users.service';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import { cloneDeep, isEqual } from 'lodash';
import MainCard from 'ui-component/cards/MainCard';

export default function AccessDataCard({ userPermissionsData = [], title, userId }) {
  const [localPermissions, setLocalPermissions] = React.useState([]);

  const syncUserPermissionsMutation = useSyncUserPermissions();

  React.useEffect(() => {
    setLocalPermissions(cloneDeep(userPermissionsData));
  }, [userPermissionsData]);

  const handleChange = (event, key, child = false) => {
    let newPermissions = cloneDeep(localPermissions);
    if (child !== false) {
      newPermissions[key].permissions[child].authorized = event.target.checked;
    } else {
      newPermissions[key].authorized = event.target.checked;
      newPermissions[key].permissions.map((item) => (item.authorized = event.target.checked));
    }
    setLocalPermissions(newPermissions);
  };

  return (
    <MainCard
      title={title ?? 'Liste des accès'}
      content={false}
      secondary={
        <LoadingButton
          loadingPosition="start"
          startIcon={<SaveIcon />}
          loading={!localPermissions || syncUserPermissionsMutation.isLoading}
          disabled={isEqual(localPermissions, userPermissionsData)}
          color={'secondary'}
          variant="contained"
          onClick={async () => {
            await syncUserPermissionsMutation.mutateAsync({
              id: userId,
              values: { resources: localPermissions }
            });
          }}
        >
          {'Sauvegarder'}
        </LoadingButton>
      }
    >
      <Grid
        container
        spacing={10}
        rowSpacing={5}
        sx={{
          padding: 2
        }}
      >
        {localPermissions &&
          localPermissions.map((item, key) => (
            <Grid item xs={12} sm={6} md={4} key={item?.resource_id}>
              <MainCard
                title={item?.resource_name}
                secondary={<Switch checked={item?.authorized} onChange={(event) => handleChange(event, key)} />}
              >
                <Stack spacing={2}>
                  <Stack spacing={1}>
                    {item?.permissions.map((item, child) => (
                      <Stack
                        spacing={0}
                        // sx={{
                        //   paddingLeft: 1,
                        //   paddingRight: 1
                        // }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1">{item?.name} </Typography>
                          <Switch
                            checked={item?.authorized}
                            onChange={(event) => handleChange(event, key, child)}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                        </div>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </MainCard>
            </Grid>
          ))}
      </Grid>
    </MainCard>
  );
}
