import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { styled } from '@mui/material/styles';
import {
  Button,
  CardContent,
  Chip,
  Dialog,
  DialogContentText,
  Divider,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// assets
import CloseIcon from '@mui/icons-material/Close';
import { gridSpacing } from 'store/constant';
import { Box, Stack } from '@mui/system';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, Menu, MenuItem } from '@mui/material';

// project imports
// assets
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import NotInterestedTwoToneIcon from '@mui/icons-material/NotInterestedTwoTone';
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';
import Avatar from 'ui-component/extended/Avatar';
import SubCard from 'ui-component/cards/SubCard';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

const BootstrapDialogTitle = ({ children, onClose, ...other }) => (
  <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
    {children}
    {onClose ? (
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 10,
          top: 10,
          color: (theme) => theme.palette.grey[500]
        }}
      >
        <CloseIcon />
      </IconButton>
    ) : null}
  </DialogTitle>
);

BootstrapDialogTitle.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node
};

export default function MapsDialog({ open, setOpen, user }) {
  console.log(user);
  // const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open max-width dialog
      </Button> */}
      <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleClose}>
        {open && (
          <>
            <DialogTitle>Details Sur l'emplacement du technicien</DialogTitle>
            <Divider />
            <DialogContent>
              <UserDetailsCard user={user} />
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );

  // return (
  //   <div>
  //     <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
  //       <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
  //         Details sur le collaborateur
  //       </BootstrapDialogTitle>
  //       <DialogContent dividers>
  //         <UserDetailsCard user={user} />
  //       </DialogContent>
  //       <DialogActions>
  //         <Button autoFocus onClick={handleClose}>
  //           Save changes
  //         </Button>
  //       </DialogActions>
  //     </BootstrapDialog>
  //   </div>
  // );
}

// const avatarImage = require.context('assets/images/profile', true);

// ==============================|| USER DETAILS CARD ||============================== //

const UserDetailsCard = ({ user }) => {
  console.log(user);
  const theme = useTheme();
  const avatarProfile = 'assets/images/users/avatar-2.png';

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid item lg={4} xs={12}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Avatar alt="User 1" src={user.avatar} />
        </Grid>
        <Grid item xs zeroMinWidth>
          <Typography align="left" variant="subtitle1">
            {user.name}
          </Typography>
          <Typography align="left" variant="subtitle2">
            {user.role}
          </Typography>
        </Grid>
      </Grid>
      <List component="nav" aria-label="main mailbox folders">
        <ListItemButton>
          <ListItemText primary={<Typography variant="subtitle1">Emplacement</Typography>} />
          <ListItemSecondaryAction>
            <Typography variant="subtitle2" align="right">
              {user.marker.emplacement}
            </Typography>
          </ListItemSecondaryAction>
        </ListItemButton>
        <Divider />
        <ListItemButton>
          <ListItemText primary={<Typography variant="subtitle1">Nom Client</Typography>} />
          <ListItemSecondaryAction>
            <Typography variant="subtitle2" align="right">
              {user.nomClient}
            </Typography>
          </ListItemSecondaryAction>
        </ListItemButton>
        <Divider />
        <ListItemButton>
          <ListItemText primary={<Typography variant="subtitle1">Nom du fichier</Typography>} />
          <ListItemSecondaryAction>
            <Typography variant="subtitle2" align="right">
              {user.fiche_name}
            </Typography>
          </ListItemSecondaryAction>
        </ListItemButton>
      </List>
      <CardContent></CardContent>
    </Grid>
  );
};

UserDetailsCard.propTypes = {
  about: PropTypes.string,
  avatar: PropTypes.string,
  contact: PropTypes.string,
  email: PropTypes.string,
  location: PropTypes.string,
  name: PropTypes.string,
  role: PropTypes.string
};
