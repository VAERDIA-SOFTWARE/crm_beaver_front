import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  ClickAwayListener,
  Collapse,
  Divider,
  Grid,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  Paper,
  Popper,
  Stack,
  Switch,
  Typography
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import UpgradePlanCard from './UpgradePlanCard';
import useAuth from 'hooks/useAuth';
import User1 from 'assets/images/users/user-round.svg';

// assets
import { IconChevronDown, IconChevronUp, IconLogout, IconSearch, IconSettings, IconUser } from '@tabler/icons';
import useConfig from 'hooks/useConfig';
import LockResetIcon from '@mui/icons-material/LockReset';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const theme = useTheme();
  const { borderRadius } = useConfig();
  const navigate = useNavigate();

  const [settingsOpen, setSettingsOpen] = useState(false);

  const [sdm, setSdm] = useState(true);
  const [value, setValue] = useState('');
  const [notification, setNotification] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { logout, user } = useAuth();
  const [open, setOpen] = useState(false);
  /**
   * anchorRef is used on different components and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };
  const handleListItemClick = (event, index, route = '') => {
    setSelectedIndex(index);
    handleClose(event);

    if (route && route !== '') {
      navigate(route);
    }
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            '& svg': {
              stroke: theme.palette.primary.light
            }
          },
          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        icon={
          <Avatar
            // src={User1}
            sx={{
              ...theme.typography.mediumAvatar,
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer',
              bgcolor: user?.couleur ?? ''
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
          >
            {user?.name.split(' ')[0].charAt(0).toUpperCase()}
            {user?.name.split(' ')[1]?.charAt(0)?.toUpperCase() ?? ''}
          </Avatar>
        }
        label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />

      <Popper
        placement="bottom"
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
                offset: [0, 14]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper>
                {'open' && (
                  <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                    <Box sx={{ p: 2, pb: 0 }}>
                      <Stack>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                          style={{
                            marginBottom: 10
                          }}
                        >
                          <Typography variant="h4">Bienvenue,</Typography>
                          <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                            {user?.name}
                          </Typography>
                        </Stack>
                        {/* <Typography variant="subtitle2">Project Admin</Typography> */}
                      </Stack>
                      {/* <OutlinedInput
                        sx={{ width: '100%', pr: 1, pl: 2, my: 2 }}
                        id="input-search-profile"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Search profile options"
                        startAdornment={
                          <InputAdornment position="start">
                            <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
                          </InputAdornment>
                        }
                        aria-describedby="search-helper-text"
                        inputProps={{
                          'aria-label': 'weight'
                        }}
                      /> */}
                      <Divider />
                    </Box>
                    <div style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                      <Box sx={{ p: 2, pt: 0 }}>
                        {/* <UpgradePlanCard /> */}
                        {/* <Divider /> */}
                        {/* <Card
                          sx={{
                            bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark[800] : theme.palette.primary.light,
                            my: 2
                          }}
                        >
                          <CardContent>
                            <Grid container spacing={3} direction="column">
                              <Grid item>
                                <Grid item container alignItems="center" justifyContent="space-between">
                                  <Grid item>
                                    <Typography variant="subtitle1">Start DND Mode</Typography>
                                  </Grid>
                                  <Grid item>
                                    <Switch
                                      color="primary"
                                      checked={sdm}
                                      onChange={(e) => setSdm(e.target.checked)}
                                      name="sdm"
                                      size="small"
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item>
                                <Grid item container alignItems="center" justifyContent="space-between">
                                  <Grid item>
                                    <Typography variant="subtitle1">Allow Notifications</Typography>
                                  </Grid>
                                  <Grid item>
                                    <Switch
                                      checked={notification}
                                      onChange={(e) => setNotification(e.target.checked)}
                                      name="sdm"
                                      size="small"
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card> */}
                        {/* <Divider /> */}
                        <List
                          component="nav"
                          sx={{
                            width: '100%',
                            maxWidth: 350,
                            minWidth: 300,
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: '10px',
                            [theme.breakpoints.down('md')]: {
                              minWidth: '100%'
                            },
                            '& .MuiListItemButton-root': {
                              mt: 0.5
                            }
                          }}
                        >
                          {false && (
                            <ListItemButton
                              sx={{ borderRadius: `${borderRadius}px` }}
                              selected={selectedIndex === 0}
                              onClick={(event) => handleListItemClick(event, 0, '/user/account-profile/profile1')}
                            >
                              <ListItemIcon>
                                <IconSettings stroke={1.5} size="1.3rem" />
                              </ListItemIcon>
                              <ListItemText primary={<Typography variant="body2">Account Settings</Typography>} />
                            </ListItemButton>
                          )}
                          {false && (
                            <ListItemButton
                              sx={{ borderRadius: `${borderRadius}px` }}
                              selected={selectedIndex === 1}
                              onClick={(event) => handleListItemClick(event, 1, '/user/social-profile/posts')}
                            >
                              <ListItemIcon>
                                <IconUser stroke={1.5} size="1.3rem" />
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Grid container spacing={1} justifyContent="space-between">
                                    <Grid item>
                                      <Typography variant="body2">Social Profile</Typography>
                                    </Grid>
                                    <Grid item>
                                      <Chip
                                        label="02"
                                        size="small"
                                        sx={{
                                          bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark.dark : theme.palette.warning.dark,
                                          color: theme.palette.background.default
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                }
                              />
                            </ListItemButton>
                          )}
                          {user?.auth === 1 && (
                            <Link
                              to={'/user/credentials'}
                              style={{
                                textDecorationLine: 'none'
                              }}
                            >
                              <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 4}>
                                <ListItemIcon>
                                  <LockResetIcon stroke={1.5} size="1.3rem" />
                                </ListItemIcon>
                                <ListItemText primary={<Typography variant="body2">Changement mot de passe</Typography>} />
                              </ListItemButton>
                            </Link>
                          )}
                          {user?.role.includes('admin') && (
                            <ListItemButton
                              sx={{ borderRadius: `${borderRadius}px` }}
                              selected={selectedIndex === 4}
                              onClick={() => setSettingsOpen(!settingsOpen)}
                            >
                              <ListItemIcon>
                                <IconSettings stroke={1.5} size="1.3rem" />
                              </ListItemIcon>
                              <ListItemText primary={<Typography variant="body2">Paramètres</Typography>} />
                              {settingsOpen ? (
                                <IconChevronUp stroke={1.5} size="1rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                              ) : (
                                <IconChevronDown stroke={1.5} size="1rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                              )}
                            </ListItemButton>
                          )}
                          <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
                            {
                              <List
                                component="div"
                                disablePadding
                                sx={{
                                  position: 'relative',
                                  '&:after': {
                                    content: "''",
                                    position: 'absolute',
                                    left: '32px',
                                    top: 0,
                                    height: '100%',
                                    width: '1px',
                                    opacity: theme.palette.mode === 'dark' ? 0.2 : 1,
                                    background: theme.palette.mode === 'dark' ? theme.palette.dark.light : theme.palette.primary.light
                                  }
                                }}
                              >
                                <Link
                                  to={'/settings/societe'}
                                  style={{
                                    textDecorationLine: 'none'
                                  }}
                                >
                                  <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 4}>
                                    <ListItemIcon sx={{ my: 'auto', minWidth: 36 }}>
                                      {
                                        <FiberManualRecordIcon
                                          sx={{
                                            width: 6,
                                            height: 6
                                          }}
                                          fontSize={'medium'}
                                        />
                                      }
                                    </ListItemIcon>

                                    <ListItemText primary={<Typography variant="body2">Société</Typography>} />
                                  </ListItemButton>
                                </Link>
                                <Link
                                  to={'/settings/mode-facturation'}
                                  style={{
                                    textDecorationLine: 'none'
                                  }}
                                >
                                  <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 4}>
                                    <ListItemIcon sx={{ my: 'auto', minWidth: 36 }}>
                                      {
                                        <FiberManualRecordIcon
                                          sx={{
                                            width: 6,
                                            height: 6
                                          }}
                                          fontSize={'medium'}
                                        />
                                      }
                                    </ListItemIcon>

                                    <ListItemText primary={<Typography variant="body2">Mode Facturation</Typography>} />
                                  </ListItemButton>
                                </Link>
                                {/* <Link
                                  to={'/settings/marque-pac'}
                                  style={{
                                    textDecorationLine: 'none'
                                  }}
                                >
                                  <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 4}>
                                    <ListItemIcon sx={{ my: 'auto', minWidth: 36 }}>
                                      {
                                        <FiberManualRecordIcon
                                          sx={{
                                            width: 6,
                                            height: 6
                                          }}
                                          fontSize={'medium'}
                                        />
                                      }
                                    </ListItemIcon>

                                    <ListItemText primary={<Typography variant="body2">Marque Pac</Typography>} />
                                  </ListItemButton>
                                </Link> */}
                                <Link
                                  to={'/settings/calendrier'}
                                  style={{
                                    textDecorationLine: 'none'
                                  }}
                                >
                                  <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 4}>
                                    <ListItemIcon sx={{ my: 'auto', minWidth: 36 }}>
                                      {
                                        <FiberManualRecordIcon
                                          sx={{
                                            width: 6,
                                            height: 6
                                          }}
                                          fontSize={'medium'}
                                        />
                                      }
                                    </ListItemIcon>

                                    <ListItemText primary={<Typography variant="body2">Calendrier</Typography>} />
                                  </ListItemButton>
                                </Link>
                                <Link
                                  to={'/settings/current-pieces'}
                                  style={{
                                    textDecorationLine: 'none'
                                  }}
                                >
                                  <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 4}>
                                    <ListItemIcon sx={{ my: 'auto', minWidth: 36 }}>
                                      {
                                        <FiberManualRecordIcon
                                          sx={{
                                            width: 6,
                                            height: 6
                                          }}
                                          fontSize={'medium'}
                                        />
                                      }
                                    </ListItemIcon>
                                    <ListItemText primary={<Typography variant="body2">Références</Typography>} />
                                  </ListItemButton>
                                </Link>
                                <Link
                                  to={'/settings/jour-ferie'}
                                  style={{
                                    textDecorationLine: 'none'
                                  }}
                                >
                                  <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 4}>
                                    <ListItemIcon sx={{ my: 'auto', minWidth: 36 }}>
                                      {
                                        <FiberManualRecordIcon
                                          sx={{
                                            width: 6,
                                            height: 6
                                          }}
                                          fontSize={'medium'}
                                        />
                                      }
                                    </ListItemIcon>
                                    <ListItemText primary={<Typography variant="body2">Jours Fériés</Typography>} />
                                  </ListItemButton>
                                </Link>
                                <Link
                                  to={'/settings/preferences'}
                                  style={{
                                    textDecorationLine: 'none'
                                  }}
                                >
                                  <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 4}>
                                    <ListItemIcon sx={{ my: 'auto', minWidth: 36 }}>
                                      {
                                        <FiberManualRecordIcon
                                          sx={{
                                            width: 6,
                                            height: 6
                                          }}
                                          fontSize={'medium'}
                                        />
                                      }
                                    </ListItemIcon>
                                    <ListItemText primary={<Typography variant="body2">Préférences</Typography>} />
                                  </ListItemButton>
                                </Link>
                                {/* <Link
                                  to={'/articles/list'}
                                  style={{
                                    textDecorationLine: 'none'
                                  }}
                                >
                                  <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 4}>
                                    <ListItemIcon sx={{ my: 'auto', minWidth: 36 }}>
                                      {
                                        <FiberManualRecordIcon
                                          sx={{
                                            width: 6,
                                            height: 6
                                          }}
                                          fontSize={'medium'}
                                        />
                                      }
                                    </ListItemIcon>
                                    <ListItemText primary={<Typography variant="body2">Articles</Typography>} />
                                  </ListItemButton>
                                </Link> */}
                                <Link
                                  to={'/settings/mail'}
                                  style={{
                                    textDecorationLine: 'none'
                                  }}
                                >
                                  <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 4}>
                                    <ListItemIcon sx={{ my: 'auto', minWidth: 36 }}>
                                      {
                                        <FiberManualRecordIcon
                                          sx={{
                                            width: 6,
                                            height: 6
                                          }}
                                          fontSize={'medium'}
                                        />
                                      }
                                    </ListItemIcon>
                                    <ListItemText primary={<Typography variant="body2">Configuration E-mail</Typography>} />
                                  </ListItemButton>
                                </Link>
                                <Link
                                  to={'/users/list'}
                                  style={{
                                    textDecorationLine: 'none'
                                  }}
                                >
                                  <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 4}>
                                    <ListItemIcon sx={{ my: 'auto', minWidth: 36 }}>
                                      {
                                        <FiberManualRecordIcon
                                          sx={{
                                            width: 6,
                                            height: 6
                                          }}
                                          fontSize={'medium'}
                                        />
                                      }
                                    </ListItemIcon>
                                    <ListItemText primary={<Typography variant="body2">Utilisateurs</Typography>} />
                                  </ListItemButton>
                                </Link>
                                <Link
                                  to={'/admin/categories-articles'}
                                  style={{
                                    textDecorationLine: 'none'
                                  }}
                                >
                                  <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 4}>
                                    <ListItemIcon sx={{ my: 'auto', minWidth: 36 }}>
                                      {
                                        <FiberManualRecordIcon
                                          sx={{
                                            width: 6,
                                            height: 6
                                          }}
                                          fontSize={'medium'}
                                        />
                                      }
                                    </ListItemIcon>
                                    <ListItemText primary={<Typography variant="body2">Catégories Articles</Typography>} />
                                  </ListItemButton>
                                </Link>
                                <Link
                                  to={'/admin/categories-clients'}
                                  style={{
                                    textDecorationLine: 'none'
                                  }}
                                >
                                  <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 4}>
                                    <ListItemIcon sx={{ my: 'auto', minWidth: 36 }}>
                                      {
                                        <FiberManualRecordIcon
                                          sx={{
                                            width: 6,
                                            height: 6
                                          }}
                                          fontSize={'medium'}
                                        />
                                      }
                                    </ListItemIcon>
                                    <ListItemText primary={<Typography variant="body2">Catégories Clients</Typography>} />
                                  </ListItemButton>
                                </Link>
                                <Link
                                  to={'/logs'}
                                  style={{
                                    textDecorationLine: 'none'
                                  }}
                                >
                                  <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 4}>
                                    <ListItemIcon sx={{ my: 'auto', minWidth: 36 }}>
                                      {
                                        <FiberManualRecordIcon
                                          sx={{
                                            width: 6,
                                            height: 6
                                          }}
                                          fontSize={'medium'}
                                        />
                                      }
                                    </ListItemIcon>
                                    <ListItemText primary={<Typography variant="body2">Historique</Typography>} />
                                  </ListItemButton>
                                </Link>
                              </List>
                            }
                          </Collapse>

                          <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 4} onClick={handleLogout}>
                            <ListItemIcon>
                              <IconLogout stroke={1.5} size="1.3rem" />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body2">Se déconnecter</Typography>} />
                          </ListItemButton>
                        </List>
                      </Box>
                    </div>
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

export default ProfileSection;
