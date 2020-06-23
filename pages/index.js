import React from "react";
import useSWR from "swr";
import { useUser } from "../utils/auth/useUser";
import ButtonAppBar from "../components/ButtonAppBar";
import FirebaseAuth from "../components/FirebaseAuth";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  toolbar: {
    minHeight: 100,
  },
});

const fetcher = (url, token) =>
  fetch(url, {
    method: "GET",
    headers: new Headers({ "Content-Type": "application/json", token }),
    credentials: "same-origin",
  }).then((res) => res.json());

const Index = () => {
  const { user, logout } = useUser();
  const { data, error } = useSWR(
    user ? ["/api/getTweet", "Aqua_ix"] : null,
    fetcher
  );
  const classes = useStyles();
  return (
    <>
      <CssBaseline />
      <div className={classes.toolbar} />
      <ButtonAppBar />
      <div className={classes.root}>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          style={{ minHeight: "100vh" }}
        >
          {!user && (
            <dev>
              <h1>自動ツイート消しアプリ</h1>
              <FirebaseAuth />
            </dev>
          )}
          {user && !data && (
            <Grid item xs>
              <h2>Loading......</h2>
            </Grid>
          )}
          {data &&
            !error &&
            Object.values(data).map((row, index) => {
              return (
                <Grid item xs={12} key={index}>
                  <Card>
                    <CardContent>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                      >
                        {row.created_at}
                      </Typography>
                      <Typography>{row.text}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
        </Grid>
      </div>
    </>
  );
};

export default Index;
