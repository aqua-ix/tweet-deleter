import React from "react";
import { useUser } from "../utils/auth/useUser";
import FirebaseAuth from "../components/FirebaseAuth";
import TweetList from "../components/TweetList";
import { makeStyles } from "@material-ui/core/styles";
// import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    textAlign: "center",
  },
  center: {
    textAlign: "center",
  },
});

// TODO https://emotion.sh/docs/introduction

const Index = () => {
  const { user } = useUser();
  const classes = useStyles();
  return (
    <>
      {user ? (
        <TweetList />
      ) : (
        <div className={classes.root}>
          <h1>自動ツイート消しアプリ</h1>
          <FirebaseAuth />
        </div>
      )}
    </>
  );
};

export default Index;
