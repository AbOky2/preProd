import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import { AdminContentWrapper } from '../../components/wrapper';
import { addBookmarkApiMethod, getCurrentUserkApiMethod } from '../../lib/api/customer';
import Card from '../../components/card';
import { Btn } from '../../components/form';
import withAuth from '../../lib/withAuth';

const useStyles = makeStyles((theme) => ({
  notFound: {
    '& > div:first-of-type': {
      marginBottom: '40px',
      padding: '3.2rem',
      borderRadius: '2.5rem',
      color: 'white',
      background: 'white',
      margin: '2.8rem 0 5.6rem',
      boxShadow: '0px 4px 20px rgba(24, 55, 50, 0.04)',
    },
    '& > div:first-of-type h3': {
      marginBottom: 16,
      '& span': {
        marginRight: 5,
      },
    },
  },
  card: {
    width: 'calc(100% - 14px)',
  },
  btnContainer: {
    textAlign: 'center',
    '& > div': {
      display: 'inline-block',
      padding: '1.8rem 3rem',
      background: '#4f80ff',
      borderRadius: '10px',
      '&:first-of-type': {
        marginRight: 12,
      },
      '&:last-of-type': {
        marginLeft: 12,
        background: 'white',
        border: `1px solid ${theme.palette.newBlue}`,
        '& a': {
          color: '#4f80ff',
        },
      },
    },
    '& a': {
      fontFamily: 'Open Sans',
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: '18px',
      lineHeight: '28px',
      display: 'flex',
      alignItems: 'center',
      color: '#ffffff',
    },
  },
  listContainer: {
    width: 'calc(33% - 11px)',
    marginBottom: '2rem',
    '&:nth-child(3n+2)': {
      margin: '0 2.1rem 2rem',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}));
const BookmarkPage = ({ user }) => {
  const [state, setState] = useState(user.bookmarks);
  const classes = useStyles();
  const handleBookmark = (id) => {
    setState(state.filter((elem) => elem._id !== id));
    addBookmarkApiMethod({ id });
  };
  useEffect(() => {
    getCurrentUserkApiMethod().then(({ user }) => setState(user.bookmarks));
  }, []);
  return (
    <AdminContentWrapper redirectDashboard>
      <div>
        {state?.length ? (
          <Grid container>
            {state.map(({ _id, title, pictures, address, typeOfProperties, dimensions, price }) => (
              <Grid item key={_id} className={classes.listContainer}>
                <Link href={`/dashboard/property/${_id}`}>
                  <a>
                    <Card
                      _id={_id}
                      title={title}
                      src={pictures?.[0]}
                      address={address}
                      description={typeOfProperties}
                      dimensions={dimensions}
                      price={price}
                      liked
                      onClick={handleBookmark}
                    />
                  </a>
                </Link>
              </Grid>
            ))}
          </Grid>
        ) : (
          <div className={classes.notFound}>
            <Typography variant="h1">Vos favoris</Typography>
            <div>
              <Typography variant="h3">
                <span role="img" aria-label="cring">
                  ????
                </span>
                Vous n???avez pas encore de logements sauvegard??s en favoris
              </Typography>
              <Typography variant="body1">
                Pour ajouter un logement dans vos favoris, il vous suffit de cliquer sur la coeur en
                haut ?? gauche quand vous effectuez une recherche de logements. Ou bien, vous pouvez
                cliquer sur le boutton ???sauvegarder??? quand vous ??tes sur la page d???un logement.
              </Typography>
            </div>
            <div>
              <Grid container justify="center" className={classes.btnContainer}>
                <Btn href="/dashboard/search" text="Rechercher un logement ?? acheter" />
                <Btn href="/dashboard/search" text="Rechercher un logement ?? louer" whiteColor />
              </Grid>
            </div>
          </div>
        )}
      </div>
    </AdminContentWrapper>
  );
};

BookmarkPage.propTypes = {
  user: PropTypes.object.isRequired,
};

export default withAuth(BookmarkPage);
