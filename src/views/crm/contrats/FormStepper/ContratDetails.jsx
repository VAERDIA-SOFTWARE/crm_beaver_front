import PropTypes from 'prop-types';

// material-ui
import { Box, Stack } from '@mui/system';

// project imports

// third-party
import MainCard from 'ui-component/cards/MainCard';
import { Button, Grid } from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { useGetContrat, useValidateContrats } from 'services/contrats.service';
import { useNavigate } from 'react-router-dom';

const ContratSquelette = ({ handleNext, handleBack, contractForm }) => {
  // const getContract = useGetContrat(contractForm?.id);
  const pdfLink = contractForm?.pdf_download_link;
  const validateContract = useValidateContrats(contractForm?.id);
  const navigate = useNavigate();
  return (
    <Box>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between">
          <Button onClick={handleBack} sx={{ my: 3, ml: 1 }}>
            Back
          </Button>
          <AnimateButton>
            <Button
              variant="contained"
              type="submit"
              sx={{ my: 3, ml: 1 }}
              onClick={async () => {
                await validateContract.mutateAsync();
                navigate('/contrats/list');
              }}
            >
              Validée Contrat
            </Button>
          </AnimateButton>
        </Stack>
      </Grid>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <iframe title="test" src={pdfLink} width="80%" height="900px"></iframe>
      </div>
    </Box>
  );
};

ContratSquelette.propTypes = {
  shippingData: PropTypes.object,
  setShippingData: PropTypes.func,
  handleNext: PropTypes.func,
  setErrorIndex: PropTypes.func
};

export default ContratSquelette;
