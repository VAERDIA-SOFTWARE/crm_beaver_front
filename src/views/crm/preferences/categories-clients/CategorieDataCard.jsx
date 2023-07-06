import { Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import MainCard from 'ui-component/cards/MainCard';

export default function CategorieDataCard({ data }) {
  return (
    <MainCard
      sx={{
        minHeight: '100%'
      }}
      title="Informations générales"
    >
      <Stack spacing={2}>
        {/* <Typography variant="h4">Informations du contrat</Typography> */}
        <Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="subtitle1">Intitulé :</Typography>
            <Typography variant="body2">{data?.intitule}</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="subtitle1">Date de création :</Typography>
            <Typography variant="body2">{data?.created_at && format(new Date(data?.created_at), 'dd/LL/yyyy hh:mm:ss')}</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="subtitle1">Date de modification :</Typography>
            <Typography variant="body2">{data?.updated_at && format(new Date(data?.updated_at), 'dd/LL/yyyy hh:mm:ss')}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </MainCard>
  );
}
