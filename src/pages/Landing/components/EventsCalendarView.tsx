import { AppointmentModel, ViewState } from '@devexpress/dx-react-scheduler';
import { Appointments, DateNavigator, MonthView, Scheduler, Toolbar } from '@devexpress/dx-react-scheduler-material-ui';
import { Button, ClickAwayListener, Popper, useTheme } from '@mui/material';
import { endOfMonth, parseISO, startOfMonth } from 'date-fns';
import { ReactNode, useEffect, useMemo, useState } from 'react';

import { Category, EventList } from 'types';
import { Groups } from 'types/Enums';

import { useEvents } from 'hooks/Event';
import { useAnalytics } from 'hooks/Utils';

import EventsCalendarPopover from 'pages/Landing/components/EventsCalendarPopover';

import Paper from 'components/layout/Paper';

type Filters = {
  start_range?: string;
  end_range?: string;
};
export type EventsCalendarViewProps = {
  category?: Category['id'];
};

type AppointmentProps = {
  children: ReactNode;
  data: AppointmentModel;
};

const Appointment = ({ children, data }: AppointmentProps) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  const getColor = (event: EventList) => theme.palette.colors[event.organizer?.slug.toLowerCase() === Groups.NOK.toLowerCase() ? 'nok_event' : 'other_event'];
  return (
    <>
      <Button onClick={handleClick} sx={{ width: '100%', height: '100%', textAlign: 'left', textTransform: 'none' }}>
        <Appointments.Appointment data={data} draggable={false} resources={[]} style={{ backgroundColor: getColor(data as unknown as EventList) }}>
          {children}
        </Appointments.Appointment>
      </Button>
      <Popper
        anchorEl={anchorEl}
        modifiers={[
          {
            name: 'flip',
            enabled: false,
          },
        ]}
        open={open}
        placement='top'
        style={{ zIndex: 1000000 }}>
        <ClickAwayListener onClickAway={handleClickAway}>
          <div>
            <EventsCalendarPopover id={Number(data.id)} />
          </div>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

const EventsCalendarView = ({ category }: EventsCalendarViewProps) => {
  const { event } = useAnalytics();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filters, setFilters] = useState<Filters>();
  const { data } = useEvents({ category, ...filters });
  const events = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);
  useEffect(() => {
    event('open', 'calendar', 'Open calendar on landing page');
  }, [event]);

  useEffect(() => {
    const firstDay = startOfMonth(currentDate);
    const lastDay = endOfMonth(currentDate);
    setFilters({ end_range: lastDay.toJSON(), start_range: firstDay.toJSON() });
  }, [currentDate]);
  const displayedEvents = useMemo(
    () =>
      events.map(
        (event) =>
          ({
            ...event,
            startDate: parseISO(event.start_date),
            endDate: parseISO(event.end_date),
          } as AppointmentModel),
      ),
    [events],
  );
  return (
    <Paper noPadding sx={{ '& div:first-of-type': { whiteSpace: 'break-spaces' }, '& table': { minWidth: 'unset' } }}>
      <Scheduler data={displayedEvents} firstDayOfWeek={1} locale='no-NB'>
        <ViewState currentDate={currentDate} onCurrentDateChange={setCurrentDate} />
        <MonthView />
        <Toolbar />
        <DateNavigator />
        <Appointments appointmentComponent={Appointment} />
      </Scheduler>
    </Paper>
  );
};

export default EventsCalendarView;
