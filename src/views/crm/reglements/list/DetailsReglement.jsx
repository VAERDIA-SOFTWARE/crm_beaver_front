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
        <Grid item xs={12} sm={6} md={4}>
          <Stack spacing={2}>
            <Typography variant="h4">Informations reglement</Typography>
            <Stack spacing={0}>
              {reglementsData?.reference && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Référence :</Typography>
                  <Typography variant="body2">{reglementsData?.reference}</Typography>
                </Stack>
              )}
              {reglementsData?.montant && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Montant :</Typography>
                  <Typography variant="body2">{reglementsData?.montant}</Typography>
                </Stack>
              )}
              {reglementsData?.reference_cheque && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Réfrence du chéque :</Typography>
                  <Typography variant="body2">{reglementsData?.reference_cheque}</Typography>
                </Stack>
              )}
              {reglementsData?.reference_traite && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Réference traité :</Typography>
                  <Typography variant="body2">{reglementsData?.reference_traite}</Typography>
                </Stack>
              )}
              {reglementStatus && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Mode de réglement:</Typography>
                  <Typography variant="body2">{reglementStatus}</Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Stack spacing={2}>
            <Typography variant="h4">Informations sur les factures</Typography>
            <Stack spacing={0}>
              {reglementsData?.factures && (
                <>
                  {reglementsData?.factures.map((facture, index) => (
                    <Stack direction="row" spacing={1} key={facture.id}>
                      <Typography variant="subtitle1">facture {index + 1}:</Typography>
                      <Typography variant="body2">{facture.reference}</Typography>
                    </Stack>
                  ))}
                </>
              )}
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
};
