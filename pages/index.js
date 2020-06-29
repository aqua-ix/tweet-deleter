import React from "react";
import { useUser } from "../utils/auth/useUser";
import FirebaseAuth from "../components/FirebaseAuth";
import TweetList from "../components/TweetList";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    textAlign: "center",
  },
  center: {
    textAlign: "center",
  },
});

const Index = () => {
  const { user } = useUser();
  const classes = useStyles();
  return (
    <>
      {user ? (
        <TweetList />
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
