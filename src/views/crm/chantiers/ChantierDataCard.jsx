import { Grid, IconButton, Stack, Typography } from '@mui/material';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { useNavigate } from 'react-router-dom';

export default function ChantierDataCard({ data, showButton = false }) {
  const navigate = useNavigate();

  return (
    <MainCard
      title="Informations du contrat"
      secondary={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5
          }}
        >
          {showButton && (
            <IconButton
              color="secondary"
              size="large"
              onClick={(e) => {
                navigate(`/chantiers/${data?.id}/details`);
              }}
            >
              <VisibilityRoundedIcon sx={{ fontSize: '1.3rem' }} />
            </IconButton>
          )}
        </div>
      }
    >
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} sm={6} md={4}>
          <Stack spacing={2}>
            <Typography variant="h4">Contrat</Typography>
            <Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Référence :</Typography>
                <Typography variant="body2">{data?.reference}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Date commande :</Typography>
                <Typography variant="body2">{data?.date_commande}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Donneur d'ordre :</Typography>
                <Typography variant="body2">{data?.donneur_ordre}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">SERIL :</Typography>
                <Typography variant="body2">{data?.num_serie}</Typography>
              </Stack>
              {/* <Stack direction="row" spacing={1}>
                      <Typography variant="subtitle1">operation_controller :</Typography>
                      <Typography variant="body2">{chantierData?.operation_controller}</Typography>
                    </Stack> */}
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Date Devis :</Typography>
                <Typography variant="body2">{data?.date_devis}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Date Facture :</Typography>
                <Typography variant="body2">{data?.date_facture}</Typography>
              </Stack>
              {/* <Stack direction="row" spacing={1}>
                      <Typography variant="subtitle1">materiaux :</Typography>
                      <Typography variant="body2">{chantierData?.materiaux}</Typography>
                    </Stack> */}
              {/* <Stack direction="row" spacing={1}>
                      <Typography variant="subtitle1">commentaires :</Typography>
                      <Typography variant="body2">{chantierData?.commentaires}</Typography>
                    </Stack> */}
            </Stack>
          </Stack>
        </Grid>
        {data?.localisation?.location ? (
          <Grid item xs={12} sm={6} md={4}>
            <Stack spacing={2}>
              <Typography variant="h4">Localisation</Typography>
              <Stack spacing={0}>
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Pays :</Typography>
                  <Typography variant="body2">{data?.localisation?.location?.country}</Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Ville :</Typography>
                  <Typography variant="body2">{data?.localisation?.location?.locality}</Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Code postal :</Typography>
                  <Typography variant="body2">{data?.localisation?.location?.postalCode}</Typography>
                </Stack>
                {/* <Stack direction="row" spacing={1}>
            <Typography variant="subtitle1">location :</Typography>
            <Typography variant="body2">{chantierData?.localisation?.location}</Typography>
          </Stack> */}
                {/* <Stack direction="row" spacing={1}>
            <Typography variant="subtitle1">location pervu :</Typography>
            <Typography variant="body2">{chantierData?.localisation?.location_prevu}</Typography>
          </Stack> */}
              </Stack>
            </Stack>
          </Grid>
        ) : (
          <Grid item xs={12} sm={6} md={4}>
            <Stack spacing={2}>
              <Typography variant="h4">Localisation</Typography>
              <Stack spacing={0}>
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Addresse :</Typography>
                  <Typography variant="body2">{data?.localisation?.adresse}</Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Code Postal :</Typography>
                  <Typography variant="body2">{data?.localisation?.code_postal}</Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography variant="subtitle1">Ville :</Typography>
                  <Typography variant="body2">{data?.localisation?.ville}</Typography>
                </Stack>
                {/* <Stack direction="row" spacing={1}>
                      <Typography variant="subtitle1">location :</Typography>
                      <Typography variant="body2">{chantierData?.localisation?.location}</Typography>
                    </Stack> */}
                {/* <Stack direction="row" spacing={1}>
                      <Typography variant="subtitle1">location pervu :</Typography>
                      <Typography variant="body2">{chantierData?.localisation?.location_prevu}</Typography>
                    </Stack> */}
              </Stack>
            </Stack>
          </Grid>
        )}

        <Grid item xs={12} sm={6} md={4}>
          <Stack spacing={2}>
            <Typography variant="h4">Bénéficiaire</Typography>
            <Stack spacing={0}>
              {/* <Typography variant="h6" sx={{ mb: 1 }}>
                      Credit Card
                    </Typography> */}
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Intitulé :</Typography>
                <Typography variant="body2">
                  {data?.benificiaire?.nom_benificiaire + ' ' + data?.benificiaire?.prenom_benificiaire}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Personne Morale :</Typography>
                <Typography variant="body2">{data?.benificiaire?.personalite_juridique}</Typography>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Telephone 1 :</Typography>
                <Typography variant="body2">{data?.benificiaire?.contact?.telephone_1}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Telephone 2 :</Typography>
                <Typography variant="body2">{data?.benificiaire?.contact?.telephone_2}</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Stack spacing={2}>
            <Typography variant="h4">Collaborateur</Typography>
            <Stack spacing={0}>
              {/* <Typography variant="h6" sx={{ mb: 1 }}>
                      Credit Card
                    </Typography> */}
              <Stack direction="row" spacing={1}>
                {data?.inspections && (
                  <>
                    <Typography variant="subtitle1">Intitulé :</Typography>
                    <Typography variant="body2">{data?.inspections[0]?.technicien?.name || 'N/A'}</Typography>
                  </>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Stack spacing={2}>
            <Typography variant="h4">Opération</Typography>
            <Stack spacing={0}>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Nom d'opération :</Typography>
                <Typography variant="body2">{data?.operation?.nom}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle1">Operation du controlleur :</Typography>
                <Typography variant="body2">{data?.operation?.operation_controller}</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Stack spacing={2}>
            <Typography variant="h4">Matériaux</Typography>
            <Stack spacing={0}>
              <ul
                style={{
                  padding: 0,
                  margin: 0
                }}
              >
                {data?.operation?.materiaux?.map((e) => (
                  <li>
                    <Stack direction="row" spacing={1}>
                      {/* <Typography variant="subtitle1">{e} :</Typography> */}
                      <Typography variant="body2">{e}</Typography>
                    </Stack>
                  </li>
                ))}
              </ul>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
}
