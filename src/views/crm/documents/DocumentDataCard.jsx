import DownloadIcon from '@mui/icons-material/Download';
import { Button, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';

export default function DocumentDataCard({ documentData }) {
  return (
    <MainCard
      sx={{
        minHeight: '100%'
      }}
      title="Informations du document"
    >
      <Stack spacing={2}>
        {/* <Typography variant="h4">Informations du contrat</Typography> */}
        <Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="subtitle1">Intitulé :</Typography>
            <Typography variant="body2">{documentData?.intitule}</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="subtitle1">Description :</Typography>
            <Typography variant="body2">{documentData?.description}</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="subtitle1">Catégorie :</Typography>
            <Typography variant="body2">{documentData?.category?.intitule}</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="subtitle1">Version :</Typography>
            <Typography variant="body2">{documentData?.versions?.slice(-1)[0]?.intitule}</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="subtitle1">Date de création :</Typography>
            <Typography variant="body2">
              {documentData?.created_at && format(new Date(documentData?.created_at), 'dd/LL/yyyy hh:mm:ss')}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="subtitle1">Date de modification :</Typography>
            <Typography variant="body2">
              {documentData?.updated_at && format(new Date(documentData?.updated_at), 'dd/LL/yyyy hh:mm:ss')}
            </Typography>
          </Stack>
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
              href={`${process.env.REACT_APP_API_URL}documents/${documentData?.id}/download-pdf`}
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
