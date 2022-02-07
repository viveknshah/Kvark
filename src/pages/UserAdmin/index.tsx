import MembersIcon from '@mui/icons-material/PlaylistAddCheckRounded';
import WaitingIcon from '@mui/icons-material/PlaylistAddRounded';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { makeStyles } from 'makeStyles';
import { Fragment, useEffect, useMemo, useState } from 'react';

import { useUsers } from 'hooks/User';

import PersonListItem, { PersonListItemLoading } from 'pages/UserAdmin/components/PersonListItem';

import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import Tabs from 'components/layout/Tabs';
import { PrimaryTopBox } from 'components/layout/TopBox';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import Page from 'components/navigation/Page';

const useStyles = makeStyles()((theme) => ({
  content: {
    margin: '-60px auto 60px',
    position: 'relative',
  },
  filterContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridGap: theme.spacing(1),
    margin: theme.spacing(2, 0, 1),
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: '1fr',
    },
  },
}));

const USER_CLASSES = ['Alle', '1. klasse', '2. klasse', '3. klasse', '4. klasse', '5. klasse', 'Alumni'];
const USER_STUDIES = ['Alle', 'Dataing', 'DigFor', 'DigSec', 'DigSam', 'Drift', 'Info'];

const UserAdmin = () => {
  const { classes } = useStyles();
  const membersTab = { value: 'members', label: 'Medlemmer', icon: MembersIcon };
  const waitingTab = { value: 'waiting', label: 'Ventende', icon: WaitingIcon };
  const tabs = [membersTab, waitingTab];
  const [tab, setTab] = useState(membersTab.value);
  const [userClassChoice, setUserClassChoice] = useState(0);
  const [userStudyChoice, setUserStudyChoice] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const filters = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: Record<string, any> = {};
    if (searchInput !== '') {
      filters.search = searchInput;
    }
    if (userStudyChoice !== 0) {
      filters.user_study = userStudyChoice;
    }
    if (userClassChoice !== 0) {
      filters.user_class = userClassChoice === 6 ? -1 : userClassChoice;
    }
    return filters;
  }, [tab, userClassChoice, userStudyChoice, searchInput]);
  const { data, error, hasNextPage, fetchNextPage, isLoading, isFetching } = useUsers({ is_TIHLDE_member: tab === membersTab.value, ...filters });
  const isEmpty = useMemo(() => (data !== undefined ? !data.pages.some((page) => Boolean(page.results.length)) : false), [data]);
  const membersAmount = `${data?.pages[0]?.count || '0'} medlemmer 
  ${userClassChoice !== 0 || userStudyChoice !== 0 ? 'i' : 'totalt'}
  ${userClassChoice !== 0 ? USER_CLASSES[userClassChoice] : ''} 
  ${userStudyChoice !== 0 ? USER_STUDIES[userStudyChoice] : ''}`;

  useEffect(() => {
    const timer = setTimeout(() => setSearchInput(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <Page banner={<PrimaryTopBox />} options={{ title: 'Brukeradmin' }}>
      <Paper className={classes.content}>
        <Typography variant='h1'>Brukeradmin</Typography>
        <Typography>{membersAmount}</Typography>
        <Tabs selected={tab} setSelected={setTab} tabs={tabs} />
        <div className={classes.filterContainer}>
          <TextField fullWidth label='Klasser' onChange={(e) => setUserClassChoice(Number(e.target.value))} select value={userClassChoice} variant='outlined'>
            {USER_CLASSES.map((value, index) => (
              <MenuItem key={index} value={index}>
                {value}
              </MenuItem>
            ))}
          </TextField>
          <TextField fullWidth label='Studie' onChange={(e) => setUserStudyChoice(Number(e.target.value))} select value={userStudyChoice} variant='outlined'>
            {USER_STUDIES.map((value, index) => (
              <MenuItem key={index} value={index}>
                {value}
              </MenuItem>
            ))}
          </TextField>
          <TextField fullWidth label='Søk' onChange={(e) => setSearch(e.target.value)} placeholder='Skriv her' value={search} variant='outlined' />
        </div>
        {isLoading && <PersonListItemLoading />}
        {isEmpty && <NotFoundIndicator header='Fant ingen brukere' />}
        {error && <Paper>{error.detail}</Paper>}
        {data !== undefined && (
          <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
            {data.pages.map((page, i) => (
              <Fragment key={i}>
                {page.results.map((user) => (
                  <PersonListItem is_TIHLDE_member={tab === membersTab.value} key={user.user_id} user={user} />
                ))}
              </Fragment>
            ))}
          </Pagination>
        )}
      </Paper>
    </Page>
  );
};

export default UserAdmin;
