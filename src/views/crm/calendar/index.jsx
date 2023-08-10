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
import { useGetInspectionsCalendar, useUpdateCalendarInspections, useUpdateInspections } from 'services/lot-chantiers.service';
import { useQueryClient } from '@tanstack/react-query';
import EtatStaus from 'ui-component/cards/EtatStatus';
import InfoIcon from '@mui/icons-material/Info';
import Colors from 'ui-component/cards/Colors';
import useAuth from 'hooks/useAuth';
import { useGetUsers } from 'services/users.service';
import MaterialUISwitch from './SwitchMui';
import AdjustIcon from '@mui/icons-material/Adjust';
// import { useGetClients } from 'services/clients.service';
import { useGetSettingsPreferences } from 'services/settings.service';
import { useUpdateProposition } from 'services/inspections.service';
import { useGetStateByModel } from 'services/state.service';
import moment from 'moment/moment';

const Calendar = () => {
  // const dispatch = useDispatch();
  const calendarRef = useRef(null);
  const matchSm = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const queryClient = useQueryClient();
  const updatePropisitionMutation = useUpdateProposition();
  const updateInspectionMutation = useUpdateInspection();
  const { logout, user } = useAuth();
  const [userId, setUserId] = useState({
    id: '',
    name: ''
  });
  const [clientId, setClientId] = useState({
    id: '',
    entitled: ''
  });
  const [isEditModeOn, setIsEditModeOn] = useState(false);
  const [localInspections, setLocalInspections] = useState(null);
  const [localInspectionUpdates, setLocalInspectionUpdates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [enableFilter, setEnableFilter] = useState(false);
  const getTechniciensQuery = useGetUsers({ role: 'collaborator', paginated: false });
  const getClientsQuery = useGetUsers({ paginated: false, role: 'client' });
  // const interventionCOlor = ['#229954', '#f1c40f'];

  const getInspectionsCalendarQuery = useGetInspectionsCalendar({ userId: userId?.id, clientId: clientId?.id });
  const updateInspectionsMutation = useUpdateCalendarInspections(localInspectionUpdates);
  const useGetSettingsPreferencesQuery = useGetSettingsPreferences();
  const settingsPreferencesData = useGetSettingsPreferencesQuery.data;
  const getStatusQueryIntervention = useGetStateByModel('DIntervention');
  const statusDataIntervention = getStatusQueryIntervention?.data;
  const getStatusQueryProposition = useGetStateByModel('DInterventionProposer');
  const statusDataProposition = getStatusQueryProposition?.data;
  useEffect(() => {
    if ((getInspectionsCalendarQuery.isSuccess, getStatusQueryProposition.isSuccess, getStatusQueryIntervention.isSuccess)) {
      const d = getInspectionsCalendarQuery.data?.map((e) => {
        return {
          ...e,
          id: e?.id,
          allDay: false,
          // color: e?.p_status_id === 1 ? interventionCOlor[1] : interventionCOlor[0],
          color: e?.collaborator?.couleur,
          bgColor: e?.state?.couleur,
          // start: sub(new Date(), { days: 12, hours: 0, minutes: 45 }),
          start: moment(e?.deb_calendar).utc().format('YYYY-MM-DD HH:mm:ss'),
          end: moment(e?.fin_calendar).utc().format('YYYY-MM-DD HH:mm:ss'),
          // end: sub(new Date(), { days: 12, hours: 0, minutes: 30 }),
          title: e?.client?.name,
          startEditable: isEditModeOn && e?.etat === 0 ? true : false,
          editable: isEditModeOn && e?.etat === 0 ? true : false
        };
      });
      setLocalInspections(d);
    }
  }, [
    getInspectionsCalendarQuery.data,
    settingsPreferencesData,
    useGetSettingsPreferencesQuery.isSuccess,
    getInspectionsCalendarQuery.isSuccess,
    userId,
    isEditModeOn
  ]);

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
  const handleSelectedUser = (name, newValue) => {
    if (name === 'technicien') {
      setUserId(newValue);
      setClientId(null);
      return 0;
    }
    setClientId(newValue);
    setUserId(null);
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
      // console.log(selectEvent);
      setIsModalOpen(true);
    } else {
      setSelectedEvent(null);
    }
  };
  const handleEventUpdate = async ({ event }) => {
    try {
      const start = event?._instance?.range?.start?.toUTCString();
      const end = event?._instance?.range?.end?.toUTCString();

      const selectedEvent = getInspectionsCalendarQuery.data?.find((_event) => _event.id === +event.id);
      const a = [...localInspectionUpdates, { ...selectedEvent, debut: start, fin: end, start: event?.start, end: event?.end }].filter(
        (v, i, a) => a.findLastIndex((v2) => v2.id === v.id) === i
      );
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
      console.error(err, 'event');
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
    console.log(data);
    // dispatch(updateEvent({ eventId, data }));
    if (data?.intervention === 1) await updateInspectionMutation.mutateAsync({ id: eventId, values: { ...data } });
    if (data?.intervention === 0) await updatePropisitionMutation.mutateAsync({ id: eventId, values: { ...data } });
    queryClient.invalidateQueries();
    handleModalClose();
    setLocalInspections([]);
    setIsEditModeOn(false);
    setLocalInspectionUpdates([]);
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
  // const handleAddClick = () => {
  //   setIsModalOpen(true);
  // };
  // const toggleDrawer = (open) => (event) => {
  //   if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
  //     return;
  //   }

  //   setTogleState(open);
  // };
  return (
    <MainCard
      headerColor={true}
      title="Calendrier des interventions"
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
                  setLocalInspectionUpdates([]);
                } catch (error) {}
              }}
            >
              {/* <SaveIcon fontSize="small" sx={{ mr: 0.75 }} /> */}
              Sauvegarder les modifications
            </LoadingButton>
          )}
          {user?.role.includes('admin') && (
            <LoadingButton
              color={isEditModeOn ? 'error' : 'success'}
              loadingPosition="start"
              startIcon={
                !isEditModeOn ? <EditIcon fontSize="small" sx={{ mr: 0.75 }} /> : <EditOffIcon fontSize="small" sx={{ mr: 0.75 }} />
              }
              loading={getInspectionsCalendarQuery.isLoading}
              disabled={getInspectionsCalendarQuery.isLoading}
              // color={'secondary'}
              variant="contained"
              onClick={async () => {
                const d = getInspectionsCalendarQuery.data?.map((e) => {
                  return {
                    ...e,

                    id: e?.id,
                    allDay: false,
                    color: e?.collaborator?.couleur,
                    bgColor: e?.state?.couleur,
                    description: e?.chantier?.ville,
                    // start: sub(new Date(), { days: 12, hours: 0, minutes: 45 }),
                    start: moment(e?.deb_calendar).utc().format('YYYY-MM-DD HH:mm:ss'),
                    end: moment(e?.fin_calendar).utc().format('YYYY-MM-DD HH:mm:ss'),
                    // end: sub(new Date(), { days: 12, hours: 0, minutes: 30 }),
                    title: e?.client?.name,
                    startEditable: isEditModeOn && e?.etat === 0 ? true : false,
                    editable: isEditModeOn && e?.etat === 0 ? true : false
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
          {/* <div
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
                backgroundColor: settingsPreferencesData?.proposition_color,
                borderRadius: 9999
              }}
            />
            Intervention Proposées
          </div> */}
          {statusDataProposition?.map((item) => (
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
                  backgroundColor: item?.couleur,
                  borderRadius: 9999
                }}
              />
              {item?.nom}
            </div>
          ))}
          {statusDataIntervention?.map((item) => (
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
                  backgroundColor: item?.couleur,
                  borderRadius: 9999
                }}
              />
              {item?.nom}
            </div>
          ))}
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
                    name="Client"
                    onChange={(event, newValue) => {
                      handleSelectedUser('client', newValue);
                    }}
                    options={getClientsQuery?.data || []}
                    getOptionLabel={(option) => {
                      return option?.name;
                    }}
                    renderInput={(params) => <TextField variant="standard" {...params} label={`Sélectionner un Client`} />}
                  />
                ) : (
                  <Autocomplete
                    name="Technicien"
                    key="Technicien"
                    sx={{ width: '13rem' }}
                    onChange={(event, newValue) => {
                      handleSelectedUser('technicien', newValue);
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
                  <div
                    style={{
                      height: 10,
                      width: 10,
                      borderRadius: 9999,
                      backgroundColor: event?.event?._def?.extendedProps?.state?.couleur
                    }}
                  ></div>
                  {/* <input type="button" onClick={() => console.log()} /> */}
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
                    color: e?.collaborator?.couleur,
                    bgColor: e?.state?.couleur,
                    description: e?.chantier?.ville,
                    // start: sub(new Date(), { days: 12, hours: 0, minutes: 45 }),
                    start: moment(e?.deb_calendar).utc().format('YYYY-MM-DD HH:mm:ss'),
                    end: moment(e?.fin_calendar).utc().format('YYYY-MM-DD HH:mm:ss'),
                    // end: sub(new Date(), { days: 12, hours: 0, minutes: 30 }),
                    title: e?.client?.name,
                    startEditable: isEditModeOn && e?.etat === 0 ? true : false,
                    editable: isEditModeOn && e?.etat === 0 ? true : false
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
            // eventDrop={isEditModeOn && handleEventUpdate}
            eventDrop={(info) => {
              if (isEditModeOn) {
                let dateNow = new Date();

                // remove the time part from current date
                dateNow.setHours(0, 0, 0, 0);

                if (info.event.start < dateNow) {
                  info.revert();
                } else {
                  // if the event is moved to the future, handle the update
                  handleEventUpdate(info);
                }
              }
            }}
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
