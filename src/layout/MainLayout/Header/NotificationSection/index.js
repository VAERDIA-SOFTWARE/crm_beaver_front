import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Badge,
  Box,
  Button,
  CardActions,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  Paper,
  Popper,
  Stack,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import NotificationList from './NotificationList';

// assets
import { IconBell } from '@tabler/icons';
import { useGetNotifications, useMarkAllNotificationsAsRead } from 'services/users.service';

// notification status options
const status = [
  {
    value: 'all',
    label: 'All Notification'
  },
  {
    value: 'new',
    label: 'New'
  },
  {
    value: 'unread',
    label: 'Unread'
  },
  {
    value: 'other',
    label: 'Other'
  }
];

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const getNotificationsQuery = useGetNotifications();
  const notificationsQueryData = getNotificationsQuery?.data;
  const notViewedNotifications = notificationsQueryData?.filter((n) => n?.vue == 0);

  const markAllNotificationsAsReadMutation = useMarkAllNotificationsAsRead();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const handleChange = (event) => setValue(event?.target.value);

  return (
    <>
      <Box
        sx={{
          ml: 2,
          mr: 3,
          [theme.breakpoints.down('md')]: {
            mr: 2
          }
        }}
      >
        <Badge variant="dot" badgeContent={notViewedNotifications?.length} color="primary">
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
              color: theme.palette.mode === 'dark' ? theme.palette.warning.dark : theme.palette.secondary.dark,
              '&[aria-controls="menu-list-grow"],&:hover': {
                background: theme.palette.mode === 'dark' ? theme.palette.warning.dark : theme.palette.secondary.dark,
                color: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.secondary.light
              }
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            color="inherit"
          >
            <IconBell stroke={1.5} size="1.3rem" />
          </Avatar>
        </Badge>
      </Box>

      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [matchesXs ? 5 : 0, 20]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
              <Paper>
                {'open' && (
                  <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item xs={12}>
                        <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
                          <Grid item>
                            <Stack direction="row" spacing={2}>
                              <Typography variant="subtitle1">Notifications</Typography>
                              {notViewedNotifications?.length ? (
                                <Chip
                                  size="small"
                                  label={notViewedNotifications?.length}
                                  sx={{
                                    color: theme.palette.background.default,
                                    bgcolor: theme.palette.warning.dark
                                  }}
                                />
                              ) : null}
                            </Stack>
                          </Grid>
                          {notViewedNotifications?.length ? (
                            <Grid item>
                              <Typography
                                component={Link}
                                to="#"
                                variant="subtitle2"
                                color="primary"
                                onClick={async () => {
                                  await markAllNotificationsAsReadMutation.mutateAsync();
                                }}
                              >
                                Tout marquer comme lu
                              </Typography>
                            </Grid>
                          ) : null}
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <div style={{ height: '100%', maxHeight: 'calc(100vh - 205px)', overflow: 'auto' }}>
                          <Grid container direction="column" spacing={2}>
                            {/* <Grid item xs={12}>
                              <Box sx={{ px: 2, pt: 0.25 }}>
                                <TextField
                                  id="outlined-select-currency-native"
                                  select
                                  fullWidth
                                  value={value}
                                  onChange={handleChange}
                                  SelectProps={{
                                    native: true
                                  }}
                                >
                                  {status.map((option) => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </TextField>
                              </Box>
                            </Grid> */}
                            <Grid item xs={12} p={0}>
                              <Divider sx={{ my: 0 }} />
                            </Grid>
                          </Grid>
                          {notificationsQueryData?.length == 0 && (
                            <p
                              style={{
                                padding: 16
                              }}
                            >
                              Aucune notification trouvée
                            </p>
                          )}
                          {getNotificationsQuery?.isSuccess && notificationsQueryData && (
                            <NotificationList notificationsQueryData={notificationsQueryData} />
                          )}
                        </div>
                      </Grid>
                    </Grid>
                    <Divider />
                    {/* <CardActions sx={{ p: 1.25, justifyContent: 'center' }}>
                      <Button size="small" disableElevation>
                        View All
                      </Button>
                    </CardActions> */}
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
};

export default NotificationSection;
