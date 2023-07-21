// material-ui
import { Divider, FormControl, FormControlLabel, List, Radio, RadioGroup, TextField } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

const FormulaireCard = ({ title, data, style }) => {
  return (
    <MainCard title={title} content={false}>
      <div style={{ height: 900, overflow: 'auto', ...style }}>
        <List
          style={{
            paddingLeft: 18,
            paddingRight: 18
          }}
        >
          {Array.isArray(data?.blocs) &&
            data?.blocs?.map((bloc) => (
              <div key={bloc?.id}>
                <h4>{bloc?.titre}</h4>
                {Array.isArray(bloc?.lignes) &&
                  bloc?.lignes?.map((ligne) => (
                    <div key={ligne?.id}>
                      {/* <h5>{ligne?.titre}</h5>
                      <h4>{ligne?.type}</h4> */}
                      Question: {ligne?.contenu?.data?.question}
                      <div>
                        <FormControl>
                          <RadioGroup name={ligne?.contenu?.data?.question}>
                            {ligne?.type === 1 &&
                              Array.isArray(ligne?.contenu?.data?.fields) &&
                              ligne?.contenu?.data?.fields?.map((field) => {
                                return (
                                  <div key={field?.id}>
                                    <FormControlLabel
                                      disabled
                                      checked={field?.value === 1 ? true : false}
                                      control={<Radio />}
                                      label={field?.title}
                                    />
                                  </div>
                                );
                              })}
                          </RadioGroup>
                        </FormControl>
                      </div>
                      {ligne?.type === 3 &&
                        Array.isArray(ligne?.contenu?.data?.fields) &&
                        ligne?.contenu?.data?.fields?.map((field) => {
                          return (
                            <div key={field?.id}>
                              <TextField
                                style={{
                                  width: '100%'
                                }}
                                disabled
                                label={field?.title}
                                variant="standard"
                                defaultValue={field?.value}
                                value={field?.value}
                              />
                            </div>
                          );
                        })}
                      {ligne?.type === 5 &&
                        Array.isArray(ligne?.contenu?.data?.fields) &&
                        ligne?.contenu?.data?.fields?.map((field) => {
                          return (
                            <div key={field?.id}>
                              <TextField
                                style={{
                                  width: '100%'
                                }}
                                disabled
                                label={field?.title}
                                variant="standard"
                                defaultValue={field?.value}
                                value={field?.value}
                              />
                            </div>
                          );
                        })}
                      {ligne?.type === 2 &&
                        Array.isArray(ligne?.contenu?.data?.fields) &&
                        ligne?.contenu?.data?.fields?.map((field) => {
                          return (
                            <div key={field?.id}>
                              {field?.value ? (
                                <img
                                  src={`${process.env.REACT_APP_API_URL}image/${field?.value}`}
                                  alt=""
                                  height={200}
                                  width={200}
                                  style={{
                                    objectFit: 'contain'
                                  }}
                                />
                              ) : (
                                'Image non disponible'
                              )}
                            </div>
                          );
                        })}
                      <Divider
                        style={{
                          marginBottom: 20,
                          marginTop: 10
                        }}
                      />
                    </div>
                  ))}
                {/* <Divider /> */}
              </div>
            ))}
        </List>
      </div>
    </MainCard>
  );
};

export default FormulaireCard;
