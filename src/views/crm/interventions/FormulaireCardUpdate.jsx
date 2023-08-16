// material-ui
import { Divider, FormControl, FormControlLabel, List, Radio, RadioGroup, TextField } from '@mui/material';
import React from 'react';
import { cloneDeep, isEqual } from 'lodash';
import SaveIcon from '@mui/icons-material/Save';
import { Box, Grid, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { usePostForm, useStoreImage } from 'services/form.service';
import { useNavigate } from 'react-router-dom';
import renderArrayMultiline from 'utilities/utilities';
import { DateTimePicker, frFR, LocalizationProvider } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import moment from 'moment/moment';
import { useEffect } from 'react';
import CustomFileUpload from 'ui-component/UploadFiles';

const FormulaireCardUpdate = ({ title, data = [], style, inspectionId, interventionData }) => {
  const [localData, setLocalData] = React.useState([]);
  const postFormMutation = usePostForm();
  const storeImageMutation = useStoreImage();
  const [date, setDate] = React.useState({
    start: '',
    end: ''
  });
  // const [endDate, setEndDate] = React.useState(null);
  const [images, setImages] = React.useState([
    {
      line: '',
      images: []
    }
  ]);

  const [enabledInput, setEnabledInput] = React.useState(null);
  const [disableInput, setDisableInput] = React.useState(false);

  // const [endDate, setEndDate] = React.useState(null);
  const [cordinates, setCordinates] = React.useState({});
  const [formErrors, setFormErrors] = React.useState({
    latitude: '',
    longitude: ''
  });
  const [locations, setLocations] = React.useState({
    latitude: '',
    longitude: ''
  });

  // React.useEffect(() => {}, [cordinates]);
  useEffect(() => {
    setLocalData(cloneDeep(data));
    setDate((prev) => {
      return { ...prev, start: interventionData?.deb_calendar, end: interventionData?.fin_calendar };
    });
  }, [data, interventionData]);
  const handleChange = (event, blocIndex, ligneIndex, fieldIndex) => {
    let newPermissions = cloneDeep(localData);
    // newPermissions.blocs[blocIndex].lignes[ligneIndex] = 0;
    if (newPermissions.blocs[blocIndex].lignes[ligneIndex].type === 1) {
      newPermissions.blocs[blocIndex].lignes[ligneIndex].contenu.data.fields.map((item, index) => {
        if (index === fieldIndex) {
          item.value = 1;
          if (item.blocage === 1) {
            setDisableInput(true);
            setEnabledInput(blocIndex.toString() + ligneIndex.toString());
          }
        } else {
          if (item.blocage === 1) {
            setDisableInput(false);
          }
          item.value = 0;
        }
      });
    } else {
      newPermissions.blocs[blocIndex].lignes[ligneIndex].contenu.data.fields[fieldIndex].value = event.target.value;
    }

    // event.target.checked;
    setLocalData(newPermissions);
  };
  const handleImage = async (event, blocIndex, ligneIndex, fieldIndex) => {
    // event.target.files[0];
    // console.log(event.target.files);
    let newPermissions = cloneDeep(localData);
    let ligne = newPermissions.blocs[blocIndex].lignes[ligneIndex].id;
    const formData = new FormData();
    formData.append('line_id', ligne);
    const array = [...event.target.files];
    for (let index = 0; index < array.length; index++) {
      formData.append(`file[${index}]`, array[index]);
    }
    const imageIndex = images.findIndex((item) => item.line === ligne);
    let cloneImages = [...images];
    if (imageIndex !== -1) {
      cloneImages[imageIndex] = {
        ...cloneImages[imageIndex],
        line: ligne,
        images: [...cloneImages[imageIndex]?.images, array.map((item) => URL.createObjectURL(item))]
      };
      setImages(cloneImages);
    } else {
      console.log(array.map((item) => URL.createObjectURL(item)));
      // setImages([...images, { line: ligne, images: [...cloneImages[imageIndex]?.images, array.map((item) => URL.createObjectURL(item))] }]);
    }
    await storeImageMutation.mutateAsync({
      id: inspectionId,
      values: formData
    });
  };
  // console.log(images);
  const getLocation = async () => {
    // Check if Geolocation is supported by the browser
    if (locations.latitude !== '') {
      // Make a request to the Google Maps Geocoding API
      return fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${locations.latitude}+${locations.longitude}&key=625aefe2302c4aca88d8a026e96d7228`
      )
        .then((response) => response.json())
        .then((data) => {
          // Extract the address details from the response
          const addressComponents = data.results[0].components;
          // Create the coordinates object with the retrieved values

          const address = {
            name: addressComponents['road'],
            street: addressComponents['road'],
            country: addressComponents['country'],
            altitude: 61.5,
            postalCode: addressComponents['postcode'],
            subLocality: null,
            thoroughfare: addressComponents['state_district'],
            subThoroughfare: addressComponents['state_district'],
            administrativeArea: addressComponents['city'],
            subAdministrativeArea: addressComponents['state_district']
          };
          return { ...address };
          // Include the coordinates object in your API request
          // Replace this with your actual API endpoint and request configuration
          // return true;
        })
        .catch((error) => {
          // toast.error('Vérifier les coordonnées de votre localisation');
          // setFormErrors({
          //   latitude: 'Vérifier la valeur de latitude',
          //   longitude: 'Vérifier la valeur de longitude'
          // });
          return false;
        });
    } else {
      // Geolocation is not supported by the browser
      // Handle error
      // ...
      setFormErrors({
        latitude: 'Vérifier la valeur de latitude',
        longitude: 'Vérifier la valeur de longitude'
      });
      return false;
    }
    return true;
  };
  const handleSubmit = async () => {
    let test = await getLocation();
    await postFormMutation.mutateAsync({
      id: inspectionId,
      values: {
        formulaire: localData,

        location: test
          ? { ...test, longitude: locations.longitude, latitude: locations.latitude }
          : { longitude: locations.longitude, latitude: locations.latitude },
        dates: {
          start: date.start,
          end: date.end
        }
      }
    });
    // navigate(`/interventions/${inspectionId}/details`);
  };
  return (
    <MainCard
      title={title}
      content={false}
      secondary={
        <LoadingButton
          loadingPosition="start"
          loading={postFormMutation.isLoading}
          //   disabled={isEqual(localPermissions, userPermissionsData)}
          color={'secondary'}
          variant="contained"
          onClick={handleSubmit}
        >
          {'Sauvegarder'}
        </LoadingButton>
      }
    >
      <div
        style={{
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* <div style={{ display: 'flex', columnGap: '2rem', flexDirection: 'column' }}>
          <h4>Localisation</h4>
          <div style={{ display: 'flex', columnGap: '2rem' }}>
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                label="latitude*"
                value={locations.latitude}
                name="latitude"
                onChange={handleLocationChange}
                error={!!formErrors?.latitude}
                helperText={formErrors?.latitude}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="standard"
                label="longitude*"
                value={locations.longitude}
                name="longitude"
                onChange={handleLocationChange}
                error={!!formErrors?.longitude}
                helperText={formErrors?.longitude}
              />
            </Grid>
          </div>
        </div> */}
        <div style={{ display: 'flex', columnGap: '2rem', flexDirection: 'column' }}>
          <h4>Date</h4>
          <div style={{ display: 'flex', columnGap: '2rem' }}>
            <Grid item xs={12} md={6}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                // adapterLocale="fr"
                localeText={frFR.components.MuiLocalizationProvider.defaultProps.localeText}
              >
                <DateTimePicker
                  ampm={false}
                  renderInput={(params) => (
                    <TextField
                      variant="standard"
                      {...params}
                      error={!!formErrors?.data?.debut}
                      helperText={renderArrayMultiline(formErrors?.data?.start)}
                    />
                  )}
                  inputFormat="dd/MM/yyyy HH:mm"
                  label="Date début"
                  value={moment(date?.start).utc().format('YYYY-MM-DD HH:mm:ss')}
                  onChange={(v) => {
                    try {
                      const formattedDate = moment(v).utc().format('YYYY-MM-DD HH:mm:ss');

                      setDate((f) => {
                        return { ...f, start: formattedDate };
                      });
                    } catch (error) {}
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                // adapterLocale="fr"
                localeText={frFR.components.MuiLocalizationProvider.defaultProps.localeText}
              >
                <DateTimePicker
                  ampm={false}
                  inputFormat="dd/MM/yyyy HH:mm"
                  renderInput={(params) => (
                    <TextField
                      variant="standard"
                      {...params}
                      error={!!formErrors?.data?.end}
                      helperText={renderArrayMultiline(formErrors?.data?.end)}
                    />
                  )}
                  label="Date fin"
                  value={moment(date?.end).utc().format('YYYY-MM-DD HH:mm:ss')}
                  onChange={(v) => {
                    try {
                      const formattedDate = moment(v).utc().format('YYYY-MM-DD HH:mm:ss');

                      setDate((f) => {
                        return { ...f, end: formattedDate };
                      });
                    } catch (error) {}
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </div>
        </div>
        {Array.isArray(localData?.blocs) &&
          localData?.blocs?.map((bloc, blocIndex) => (
            <div key={bloc?.id}>
              <h4>{bloc?.titre}</h4>
              {Array.isArray(bloc?.lignes) &&
                bloc?.lignes?.map((ligne, ligneIndex) => (
                  <div key={ligne?.id}>
                    {ligne?.actif === 1 && (
                      <>
                        {/* <h5>{ligne?.titre}</h5>
                      <h4>{ligne?.type}</h4> */}
                        {ligne?.type !== 5 && `Question : ${ligne?.contenu?.data?.question}`}
                        <div>
                          <FormControl>
                            <RadioGroup name={ligne?.contenu?.data?.question}>
                              {ligne?.type === 1 &&
                                Array.isArray(ligne?.contenu?.data?.fields) &&
                                ligne?.contenu?.data?.fields?.map((field, fieldIndex) => {
                                  return (
                                    <div key={field?.id}>
                                      <FormControlLabel
                                        onChange={(event) => {
                                          handleChange(event, blocIndex, ligneIndex, fieldIndex);
                                        }}
                                        checked={field?.value === 1 ? true : false}
                                        control={<Radio />}
                                        label={field?.title}
                                        disabled={blocIndex.toString() + ligneIndex.toString() !== enabledInput ? disableInput : false}
                                      />
                                    </div>
                                  );
                                })}
                            </RadioGroup>
                          </FormControl>
                        </div>
                        {ligne?.type === 3 &&
                          Array.isArray(ligne?.contenu?.data?.fields) &&
                          ligne?.contenu?.data?.fields?.map((field, fieldIndex) => {
                            return (
                              <div key={field?.id}>
                                <TextField
                                  onChange={(event) => {
                                    handleChange(event, blocIndex, ligneIndex, fieldIndex);
                                  }}
                                  style={{
                                    width: '100%'
                                  }}
                                  label={field?.title}
                                  variant="standard"
                                  defaultValue={field?.value}
                                  value={field?.value}
                                  disabled={blocIndex.toString() + ligneIndex.toString() !== enabledInput ? disableInput : false}
                                />
                              </div>
                            );
                          })}
                        {ligne?.type === 5 && <h3>{ligne?.titre}</h3>}
                        {/* {ligne?.type === 5 &&
                      Array.isArray(ligne?.contenu?.data?.fields) &&
                      ligne?.contenu?.data?.fields?.map((field, fieldIndex) => {
                        return (
                          <div key={field?.id}>
                            <TextField
                              onChange={(event) => {
                                handleChange(event, blocIndex, ligneIndex, fieldIndex);
                              }}
                              style={{
                                width: '100%'
                              }}
                              label={field?.title}
                              variant="standard"
                              defaultValue={field?.value}
                              value={field?.value}
                              disabled={blocIndex.toString() + ligneIndex.toString() !== enabledInput ? disableInput : false}
                            />
                          </div>
                        );
                      })} */}
                        {ligne?.type === 2 &&
                          Array.isArray(ligne?.contenu?.data?.fields) &&
                          ligne?.contenu?.data?.fields?.map((field, fieldIndex) => {
                            return (
                              <div key={field?.id}>
                                <>
                                  {/* <CustomFileUpload
                                    fileTypes={['png', 'jpg', 'jpeg']}
                                    handleFilesChange={(event) => handleImage(event, blocIndex, ligneIndex, fieldIndex)}
                                    onFileDelete={() => {}}
                                    files={[]}
                                    endpoint=""
                                    error={formErrors}
                                  /> */}
                                  <input
                                    multiple
                                    accept="image/*"
                                    type="file"
                                    id={'select-image-' + ligne?.id}
                                    style={{ display: 'none' }}
                                    onChange={(event) => handleImage(event, blocIndex, ligneIndex, fieldIndex)}
                                  />
                                  <label htmlFor={'select-image-' + ligne?.id}>
                                    <LoadingButton variant="contained" color="primary" component="span">
                                      Selectionner des Images
                                    </LoadingButton>
                                  </label>
                                  {field?.value ||
                                    (images.find((item) => item.line === ligne?.id) && (
                                      <Box mt={2} textAlign="center">
                                        <div>Aperçu des images:</div>
                                        {images
                                          .find((item) => item.line === ligne?.id)
                                          ?.map((item, index) => (
                                            <img
                                              id={'image-' + ligne?.id + '-' + index}
                                              // src={
                                              //   `${process.env.REACT_APP_API_URL}image/${field?.value}`
                                              //     ? `${process.env.REACT_APP_API_URL}image/${field?.value}`
                                              //     :
                                              // }
                                              // onChange={images.find((item) => console.log(item))}
                                              src={item}
                                              height="100px"
                                              alt=""
                                            />
                                          ))}
                                      </Box>
                                    ))}
                                </>

                                {/* {field?.value ? (
                              <img
                                src={`${process.env.REACT_APP_API_URL}image/${field?.value}`}
                                alt=""
                                height={200}
                                style={{
                                  objectFit: 'contain'
                                }}
                              />
                            ) : (
                              'Image non disponible'
                            )} */}
                              </div>
                            );
                          })}
                        <Divider
                          style={{
                            marginBottom: 20,
                            marginTop: 10
                          }}
                        />
                      </>
                    )}
                  </div>
                ))}
              {/* <Divider /> */}
            </div>
          ))}
      </div>
    </MainCard>
  );
};

export default FormulaireCardUpdate;
