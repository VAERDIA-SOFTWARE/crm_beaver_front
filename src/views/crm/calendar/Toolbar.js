import PropTypes from 'prop-types';
import frLocale from 'date-fns/locale/fr';

// material-ui
import { Button, ButtonGroup, Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material';

// third-party
import { format } from 'date-fns';

// assets
import { IconChevronLeft, IconChevronRight, IconLayoutGrid, IconTemplate, IconLayoutList, IconListNumbers } from '@tabler/icons';

// constant
const viewOptions = [
  {
    label: 'Mois',
    value: 'dayGridMonth',
    icon: IconLayoutGrid
  },
  {
    label: 'Semaine',
    value: 'timeGridWeek',
    icon: IconTemplate
  },
  {
    label: 'Jour',
    value: 'timeGridDay',
    icon: IconLayoutList
  },
  {
    label: 'Agenda',
    value: 'listWeek',
    icon: IconListNumbers
  }
];

// ==============================|| CALENDAR TOOLBAR ||============================== //

const Toolbar = ({ date, view, onClickNext, onClickPrev, onClickToday, onChangeView, ...others }) => {
  // const toolbarTitle=format(date, 'MMMM yyyy', { locale: frLocale })
  let toolbarTitle = format(date, 'MMMM yyyy', { locale: frLocale });
  toolbarTitle = toolbarTitle.charAt(0).toUpperCase() + toolbarTitle.slice(1);

  return (
    <Grid alignItems="center" container justifyContent="space-between" spacing={3} {...others} sx={{ pb: 3 }}>
      <Grid item>
        <Button variant="outlined" onClick={onClickToday}>
          Aujourd'hui
        </Button>
      </Grid>
      <Grid item>
        <Stack direction="row" alignItems="center" spacing={3}>
          <IconButton onClick={onClickPrev} size="large">
            <IconChevronLeft />
          </IconButton>
          <Typography variant="h3" color="textPrimary">
            {toolbarTitle}
          </Typography>
          <IconButton onClick={onClickNext} size="large">
            <IconChevronRight />
          </IconButton>
        </Stack>
      </Grid>
      <Grid item>
        <ButtonGroup variant="outlined" aria-label="outlined button group">
          {viewOptions.map((viewOption) => {
            const Icon = viewOption.icon;
            return (
              <Tooltip title={viewOption.label} key={viewOption.value}>
                <Button
                  disableElevation
                  variant={viewOption.value === view ? 'contained' : 'outlined'}
                  onClick={() => onChangeView(viewOption.value)}
                >
                  <Icon stroke="2" size="1.3rem" />
                </Button>
              </Tooltip>
            );
          })}
        </ButtonGroup>
      </Grid>
    </Grid>
  );
};

Toolbar.propTypes = {
  date: PropTypes.object,
  view: PropTypes.string,
  onClickNext: PropTypes.func,
  onClickPrev: PropTypes.func,
  onClickToday: PropTypes.func,
  onChangeView: PropTypes.func
};

export default Toolbar;
