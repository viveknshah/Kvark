import React, {Fragment} from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material UI Components
import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';

// Icons
import AddIcon from '@material-ui/icons/Add';
import DownloadIcon from '@material-ui/icons/CloudDownload';

const SIDEBAR_WIDTH = 300;

const styles = (theme) => ({
    sidebar: {
        paddingTop: 64,
        position: 'fixed',
        left: 0, top: 0, bottom: 0,
        width: SIDEBAR_WIDTH,
        

        '@media only screen and (max-width: 800px)': {
            position: 'static',
            width: '100%',
            padding: 0,
        }
    },
    sidebarContent: {
        maxHeight: '100%',
        overflowY: 'auto',
    },
    sidebarTop: {
        backgroundColor: 'whitesmoke',
        padding: '10px 5px 10px 12px',
        position: 'sticky',
        top: 0,
        zIndex: 200,
    },
    miniTop: {
        padding: '5px 5px 5px 12px',
    },
    jobpostItem: {
        padding: '10px 10px',
        textAlign: 'left',
    },
    selected: {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
    },
});

const JobPostItem = withStyles(styles, {withTheme: true})((props) => {
    const {classes} = props;
    return (
        <Fragment>
            <ButtonBase onClick={props.onClick}>
                <Grid className={classNames(classes.jobpostItem, (props.selected)? classes.selected : '' )} container direction='row' alignItems='center' justify='space-between'>
                    <Grid container direction='column' justify='center'>
                        <Typography variant='subtitle1' color='inherit'>{props.title}</Typography>
                        <Typography variant='caption'  color='inherit'>{props.location}</Typography>
                    </Grid>
                </Grid>
            </ButtonBase>
        <Divider/>
        </Fragment>
    );
});

JobPostItem.propTypes = {
    title: PropTypes.string,
    location: PropTypes.string,
};

const JobPostSidebar = (props) => {
    const {classes} = props;

    return (
        <Paper className={classes.sidebar}>
            <Grid className={classNames(classes.sidebarContent, 'noScrollbar')} container direction='column' wrap='nowrap'>
                <Grid className={classNames(classes.sidebarTop)} container direction='row' wrap='nowrap' alignItems='center' justify='space-between'>
                    <Typography variant='h6' color='inherit'>Annonser</Typography>
                    <IconButton onClick={props.resetEventState}><AddIcon/></IconButton>
                </Grid>
                {props.jobposts.map((value, index) => (
                    <JobPostItem
                        key={index}
                        selected={value.id === props.selectedJobPostId}
                        onClick={() => props.onEventClick(value)}
                        title={value.title}
                        location={value.location} />
                ))}
                <Grid className={classNames(classes.sidebarTop, classes.miniTop)} container direction='row' wrap='nowrap' alignItems='center' justify='space-between'>
                    <Typography variant='h6' color='inherit'>Utgåtte</Typography>
                    <IconButton onClick={props.fetchExpired}><DownloadIcon/></IconButton>
                </Grid>
                {props.expiredJobPosts.map((value, index) => (
                    <JobPostItem
                        key={index}
                        selected={value.id === props.selectedJobPostId}
                        onClick={() => props.onEventClick(value)}
                        title={value.title}
                        location={value.location} />
                ))}
            </Grid>
        </Paper>
    )
}

JobPostSidebar.propTypes = {
    jobposts: PropTypes.array,
    expiredJobPosts: PropTypes.array,
    onEventClick: PropTypes.func,
    selectedJobPostId: PropTypes.number,
    resetEventState: PropTypes.func,
    fetchExpired: PropTypes.func,
}

JobPostSidebar.defaultProps = {
    jobposts: [],
    expiredJobPosts: [],
    onEventClick: () => {},
    resetEventState: () => {},
    fetchExpired: () => {},
}

export default withStyles(styles)(JobPostSidebar);