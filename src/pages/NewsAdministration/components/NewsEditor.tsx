import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import { makeStyles } from 'makeStyles';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { News } from 'types';

import { useCreateNews, useDeleteNews, useNewsById, useUpdateNews } from 'hooks/News';
import { useSnackbar } from 'hooks/Snackbar';

import NewsRenderer from 'pages/NewsDetails/components/NewsRenderer';

import MarkdownEditor from 'components/inputs/MarkdownEditor';
import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import { ImageUpload } from 'components/inputs/Upload';
import UserSearch from 'components/inputs/UserSearch';
import VerifyDialog from 'components/layout/VerifyDialog';
import RendererPreview from 'components/miscellaneous/RendererPreview';

const useStyles = makeStyles()((theme) => ({
  grid: {
    display: 'grid',
    gridGap: theme.spacing(2),
    gridTemplateColumns: '1fr 1fr',
    [theme.breakpoints.down('md')]: {
      gridGap: 0,
      gridTemplateColumns: '1fr',
    },
  },
  margin: {
    margin: theme.spacing(2, 0, 1),
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
}));

export type NewsEditorProps = {
  newsId: number | null;
  goToNews: (newNews: number | null) => void;
};

type FormValues = Pick<News, 'title' | 'header' | 'body' | 'image' | 'image_alt' | 'creator'>;

const NewsEditor = ({ newsId, goToNews }: NewsEditorProps) => {
  const showSnackbar = useSnackbar();
  const { classes } = useStyles();
  const { control, handleSubmit, register, formState, getValues, reset, watch, setValue } = useForm<FormValues>();
  const { data, isError, isLoading } = useNewsById(newsId || -1);
  const createNews = useCreateNews();
  const updateNews = useUpdateNews(newsId || -1);
  const deleteNews = useDeleteNews(newsId || -1);
  const isUpdating = useMemo(
    () => createNews.isLoading || updateNews.isLoading || deleteNews.isLoading,
    [createNews.isLoading, updateNews.isLoading, deleteNews.isLoading],
  );

  useEffect(() => {
    !isError || goToNews(null);
  }, [isError]);

  const setValues = useCallback(
    (newValues: News | null) => {
      reset({
        title: newValues?.title || '',
        header: newValues?.header || '',
        creator: newValues?.creator || null,
        body: newValues?.body || '',
        image: newValues?.image || '',
        image_alt: newValues?.image_alt || '',
      });
    },
    [reset],
  );

  useEffect(() => {
    if (data) {
      setValues(data);
    } else {
      setValues(null);
    }
  }, [data, setValues]);

  const getNewsPreview = () => {
    return {
      ...getValues(),
      created_at: new Date().toJSON(),
      id: 1,
      updated_at: new Date().toJSON(),
    };
  };
  const remove = async () => {
    deleteNews.mutate(null, {
      onSuccess: (data) => {
        showSnackbar(data.detail, 'success');
        goToNews(null);
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };
  const submit = async (data: FormValues) => {
    newsId
      ? updateNews.mutate(
          { ...data, creator: data.creator?.user_id || null },
          {
            onSuccess: () => {
              showSnackbar('Nyheten ble oppdatert', 'success');
            },
            onError: (err) => {
              showSnackbar(err.detail, 'error');
            },
          },
        )
      : createNews.mutate(
          { ...data, creator: data.creator?.user_id || null },
          {
            onSuccess: (newNewsItem) => {
              showSnackbar('Nyheten ble opprettet', 'success');
              goToNews(newNewsItem.id);
            },
            onError: (err) => {
              showSnackbar(err.detail, 'error');
            },
          },
        );
  };

  if (isLoading) {
    return <LinearProgress />;
  }
  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <Grid container direction='column' wrap='nowrap'>
          <TextField formState={formState} label='Tittel' {...register('title', { required: 'Feltet er påkrevd' })} required />
          <TextField formState={formState} label='Header' {...register('header', { required: 'Feltet er påkrevd' })} required />
          <UserSearch control={control} formState={formState} label='Forfatter' name='creator' />
          <MarkdownEditor formState={formState} label='Innhold' {...register('body', { required: 'Gi nyheten et innhold' })} required />
          <ImageUpload formState={formState} label='Velg bilde' ratio='21:9' register={register('image')} setValue={setValue} watch={watch} />
          <TextField formState={formState} label='Alternativ bildetekst' {...register('image_alt')} />
          <RendererPreview className={classes.margin} getContent={getNewsPreview} renderer={NewsRenderer} />
          <SubmitButton className={classes.margin} disabled={isUpdating} formState={formState}>
            {newsId ? 'Oppdater nyhet' : 'Opprett nyhet'}
          </SubmitButton>
          {Boolean(newsId) && (
            <VerifyDialog
              className={classes.margin}
              closeText='Ikke slett nyheten'
              color='error'
              contentText='Sletting av nyheten kan ikke reverseres.'
              onConfirm={remove}
              titleText='Er du sikker?'>
              Slett
            </VerifyDialog>
          )}
        </Grid>
      </form>
    </>
  );
};

export default NewsEditor;
