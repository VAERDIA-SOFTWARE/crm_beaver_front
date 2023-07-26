import frLocale from '@fullcalendar/core/locales/fr';
import SaveIcon from '@mui/icons-material/Save';
import { useEffect, useRef, useState, Fragment } from 'react';
// material-ui
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import { Autocomplete, Button, Dialog, FormControlLabel, SwipeableDrawer, Switch, TextField, useMediaQuery } from '@mui/material';

// third-party
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import AddEventForm from './AddEventForm';
import CalendarStyled from './CalendarStyled';
import Toolbar from './Toolbar';

// assets
import { LoadingButton } from '@mui/lab';
import { useDeleteInspection, useUpdateInspection } from 'services/inspections.service';
import { useGetInspectionsCalendar, useUpdateInspections } from 'services/lot-chantiers.service';
import { useQueryClient } from '@tanstack/react-query';
import EtatStaus from 'ui-component/cards/EtatStatus';
import InfoIcon from '@mui/icons-material/Info';
import Colors from 'ui-component/cards/Colors';
import useAuth from 'hooks/useAuth';
import { useGetUsers } from 'services/users.service';
import MaterialUISwitch from './SwitchMui';
import AdjustIcon from '@mui/icons-material/Adjust';

const Calendar = () => {
  // const dispatch = useDispatch();
  const calendarRef = useRef(null);
  const matchSm = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const queryClient = useQueryClient();
  const updateInspectionMutation = useUpdateInspection();
  const { logout, user } = useAuth();
  const [userId, setUserId] = useState({
    id: ' ',
    name: ' '
  });
  const [isEditModeOn, setIsEditModeOn] = useState(false);
  const [localInspections, setLocalInspections] = useState(null);
  const [localInspectionUpdates, setLocalInspectionUpdates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [enableFilter, setEnableFilter] = useState(false);
  const getTechniciensQuery = useGetUsers({ role: 'technicien', paginated: false });
  const getClientsQuery = useGetUsers({ role: 'client', paginated: false });

  const getInspectionsCalendarQuery = useGetInspectionsCalendar(userId?.id);
  const updateInspectionsMutation = useUpdateInspections(localInspectionUpdates);
  useEffect(() => {
    if (getInspectionsCalendarQuery.isSuccess) {
      const d = getInspectionsCalendarQuery.data?.map((e) => {
        return {
          ...e,
          id: e?.id,
          allDay: false,
          color: e?.color,
          description: e?.chantier?.ville,
          // start: sub(new Date(), { days: 12, hours: 0, minutes: 45 }),
          start: e?.deb_calendar,
          end: e?.fin_calendar,
          // end: sub(new Date(), { days: 12, hours: 0, minutes: 30 }),
          title: e?.chantier?.reference
        };
      });
      setLocalInspections(d);
    }
  }, [getInspectionsCalendarQuery.data, getInspectionsCalendarQuery.isSuccess, userId]);

  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(matchSm ? 'listWeek' : 'dayGridMonth');

  // calendar toolbar events
  const handleDateToday = () => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };
  const handleSelectedUser = (event, newValue) => {
    setUserId(newValue);
  };
  const handleViewChange = (newView) => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleDatePrev = () => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleDateNext = () => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  // calendar event select/add/edit/delete
  const handleRangeSelect = (arg) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.unselect();
    }

    setSelectedRange({
      start: arg.start,
      end: arg.end
    });
    setIsModalOpen(true);
  };

  const handleEventSelect = ({ arg }) => {
    if (arg.event.id) {
      // const selectEvent = events.find((_event) => _event.id === arg.event.id);
      // const selectEvent = getInspectionsQuery.data?.find((_event) => _event.id === +arg.event.id);
      const selectEvent = localInspections?.find((_event) => +_event.id === +arg.event.id);
      setSelectedEvent({
        ...selectEvent
        //  end: selectEvent?.fin_calendar, start: selectEvent?.date
      });
      setIsModalOpen(true);
    } else {
      setSelectedEvent(null);
    }
  };
  const handleEventUpdate = async ({ event }) => {
    try {
      const selectedEvent = getInspectionsCalendarQuery.data?.find((_event) => _event.id === +event.id);
      const a = [
        ...localInspectionUpdates,
        { ...selectedEvent, debut: event?.start, fin: event?.end, start: event?.start, end: event?.end }
      ].filter((v, i, a) => a.findLastIndex((v2) => v2.id === v.id) === i);

      setLocalInspectionUpdates(a);

      // dispatch(
      //   updateEvent({
      //     eventId: event.id,
      //     update: {
      //       allDay: event.allDay,
      //       start: event.start,
      //       end: event.end
      //     }
      //   })
      // );
    } catch (err) {
      console.error(err);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedRange(null);
  };

  const handleEventCreate = async (data) => {
    // dispatch(addEvent(data));
    handleModalClose();
  };

  const handleUpdateEvent = async (eventId, data) => {
    // dispatch(updateEvent({ eventId, data }));
    await updateInspectionMutation.mutateAsync({ id: eventId, values: data });
    queryClient.invalidateQueries();

    handleModalClose();
    setLocalInspections(null);
    setIsEditModeOn(false);
    setLocalInspectionUpdates(null);
  };

  const deleteInspectionMutation = useDeleteInspection();
  const [togleState, setTogleState] = useState(false);

  const handleEventDelete = async (id) => {
    try {
      await deleteInspectionMutation.mutateAsync({ inspectionId: id });

      // dispatch(removeEvent(id));
      handleModalClose();
      setLocalInspections(null);
      setIsEditModeOn(false);
    } catch (err) {
      console.error(err);
    }
  };
  const handleChange = (event) => {
    setEnableFilter(event.target.checked);
    setUserId({
      id: '',
      name: ''
    });
  };
  const handleAddClick = () => {
    setIsModalOpen(true);
  };
  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setTogleState(open);
  };

  return (
    <MainCard
      sx={
        {
          // backgroundColor: isEditModeOn ? '#dcfce7' : 'initial'
        }
      }
      title="Calendrier des Interventions"
      secondary={
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {/* <Button color="secondary" variant="contained" onClick={handleAddClick}>
            <AddAlarmTwoToneIcon fontSize="small" sx={{ mr: 0.75 }} />
            Add New Event
          </Button> */}
          {isEditModeOn && (
            <LoadingButton
              loadingPosition="start"
              startIcon={<SaveIcon />}
              loading={updateInspectionsMutation.isLoading}
              color={'success'}
              variant="contained"
              onClick={async () => {
                try {
                  await updateInspectionsMutation.mutateAsync();
                  queryClient.invalidateQueries();
                  setIsEditModeOn((e) => !isEditModeOn);
                } catch (error) {}
              }}
            >
              {/* <SaveIcon fontSize="small" sx={{ mr: 0.75 }} /> */}
              Sauvegarder les modifications
            </LoadingButton>
          )}
          {user?.role.includes('admin') && (
            <LoadingButton
              loadingPosition="start"
              startIcon={
                !isEditModeOn ? <EditIcon fontSize="small" sx={{ mr: 0.75 }} /> : <EditOffIcon fontSize="small" sx={{ mr: 0.75 }} />
              }
              loading={getInspectionsCalendarQuery.isLoading}
              disabled={getInspectionsCalendarQuery.isLoading}
              color={'secondary'}
              variant="contained"
              onClick={async () => {
                const d = await getInspectionsCalendarQuery.data?.map((e) => {
                  return {
                    ...e,

                    id: e?.id,
                    allDay: false,
                    color: e?.color,
                    description: e?.chantier?.ville,
                    // start: sub(new Date(), { days: 12, hours: 0, minutes: 45 }),
                    start: e?.deb_calendar,
                    end: e?.fin_calendar,
                    // end: sub(new Date(), { days: 12, hours: 0, minutes: 30 }),
                    title: e?.chantier?.reference
                  };
                });

                setLocalInspections(d);

                setIsEditModeOn((e) => !isEditModeOn);
              }}
            >
              {!isEditModeOn && 'Editer'}
              {isEditModeOn && 'Quitter sans enregistrer les modifications'}
            </LoadingButton>
          )}
        </div>
      }
    >
      <div
        style={{
          display: 'flex',
          gap: 6,
          marginBottom: 14,
          justifyContent: 'space-between',
          flexWrap: 'wrap'
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'center'
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 5,
              alignItems: 'center'
            }}
          >
            <div
              style={{
                height: 14,
                width: 14,
                backgroundColor: '#229954',
                borderRadius: 9999
              }}
            />
            Interventions Validées
          </div>
          <div
            style={{
              display: 'flex',
              gap: 6,
              alignItems: 'center'
            }}
          >
            <div
              style={{
                height: 14,
                width: 14,
                backgroundColor: '#f1c40f',
                borderRadius: 9999
              }}
            />
            Interventions Proposées
          </div>
        </div>
        {/* {enableFilter} */}

        {user?.role.includes('admin') && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '16px' }}>
                <div style={{ marginRight: '2rem', opacity: enableFilter ? '50%' : '', color: enableFilter ? '' : '#2196f3' }}>
                  Technicien
                </div>
                <FormControlLabel control={<MaterialUISwitch onChange={handleChange} sx={{ m: 1 }} checked={enableFilter} />} />
                <div style={{ marginRight: '2rem', opacity: enableFilter ? '' : '50%', color: enableFilter ? '#2196f3' : '' }}>Client</div>
              </div>
              {/* <MaterialUISwitch checked={enableFilter} onChange={handleChange} /> */}
              <div style={{ marginRight: '2rem' }}>
                {enableFilter ? (
                  <Autocomplete
                    key="Client"
                    sx={{ width: '13rem' }}
                    onChange={(event, newValue) => {
                      handleSelectedUser(event, newValue);
                    }}
                    options={getClientsQuery?.data || []}
                    getOptionLabel={(option) => {
                      return option?.name;
                    }}
                    renderInput={(params) => <TextField variant="standard" {...params} label={`Sélectionner un Client`} />}
                  />
                ) : (
                  <Autocomplete
                    key="Technicien"
                    sx={{ width: '13rem' }}
                    onChange={(event, newValue) => {
                      handleSelectedUser(event, newValue);
                    }}
                    options={getTechniciensQuery?.data || []}
                    getOptionLabel={(option) => {
                      return option?.name;
                    }}
                    renderInput={(params) => <TextField variant="standard" {...params} label={`Sélectionner un Technicien `} />}
                  />
                )}
              </div>
            </div>
            {/* <Fragment key="right">
              <Button
                sx={{
                  alignSelf: 'center'
                }}
                onClick={handleSelectedUser}
              >
                <InfoIcon />
              </Button>
              <SwipeableDrawer anchor="right" open={togleState} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
                <Colors />
              </SwipeableDrawer>
            </Fragment> */}
          </>
        )}
      </div>
      <CalendarStyled>
        <Toolbar
          date={date}
          view={view}
          onClickNext={handleDateNext}
          onClickPrev={handleDatePrev}
          onClickToday={handleDateToday}
          onChangeView={handleViewChange}
        />
        <SubCard
          sx={{
            overflow: 'auto'
          }}
        >
          <FullCalendar
            eventContent={(event) => {
              return (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: 5,
                    cursor: 'pointer'
                  }}
                >
                  {event?.event.extendedProps?.technicien?.couleur && (
                    <div
                      style={{
                        height: 10,
                        width: 10,
                        borderRadius: 9999,
                        backgroundColor: event?.event.extendedProps?.technicien?.couleur
                      }}
                    ></div>
                  )}
                  <b>{event.timeText}</b>
                  <div>{event.event.title}</div>
                </div>
              );
            }}
            validRange={
              {
                // start: new Date()
                // start: '2023-30-03'
                // end: '2023-30-06'
              }
            }
            locales={[frLocale]}
            weekends
            editable={isEditModeOn ? true : false}
            droppable
            selectable
            events={
              localInspections ||
              (getInspectionsCalendarQuery.data &&
                getInspectionsCalendarQuery.data?.map((e) => {
                  return {
                    ...e,
                    id: e?.id,
                    allDay: false,
                    color: e?.color,
                    description: e?.chantier?.ville,
                    // start: sub(new Date(), { days: 12, hours: 0, minutes: 45 }),
                    start: e?.deb_calendar,
                    end: e?.fin_calendar,
                    // end: sub(new Date(), { days: 12, hours: 0, minutes: 30 }),
                    title: e?.chantier?.reference
                  };
                })) ||
              []
            }
            timeZone="UTC"
            eventTimeFormat={{
              hour: 'numeric',
              minute: '2-digit',
              // meridiem: true,
              hour12: false
            }}
            ref={calendarRef}
            rerenderDelay={10}
            initialDate={date}
            initialView={view}
            dayMaxEventRows={3}
            eventDisplay="block"
            headerToolbar={false}
            // titleFormat={{
            //   year: 'numeric',
            //   month: 'long',
            //   day: 'numeric'
            // }}
            allDayMaintainDuration
            eventResizableFromStart
            select={false && isEditModeOn && handleRangeSelect}
            eventDrop={isEditModeOn && handleEventUpdate}
            eventClick={(arg) => handleEventSelect({ arg })}
            eventResize={isEditModeOn && handleEventUpdate}
            height={matchSm ? 'auto' : 720}
            plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
          />
        </SubCard>
      </CalendarStyled>

      {/* Dialog renders its body even if not open */}
      <Dialog maxWidth="sm" fullWidth onClose={handleModalClose} open={isModalOpen} sx={{ '& .MuiDialog-paper': { p: 0 } }}>
        {'isModalOpen' && (
          <>
            <AddEventForm
              editMode={isEditModeOn}
              event={selectedEvent}
              range={selectedRange}
              onCancel={handleModalClose}
              handleDelete={handleEventDelete}
              handleCreate={handleEventCreate}
              handleUpdate={handleUpdateEvent}
            />
          </>
        )}
      </Dialog>
    </MainCard>
  );
};

export default Calendar;
