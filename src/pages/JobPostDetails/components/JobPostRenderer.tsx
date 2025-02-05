import { Button, Skeleton, Typography } from '@mui/material';
import parseISO from 'date-fns/parseISO';
import { makeStyles } from 'makeStyles';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { formatDate, getJobpostType } from 'utils';

import { JobPost } from 'types';
import { PermissionApp } from 'types/Enums';

import { HavePermission } from 'hooks/User';
import { useAnalytics } from 'hooks/Utils';

import Paper from 'components/layout/Paper';
import AspectRatioImg, { AspectRatioLoading } from 'components/miscellaneous/AspectRatioImg';
import DetailContent, { DetailContentLoading } from 'components/miscellaneous/DetailContent';
import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';
import ShareButton from 'components/miscellaneous/ShareButton';

const useStyles = makeStyles()((theme) => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: '3fr 1fr',
    gridGap: theme.spacing(2),
    alignItems: 'self-start',
    padding: theme.spacing(2, 0),
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: '1fr',
    },
  },
  title: {
    fontSize: '2.4rem',
  },
  infoBox: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginBottom: theme.spacing(2),
  },
}));

export type JobPostRendererProps = {
  data: JobPost;
  preview?: boolean;
};

const JobPostRenderer = ({ data, preview = false }: JobPostRendererProps) => {
  const { event } = useAnalytics();
  const { classes } = useStyles();
  const deadline = formatDate(parseISO(data.deadline));
  const publishedAt = formatDate(parseISO(data.created_at));

  const goToApplyLink = () => event('apply', 'jobposts', `Apply to: ${data.company}, ${data.title}`);

  return (
    <div className={classes.grid}>
      <Paper>
        <Typography gutterBottom variant='caption'>
          Publisert: {publishedAt}
        </Typography>
        <Typography className={classes.title} gutterBottom variant='h1'>
          {data.title}
        </Typography>
        <MarkdownRenderer value={data.ingress || ''} />
        <MarkdownRenderer value={data.body} />
      </Paper>
      <div>
        <div className={classes.infoBox}>
          <AspectRatioImg alt={data.image_alt || data.title} borderRadius src={data.image} />
        </div>
        <Paper className={classes.infoBox}>
          <DetailContent info={data.company} title='Bedrift: ' />
          <DetailContent info={data.is_continuously_hiring ? 'Fortløpende opptak' : deadline} title='Søknadsfrist: ' />
          <DetailContent
            info={data.class_start === data.class_end ? data.class_start + '.' : data.class_start + '. - ' + data.class_end + '.'}
            title='Årstrinn: '
          />
          <DetailContent info={getJobpostType(data.job_type)} title='Stillingstype: ' />
          <DetailContent info={data.location} title='Sted: ' />
          {data.email && (
            <DetailContent
              info={
                <a href={`mailto:${data.email}`} rel='noreferrer' target='_blank'>
                  {data.email}
                </a>
              }
              title='Kontakt: '
            />
          )}
        </Paper>
        {data.link && (
          <Button
            className={classes.button}
            component='a'
            fullWidth
            href={data.link}
            onClick={goToApplyLink}
            rel='noreferrer'
            target='_blank'
            variant='contained'>
            Søk
          </Button>
        )}
        <ShareButton className={classes.button} fullWidth shareId={data.id} shareType='jobpost' title={data.title} />
        {!preview && (
          <HavePermission apps={[PermissionApp.JOBPOST]}>
            <Button className={classes.button} component={Link} fullWidth to={`${URLS.jobpostsAdmin}${data.id}/`} variant='outlined'>
              Endre annonse
            </Button>
          </HavePermission>
        )}
      </div>
    </div>
  );
};

export default JobPostRenderer;

export const JobPostRendererLoading = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.grid}>
      <Paper>
        <Skeleton height={80} width='60%' />
        <Skeleton height={40} width={250} />
        <Skeleton width={200} />
        <Skeleton height={40} width='80%' />
        <Skeleton height={40} width='85%' />
        <Skeleton height={40} width='75%' />
        <Skeleton height={40} width='90%' />
      </Paper>
      <div>
        <AspectRatioLoading borderRadius />
        <Paper className={classes.infoBox}>
          <DetailContentLoading />
          <DetailContentLoading />
        </Paper>
      </div>
    </div>
  );
};
