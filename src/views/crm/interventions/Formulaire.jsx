import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import SendIcon from '@mui/icons-material/Send';
import { Autocomplete, Grid, Skeleton, TextField } from '@mui/material';

// project imports
import { LoadingButton } from '@mui/lab';
import { DateTimePicker, frFR, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetInspection,
  useGetInspectionFormulaire,
  useGetInspectionsTechniciens,
  useUpdateInspection
} from 'services/inspections.service';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import renderArrayMultiline from 'utilities/utilities';
import FormulaireCard from './FormulaireCard';
import FormulaireCardUpdate from './FormulaireCardUpdate';

const Formulaire = () => {
  const { interventionId } = useParams();
  const getInspectionQuery = useGetInspection(interventionId);
  const inspectionData = getInspectionQuery?.data;
  const getInspectionFormulaireQuery = useGetInspectionFormulaire({ inspectionId: interventionId });
  const inspectionFormulaireData = getInspectionFormulaireQuery.data;

  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState({
    debut: null,
    fin: null,
    user_id: null
  });

  useEffect(() => {
    if (getInspectionQuery.isSuccess) {
      // if (inspectionData?.etat !== 0 && inspectionData?.etat !== 1) {
      //   navigate(`/interventions/list`);
      //   return;
      // }
      setFormInput((f) => {
        return {
          ...f,
          debut: inspectionData?.debut,
          fin: inspectionData?.fin,
          user_id: inspectionData?.technicien?.id
        };
      });
    }
  }, [getInspectionQuery.isSuccess, inspectionData?.etat, inspectionData?.debut, inspectionData?.fin, inspectionData?.technicien?.id]);

  return (
    <MainCard
      title={`Interventions ${inspectionData?.reference ? '- ' + inspectionData?.reference : ''}`}
      backButton
      goBackLink={`/interventions/${interventionId}/details`}
    >
      <div>
        <Grid xs={12}>
          <FormulaireCardUpdate
            title="Formulaire"
            interventionData={inspectionData}
            data={inspectionFormulaireData}
            inspectionId={interventionId}
          />
        </Grid>
        {/* <Divider
          style={{
            margin: 20
          }}
        /> */}
        {/* <div
          style={{
            display: 'flex',
            gap: 10,
              justifyContent: 'start'
          }}
        >
          <LoadingButton
            loading={toggleClientStatusMutation.isLoading}
            variant="outlined"
            onClick={() =>
              confirm({
                description: `Êtes-vous sûr de vouloir ${inspectionData?.active_status ? 'désactiver' : 'activer'} ${
                  inspectionData?.name
                }.`,
                title: `Veuillez confirmer ${inspectionData?.active_status ? 'la désactivation' : "l'activation"}`
              })
                .then(() => toggleClientStatusMutation.mutate())
                .catch(() => console.log('Deactivation cancelled.'))
            }
          >
            {inspectionData?.active_status ? 'Désactiver' : 'Activer'}
          </LoadingButton>

          <LoadingButton
            loadingPosition="start"
            startIcon={<DeleteIcon />}
            loading={deleteUserMutation.isLoading}
            variant="outlined"
            color="error"
            onClick={() =>
              confirm({
                description: `Êtes-vous sûr de vouloir supprimer ${inspectionData?.name}.`,
                title: `Veuillez confirmer la suppression`
              })
                .then(async () => {
                  try {
                    await deleteUserMutation.mutateAsync();
                    navigate('/clients/list', {
                      replace: true
                    });
                  } catch (error) {}
                })
                .catch(() => console.log('Utilisateur supprimé avec succès.'))
            }
          >
            {'Supprimer'}
          </LoadingButton>
        </div> */}
      </div>
    </MainCard>
  );
};

Formulaire.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};

export default Formulaire;
