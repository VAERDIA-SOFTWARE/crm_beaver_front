import PropTypes from 'prop-types';

// material-ui
import { Box, Divider, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';

// third-party
import CurrencyFormat from 'react-currency-format';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import Logo from 'ui-component/Logo';
import LogoLionHead from 'ui-component/LogoLionHead';

// ==============================|| TOTAL-SUBCARD PAGE ||============================== //

function TotalCard({ productsData, allAmounts, useGetFactureTotalQuery }) {
  const theme = useTheme();

  return (
    <>
      {'productsData.length' ? (
        <Grid item xs={12}>
          <SubCard
            sx={{
              mx: 0,
              mb: 0,
              bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
              paddingLeft: {
                md: 5
              },
              paddingRight: {
                md: 5
              }
            }}
          >
            <Grid container justifyContent="space-between" alignItems={'center'} spacing={2}>
              <Grid item md={7}>
                <Box
                  sx={{
                    display: {
                      xs: 'none',
                      md: 'block'
                    }
                  }}
                >
                  <img
                    src={LogoLionHead()}
                    alt="Maison Beaver"
                    height="130"
                    style={{
                      objectFit: 'contain'
                    }}
                  />
                </Box>
              </Grid>
              <Grid item md={5}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography align="right" variant="subtitle1">
                          Montant HTNet Total:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right" variant="body2">
                          {useGetFactureTotalQuery?.data?.montant_HTNet_total ?? 0} €
                          {/* <CurrencyFormat
                            decimalScale={2}
                            fixedDecimalScale
                            value={useGetFactureTotalQuery?.data?.montant_HTNet_total}
                            displayType="text"
                            thousandSeparator
                            prefix="$"
                          /> */}
                        </Typography>
                      </Grid>

                      {false && (
                        <>
                          <Grid item xs={6}>
                            <Typography align="right" variant="subtitle1">
                              Montant HT Total:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography align="right" variant="body2">
                              {useGetFactureTotalQuery?.data?.montant_HT_total ?? 0} €
                              {/* <CurrencyFormat
                            decimalScale={2}
                            fixedDecimalScale
                            value={useGetFactureTotalQuery?.data?.montant_HT_total}
                            displayType="text"
                            thousandSeparator
                            prefix="$"
                          /> */}
                            </Typography>
                          </Grid>
                        </>
                      )}

                      <Grid item xs={6}>
                        <Typography align="right" variant="subtitle1">
                          Montant Remise:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right" variant="body2">
                          {useGetFactureTotalQuery?.data?.montant_Remise ?? 0} €
                          {/* <CurrencyFormat
                            decimalScale={2}
                            fixedDecimalScale
                            value={useGetFactureTotalQuery?.data?.montant_Remise}
                            displayType="text"
                            thousandSeparator
                            prefix="$"
                          /> */}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography align="right" variant="subtitle1">
                          Montant TTC Total:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right" variant="body2">
                          {useGetFactureTotalQuery?.data?.montant_TTC_total ?? 0} €
                          {/* <CurrencyFormat
                            decimalScale={2}
                            fixedDecimalScale
                            value={useGetFactureTotalQuery?.data?.montant_TTC_total}
                            displayType="text"
                            thousandSeparator
                            prefix="$"
                          /> */}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography align="right" variant="subtitle1">
                          Montant TVA Total:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right" variant="body2">
                          {useGetFactureTotalQuery?.data?.montant_TVA_total ?? 0} €
                          {/* <CurrencyFormat
                            decimalScale={2}
                            fixedDecimalScale
                            value={useGetFactureTotalQuery?.data?.montant_TVA_total}
                            displayType="text"
                            thousandSeparator
                            prefix="$"
                          /> */}
                        </Typography>
                      </Grid>

                      {false && (
                        <>
                          {' '}
                          <Grid item xs={6}>
                            <Typography align="right" variant="subtitle1">
                              Sub Total :
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography align="right" variant="body2">
                              <CurrencyFormat
                                decimalScale={2}
                                fixedDecimalScale
                                value={allAmounts.subTotal}
                                displayType="text"
                                thousandSeparator
                                prefix="$"
                              />
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography align="right" variant="subtitle1">
                              Taxes (10%) :
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography align="right" variant="body2">
                              <CurrencyFormat
                                decimalScale={2}
                                fixedDecimalScale
                                value={allAmounts.taxesAmount}
                                displayType="text"
                                thousandSeparator
                                prefix="$"
                              />
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography align="right" variant="subtitle1">
                              Discount (5%) :
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography align="right" variant="body2">
                              <CurrencyFormat
                                decimalScale={2}
                                fixedDecimalScale
                                value={allAmounts.discountAmount}
                                displayType="text"
                                thousandSeparator
                                prefix="$"
                              />
                            </Typography>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ bgcolor: 'dark.main' }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography align="right" color="primary" variant="subtitle1">
                          Montant HT Total:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right" color="primary" variant="subtitle1">
                          {useGetFactureTotalQuery?.data?.montant_HT_total ?? 0} €
                          {/* <CurrencyFormat
                            decimalScale={2}
                            fixedDecimalScale
                            value={allAmounts.totalAmount}
                            displayType="text"
                            thousandSeparator
                            prefix="$"
                          /> */}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </SubCard>
          <Grid item sx={{ mt: 3 }} xs={12}>
            <Divider />
          </Grid>
        </Grid>
      ) : null}
    </>
  );
}

TotalCard.propTypes = {
  productsData: PropTypes.array,
  allAmounts: PropTypes.object
};

export default TotalCard;
