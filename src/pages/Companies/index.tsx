import SendIcon from '@mui/icons-material/SendRounded';
import { Typography } from '@mui/material';
import { makeStyles } from 'makeStyles';
import { useRef } from 'react';
import URLS from 'URLS';
import { getUserStudyLong } from 'utils';

import { UserStudy } from 'types/Enums';

import CompaniesForm from 'pages/Companies/components/CompaniesForm';

import Banner, { BannerButton } from 'components/layout/Banner';
import Container from 'components/layout/Container';
import InfoCard from 'components/layout/InfoCard';
import Page from 'components/navigation/Page';

import Image from 'assets/img/glad.jpg';

const useStyles = makeStyles()((theme) => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    margin: '0 auto',
    gridGap: theme.spacing(2),
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
      gridGap: theme.spacing(1),
      gridTemplateColumns: '1fr',
    },
  },
  gridWide: {
    [theme.breakpoints.up('md')]: {
      gridColumn: 'span 2',
    },
  },
  section: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
  },
  imageClass: {
    width: 400,
    maxWidth: 'none',
    maxHeight: 'none',
    height: 'auto',
    [theme.breakpoints.down('lg')]: {
      width: '100%',
    },
  },
  smoke: {
    backgroundColor: theme.palette.background.smoke,
  },
}));

const Companies = () => {
  const { classes } = useStyles();
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    !formRef.current || window.scroll({ top: formRef.current.offsetTop - 84, left: 0, behavior: 'smooth' });
  };

  const text = {
    aboutUs: `TIHLDE (Trondheim IngeniørHøgskoles Linjeforening for Dannede EDBere) er linjeforeningen for bachelorstudiene Dataingeniør, Digital infrastruktur og cybersikkerhet, Digital forretningsutvikling, Informasjonsbehandling, samt masterstudiet Digital samhandling ved AIT, IDI, NTNU på Gløshaugen.`,
    dataing: `Dataingeniør-studiet kombinerer det beste fra de spesialiserte informatikkutdanningene og de tradisjonelle ingeniørutdanningene.
Det legger mye vekt på praktisk utvikling av systemer og programmer, og studentene får et godt grunnlag i datateknikk, matematikk og teknisk-naturvitenskapelige fag, samt varig og verdifull kompetanse om hvordan datateknikk kan benyttes.`,
    info: `Dette digitale bachelorstudiet kvalifiserer studenter til å tilrettelegge og organisere informasjon i en virksomhet. Man får kunnskap om programmering, webløsninger og datasikkerhet.`,
    digsec: `Dette bachelorstudiet setter fokus på den drift-tekniske IKT-kompetansen bedrifter etterspør. Studentene lærer planleggingsprosesser og oppsett av virtuelle maskiner med bruk av teknologier som VMWare og HyperV. Videre temaer i studiet er Linux, Windows Server, “Cloud Computing” og overvåkning og sikkerhet i digital infrastruktur.`,
    digsam: `Digital samhandling er et veletablert forskningsområde som tar for seg hvordan utøvelse og koordinering av samarbeidsaktiviteter kan støttes ved hjelp av ulike IKT-systemer. Studentene ved denne 2 årige masteren er i stand til å samhandle effektivt i forskjellige tverrfaglige problemløsningsprosesser.`,
    digfor: `Digital forretningsutvikling kombinerer IT, økonomi og ledelse for å skape forretningsutviklere med tverrfaglig kompetanse. For at samfunnet skal digitaliseres er det nødvendig med ledere som har både teknisk og økonomisk kompetanse. Digital forretningsutvikling er lagt opp med høyt fokus på praktisk erfaring innenfor teamarbeid og kommunikasjon. Studiet søker å utdanne dyktige endringsagenter som kan effektivisere arbeidsprosesser og implementere digitale løsninger i bedrifter.`,
    ads: `Vi tilbyr promotering av stillingsannonser ut til våre 600 dyktige studenter på vår [karriereside](${URLS.jobposts}).`,
    course: `Et kurs er et faglig arrangement hvor fokuset skal være på å introdusere studentene for faglige erfaringer som de kan få bruk for i arbeidslivet. Kurset kan inneholde en rask presentasjon av bedriften før kurset starter. Vi legger tilrette for matservering på skolen etter kurset, eller bespisning på restaurant i etterkant.`,
    companyTrips: `Under et bedriftsbesøk reiser studentene til bedriftens lokale for et valgfritt arrangement. Et bedriftsbesøk gir dere som bedrift muligheten til å vise studentene frem hvor de kan jobbe, og bli godt kjent med dem. `,
    companies: `En bedriftspresentasjon gir dere som organisasjon mulighet til å presentere dere for TIHLDE sine studenter. Dette er en gylden mulighet til å gjøre studentene bevisst på hvem dere er, hva dere tilbyr og hvordan dere jobber.
Etter selve presentasjonen reiser vi sammen ned til en resturant for bespisning og mingling med bedriftsrepresentantene.
Vi kan også tilrettelegge for speed intervjuer dersom dette er ønskelig.`,
    instatakeover: `Ved insta-takeover får bedriften ta over instagrammen vår en hel dag. Dere vil få muligheten til å fremme bedriften på valgfri måte, og nå ut direkte til studentene.`,
  };

  return (
    <Page
      banner={
        <Banner text='**Alle arrangementer kan gjennomføres digitalt**' title='For Bedrifter'>
          <BannerButton onClick={scrollToForm} startIcon={<SendIcon />} variant='outlined'>
            Send oss en melding
          </BannerButton>
        </Banner>
      }
      maxWidth={false}
      options={{ title: 'For bedrifter' }}>
      <Container className={classes.section}>
        <Typography align='center' gutterBottom variant='h2'>
          Vi tilbyr
        </Typography>
        <div className={classes.grid}>
          <InfoCard header='Bedriftspresentasjon' justifyText text={text.companies} />
          <InfoCard header='Kurs / Workshop' justifyText text={text.course} />
          <InfoCard header='Bedriftsbesøk' justifyText text={text.companyTrips} />
          <InfoCard header='Annonse' justifyText text={text.ads} />
          <InfoCard className={classes.gridWide} header='Insta-takeover' justifyText text={text.instatakeover} />
        </div>
      </Container>
      <div className={classes.smoke}>
        <Container className={classes.section}>
          <Typography align='center' gutterBottom variant='h2'>
            Studier
          </Typography>
          <div className={classes.grid}>
            <InfoCard header={getUserStudyLong(UserStudy.DATAING)} justifyText text={text.dataing} />
            <InfoCard header={getUserStudyLong(UserStudy.DIGSEC)} justifyText text={text.digsec} />
            <InfoCard header={getUserStudyLong(UserStudy.DIGFOR)} justifyText text={text.digfor} />
            <InfoCard header={getUserStudyLong(UserStudy.DIGSAM)} justifyText text={text.digsam} />
            <InfoCard className={classes.gridWide} header={getUserStudyLong(UserStudy.INFO)} justifyText text={text.info} />
          </div>
        </Container>
      </div>
      <Container className={classes.section} ref={formRef}>
        <Typography align='center' gutterBottom variant='h2'>
          Meld interesse
        </Typography>
        <CompaniesForm />
      </Container>
      <div className={classes.smoke}>
        <Container className={classes.section}>
          <InfoCard header='Om TIHLDE' imageClass={classes.imageClass} src={Image} text={text.aboutUs} />
        </Container>
      </div>
    </Page>
  );
};

export default Companies;
