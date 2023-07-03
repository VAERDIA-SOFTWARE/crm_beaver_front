import DownloadIcon from '@mui/icons-material/Download';
import { Button, Stack, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';

export default function ContractDataCard({ contratData }) {
  return (
    <MainCard
      sx={{
        minHeight: '100%'
      }}
      title="Informations du contrat"
    >
      <Stack spacing={2}>
        {/* <Typography variant="h4">Informations du contrat</Typography> */}
        <Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="subtitle1">Référence :</Typography>
            <Typography variant="body2">{contratData?.reference}</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="subtitle1">Titre :</Typography>
            <Typography variant="body2">{contratData?.titre}</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="subtitle1">Description :</Typography>
            <Typography variant="body2">{contratData?.description}</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="subtitle1">Date de début :</Typography>
            <Typography variant="body2">{contratData?.date_debut}</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="subtitle1">Date de fin :</Typography>
            <Typography variant="body2">{contratData?.date_fin}</Typography>
          </Stack>
          {/* <Stack direction="row" spacing={1}>
            <Typography variant="subtitle1">Taux d'échantillonnage :</Typography>
            <Typography variant="body2">{contratData?.percentage} %</Typography>
          </Stack> */}
          <Stack
            direction="row"
            spacing={1}
            style={{
              marginTop: 10
            }}
          >
            {/* <Typography variant="subtitle1">Télécharger comme PDF :</Typography> */}
            <a
              style={{
                textDecoration: 'none',
                color: 'inherit'
              }}
              href={contratData?.pdf_download_link}
              target="_blank"
              rel="noreferrer"
            >
              <Button size="small" variant="outlined" startIcon={<DownloadIcon />}>
                Télécharger comme PDF
              </Button>
            </a>
          </Stack>
        </Stack>
      </Stack>
    </MainCard>
  );
}
