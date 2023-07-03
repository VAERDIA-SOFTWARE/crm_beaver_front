import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, TextField, Typography } from '@mui/material';
import FoundationIcon from '@mui/icons-material/Foundation';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import EarningIcon from 'assets/images/icons/earning.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyOutlined';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveOutlined';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { format } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.dark : theme.palette.secondary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative'
  // '&:after': {
  //   content: '""',
  //   position: 'absolute',
  //   width: 210,
  //   height: 210,
  //   background:
  //     theme.palette.mode === 'dark'
  //       ? `linear-gradient(210.04deg, ${theme.palette.secondary.dark} -50.94%, rgba(144, 202, 249, 0) 95.49%)`
  //       : theme.palette.secondary[800],
  //   borderRadius: '50%',
  //   top: -85,
  //   right: -95,
  //   [theme.breakpoints.down('sm')]: {
  //     top: -105,
  //     right: -140
  //   }
  // },
  // '&:before': {
  //   content: '""',
  //   position: 'absolute',
  //   width: 210,
  //   height: 210,
  //   background:
  //     theme.palette.mode === 'dark'
  //       ? `linear-gradient(140.9deg, ${theme.palette.secondary.dark} -14.02%, rgba(144, 202, 249, 0) 85.50%)`
  //       : theme.palette.secondary[800],
  //   borderRadius: '50%',
  //   top: -125,
  //   right: -15,
  //   opacity: 0.5,
  //   [theme.breakpoints.down('sm')]: {
  //     top: -155,
  //     right: -70
  //   }
  // }
}));

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const EarningCard = ({ isLoading, data, filterValue, onFilterValueChange }) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between" gap={2}>
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.largeAvatar,
                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary[800],
                        color: '#fff',
                        mt: 1
                      }}
                    >
                      <ContentPasteSearchIcon />
                    </Avatar>
                  </Grid>

                  {filterValue && (
                    <Grid item>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          // label="Basic example"
                          value={filterValue}
                          onChange={(newValue) => {
                            const formattedDate = format(new Date(newValue), 'yyyy-MM-dd');

                            onFilterValueChange(formattedDate);
                            // setValue(newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              sx={{
                                svg: { color: 'white' },
                                '.MuiInputBase-root': {
                                  background: 'transparent',
                                  border: 0,
                                  cursor: 'default'
                                },
                                input: {
                                  //  display: 'none',
                                  // opacity: 0,
                                  cursor: 'default'
                                },
                                fieldset: {
                                  //  display: 'none',
                                  border: 0
                                }
                                // label: { color }
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>{' '}
                    </Grid>
                  )}
                  {false && (
                    <Grid item>
                      <Avatar
                        variant="rounded"
                        sx={{
                          ...theme.typography.commonAvatar,
                          ...theme.typography.mediumAvatar,
                          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.dark : theme.palette.secondary.dark,
                          color: theme.palette.secondary[200],
                          zIndex: 1
                        }}
                        aria-controls="menu-earning-card"
                        aria-haspopup="true"
                        onClick={handleClick}
                      >
                        <MoreHorizIcon fontSize="inherit" />
                      </Avatar>
                      <Menu
                        id="menu-earning-card"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        variant="selectedMenu"
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right'
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right'
                        }}
                      >
                        <MenuItem onClick={handleClose}>
                          <GetAppTwoToneIcon sx={{ mr: 1.75 }} /> Import Card
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <FileCopyTwoToneIcon sx={{ mr: 1.75 }} /> Copy Data
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <PictureAsPdfTwoToneIcon sx={{ mr: 1.75 }} /> Export
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <ArchiveTwoToneIcon sx={{ mr: 1.75 }} /> Archive File
                        </MenuItem>
                      </Menu>
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Grid item>
                <Grid container alignItems="center">
                  <Grid item>
                    <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>{data}</Typography>
                  </Grid>
                  <Grid item>
                    <Avatar
                      sx={{
                        cursor: 'pointer',
                        ...theme.typography.smallAvatar,
                        backgroundColor: theme.palette.secondary[200],
                        color: theme.palette.secondary.dark
                      }}
                    >
                      <ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
                    </Avatar>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ mb: 1.25 }}>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : theme.palette.secondary[200]
                  }}
                >
                  Interventions
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

EarningCard.propTypes = {
  isLoading: PropTypes.bool
};

export default EarningCard;
