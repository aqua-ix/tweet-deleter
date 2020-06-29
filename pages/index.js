import React from "react";
import useSWR from "swr";
import { useUser } from "../utils/auth/useUser";
import FirebaseAuth from "../components/FirebaseAuth";
import TweetList from "../components/TweetList";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    textAlign: "center",
  },
  center: {
    textAlign: "center",
  },
});

const fetcher = (url) =>
  fetch(url, {
    method: "GET",
    headers: new Headers({ "Content-Type": "application/json" }),
    credentials: "same-origin",
  }).then((res) => res.json());

const Index = () => {
  const { user } = useUser();
  const { data } = useSWR(user ? ["/api/getTweet"] : null, fetcher);
  const classes = useStyles();
  const since = new Date(2020, 5, 28);
  return (
    <>
      {user ? (
        data ? (
          <div>
            <TweetList data={data} since={since} />
          </div>
        ) : (
          <Container maxWidth="sm" className={classes.center}>
            <CircularProgress />
          </Container>
        )
      ) : (
        <dev className={classes.root}>
          <h1>自動ツイート消しアプリ</h1>
          <FirebaseAuth />
        </dev>
      )}
    </>
  );
};

export default Index;
