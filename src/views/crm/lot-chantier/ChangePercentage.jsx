import * as React from 'react';

// material-ui
import { Grid, Input, Switch, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets

import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import Slider from '@mui/material/Slider';
import { useParams } from 'react-router-dom';
import { useChangePercentage, useGetLotChantier } from 'services/lot-chantiers.service';

const ChangePercentage = () => {
  const { lotChantierId } = useParams();
  const getLotChantierQuery = useGetLotChantier(lotChantierId);
  const [formErrors, setFormErrors] = React.useState({});
  const [generateInspection, setGenerateInspection] = React.useState({});

  const changePercentageMutation = useChangePercentage(lotChantierId);
  const [formInput, setFormInput] = React.useState({
    // generate_inspections: 1,
    percentage: 0
  });
  const handleChange = (e) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    try {
      await changePercentageMutation.mutateAsync({ ...formInput, generate_inspections: generateInspection });
    } catch (error) {
      const errorsObject = error?.response?.data;
      setFormErrors(errorsObject);
    }
  };
  const handleToggle = (event) => {
    setGenerateInspection(event.target.checked);
  };
  React.useEffect(() => {
    if (getLotChantierQuery.isSuccess) {
      setFormInput((f) => {
        return {
          ...f,
          percentage: getLotChantierQuery?.data.percentage * 100
        };
      });
      setGenerateInspection(getLotChantierQuery?.data.generate_inspections);
    }
  }, [getLotChantierQuery?.data, getLotChantierQuery.isSuccess]);

  return (
    <MainCard
      title="Pourcentage d'échantionnage"
      content={false}
      backButton
      goBackLink={`/lot-chantier/${lotChantierId}/details`}
      secondary={
        <Switch checked={generateInspection} onChange={(event) => handleToggle(event)} inputProps={{ 'aria-label': 'controlled' }} />
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
        <>
          <Grid item xs={12}>
            <Typography gutterBottom>Pourcentage</Typography>
            <div
              style={{
                display: 'flex',
                gap: 16,
                alignItems: 'center'
              }}
            >
              <Slider
                disabled={!generateInspection}
                valueLabelDisplay="auto"
                defaultValue={getLotChantierQuery?.data?.percentage * 100}
                value={formInput?.percentage}
                name="percentage"
                onChange={handleChange}
              />
              <Input
                disabled={!generateInspection}
                onChange={handleChange}
                // defaultValue={formInput?.percentage}
                value={formInput?.percentage}
                size="small"
                inputProps={{
                  min: 0,
                  max: 100,
                  type: 'number',
                  'aria-labelledby': 'input-slider'
                }}
              />
            </div>
          </Grid>

          <Grid item xs={12} md={6}></Grid>
          <Grid item xs={12} md={6}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <LoadingButton
                loadingPosition="start"
                startIcon={<SaveIcon />}
                loading={!formInput || changePercentageMutation.isLoading}
                // disabled={isEqual(formInput, { email: user?.email, password: user?.password })}
                color={'secondary'}
                variant="contained"
                onClick={handleSubmit}
              >
                {'Sauvegarder'}
              </LoadingButton>
            </div>
          </Grid>
        </>
      </Grid>
    </MainCard>
  );
};

export default ChangePercentage;
