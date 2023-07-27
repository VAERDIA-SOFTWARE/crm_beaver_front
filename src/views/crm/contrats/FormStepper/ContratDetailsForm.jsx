import PropTypes from 'prop-types';

// material-ui
import { Box, Stack } from '@mui/system';

// project imports

// third-party
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUpdateContratSkeleton, useGetContratsSkeleton } from 'services/contrats.service';
import { useGetOperations } from 'services/zone-villes.service';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';

import MainCard from 'ui-component/cards/MainCard';
import { Button, Grid } from '@mui/material';

import { LoadingButton } from '@mui/lab';

const ContratSqueletteDetails = ({ handleNext, handleBack, contractForm, step }) => {
  const updateContratSkeletonMutation = useUpdateContratSkeleton(contractForm?.id);
  const getContratsSkeletonQuery = useGetContratsSkeleton(contractForm?.id);
  const [contratSkeletonLocalData, setContratSkeletonLocalData] = useState([]);
  useEffect(() => {
    if (getContratsSkeletonQuery?.isSuccess && getContratsSkeletonQuery?.isFetching === false) {
      setContratSkeletonLocalData((f) => [...f, ...getContratsSkeletonQuery.data?.data]);
    }
    return () => setContratSkeletonLocalData([]);
  }, [getContratsSkeletonQuery?.data?.data, getContratsSkeletonQuery?.isSuccess, getContratsSkeletonQuery?.isFetching]);

  // console.log(contratSkeletonLocalData);
  return (
    <Box>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between">
          <Button onClick={handleBack} sx={{ my: 3, ml: 1 }}>
            Back
          </Button>
          <LoadingButton
            sx={{ my: 3, ml: 1 }}
            loadingPosition="end"
            endIcon={<NavigateNextRoundedIcon />}
            loading={updateContratSkeletonMutation.isLoading}
            disabled={!getContratsSkeletonQuery.isSuccess}
            variant="contained"
            onClick={async () => {
              await updateContratSkeletonMutation.mutateAsync({
                contratId: contractForm?.id,
                values: { skeleton: contratSkeletonLocalData }
              });
              handleNext(1);
            }}
          >
            Suivant
          </LoadingButton>
        </Stack>
      </Grid>
      <div>
        <MainCard content={true}>
          <div>
            {getContratsSkeletonQuery?.isSuccess &&
              getContratsSkeletonQuery?.isFetching === false &&
              contratSkeletonLocalData?.map((item) => {
                return (
                  <div
                    key={item?.id}
                    style={{
                      marginBottom: 40
                    }}
                  >
                    {/* <h3 dangerouslySetInnerHTML={{ __html: `<div style=${item?.style}>${item?.title}</div>` }}></h3> */}
                    <h3>{item?.title}</h3>

                    {item?.fields?.map((field) => (
                      <div
                        key={field?.id}
                        style={{
                          marginBottom: 20
                        }}
                      >
                        {['text', 'table', 'image'].includes(field?.type) && (
                          <ContentEditableWithRef
                            value={field?.data}
                            onChange={(e) => {
                              const editorFieldData = e.currentTarget.innerHTML;
                              setContratSkeletonLocalData((d) => {
                                return contratSkeletonLocalData?.map((e) => {
                                  if (e?.id === item?.id) {
                                    const tempD = {
                                      ...e,
                                      fields: e?.fields?.map((fieldd) => {
                                        if (fieldd?.id === field?.id) {
                                          return { ...fieldd, data: editorFieldData };
                                        }
                                        return fieldd;
                                      })
                                    };
                                    return tempD;
                                  }
                                  return e;
                                });
                              });
                            }}
                            style={{
                              padding: 10,
                              border: '1px solid #a1a1a1',
                              borderRadius: 10,
                              boxShadow:
                                '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)'
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
          </div>
        </MainCard>
      </div>
    </Box>
  );
};

ContratSqueletteDetails.propTypes = {
  shippingData: PropTypes.object,
  setShippingData: PropTypes.func,
  handleNext: PropTypes.func,
  setErrorIndex: PropTypes.func
};

export default ContratSqueletteDetails;

const ContentEditableWithRef = (props) => {
  const defaultValue = useRef(props.value);

  const handleInput = (event) => {
    if (props.onChange) {
      props.onChange(event);
    }
  };

  return <div contentEditable style={props?.style} onInput={handleInput} dangerouslySetInnerHTML={{ __html: defaultValue.current }} />;
};
