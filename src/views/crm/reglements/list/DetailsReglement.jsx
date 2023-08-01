import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';

// material-ui
import { Grid, IconButton, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

// project imports
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteUser, useGetUser } from 'services/users.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import { useGetReglement, useGetReglementsMode } from 'services/reglements.service';
import { Stack } from '@mui/system';

const ReglementsDetailsPage = () => {
  const { reglementId } = useParams();
  const getClientsQuery = useGetReglement(reglementId);
  const reglementsData = getClientsQuery?.data;
  const useGetModeReglementQuery = useGetReglementsMode();

  const reglementMode = useGetModeReglementQuery?.data;
  const [reglementStatus, setReglementStatus] = useState(null);
  useEffect(() => {
    if (useGetModeReglementQuery.isSuccess && getClientsQuery.isSuccess) {
      useGetModeReglementQuery.data.filter((element) => {
        if (reglementsData.p_mode_de_reglement_id === element.id) {
          setReglementStatus(element.intitule);
        }
      });
    }
  }, [reglementStatus, useGetModeReglementQuery.isSuccess, getClientsQuery, reglementsData]);

  const deleteMutation = useDeleteUser(reglementId);

  const [toggleAuth, setToggleAuth] = useState(false);

  const navigate = useNavigate();
  return (
    <MainCard
      title={`Reglement ${reglementsData?.reference ? '- ' + reglementsData?.reference : ''}`}
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
              navigate(`/reglement/${reglementId}/update`);
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
        <Grid item xs={12} md={12} sm={12}>
          <ReglementsDataCard reglementsData={reglementsData} reglementStatus={reglementStatus} />
        </Grid>
      </Grid>
    </MainCard>
  );
};

ReglementsDetailsPage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default ReglementsDetailsPage;

const ReglementsDataCard = ({ reglementsData, reglementStatus }) => {
  return (
    <MainCard title={reglementsData?.libelle}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} sm={12} md={12}>
          {/* <Stack spacing={1}> */}
          <Typography variant="h4">Informations générales</Typography>
          {/* <Stack spacing={0}> */}
          {reglementsData?.libelle && (
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle1">Libelle :</Typography>
              <Typography variant="body2">{reglementsData?.libelle}</Typography>
            </Stack>
          )}
          {reglementsData?.reference && (
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle1">Reference :</Typography>
              <Typography variant="body2">{reglementsData?.reference}</Typography>
            </Stack>
          )}
          {reglementsData?.reference_cheque && (
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle1">Reference cheque :</Typography>
              <Typography variant="body2">{reglementsData?.reference_cheque}</Typography>
            </Stack>
          )}
          {reglementsData?.reference_traite && (
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle1">Reference traité :</Typography>
              <Typography variant="body2">{reglementsData?.reference_traite}</Typography>
            </Stack>
          )}
          {reglementsData?.montant && (
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle1">Montant :</Typography>
              <Typography variant="body2">{reglementsData?.montant}</Typography>
            </Stack>
          )}
          {reglementsData?.date && (
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle1">Date :</Typography>
              <Typography variant="body2">{reglementsData?.date}</Typography>
            </Stack>
          )}
          {reglementsData?.date_echeance && (
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle1">Date d'echeance :</Typography>
              <Typography variant="body2">{reglementsData?.date_echeance}</Typography>
            </Stack>
          )}
          {reglementStatus && (
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle1">Date d'echeance :</Typography>
              <Typography variant="body2">{reglementStatus}</Typography>
            </Stack>
          )}

          {/* {reglementsData?.facture && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Date d'echeance :</Typography>
                  <Typography variant="body2">{reglementsData?.facture}</Typography>
                </Stack>
              )} */}
          {/* </Stack> */}
          {/* </Stack> */}
        </Grid>
      </Grid>
    </MainCard>
  );
};
