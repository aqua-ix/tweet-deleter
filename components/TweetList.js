import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import Tooltip from "@material-ui/core/Tooltip";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/RemoveCircle";
import Container from "@material-ui/core/Container";
import TimePicker from "./TimePicker";
import useSWR from "swr";
import { useUser } from "../utils/auth/useUser";
import LinearProgress from "@material-ui/core/LinearProgress";
import { format, set, getHours, startOfToday, startOfTomorrow } from "date-fns";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  center: {
    textAlign: "center",
  },
}));

const dateFormatter = (arg) => {
  const date = new Date(arg);
  return format(date, "M/dd HH:mm");
};

const filterTweets = (data, since, until) => {
  return data
    ? data.filter((tweet) => {
        const u = new Date(until);
        const c = new Date(tweet.created_at);
        const s = new Date(since);
        return u > c && c > s;
      })
    : null;
};

const initialSinceDate = () => {
  const hours = getHours(new Date());
  if (hours < 6) {
    return startOfToday();
  } else {
    return startOfTomorrow();
  }
};

const initialUntilDate = () => {
  const hours = getHours(new Date());
  if (hours < 6) {
    return set(startOfToday(), { hours: 6 });
  } else {
    return set(startOfTomorrow(), { hours: 6 });
  }
};

const fetcher = (url) =>
  fetch(url, {
    method: "GET",
    headers: new Headers({ "Content-Type": "application/json" }),
    credentials: "same-origin",
  }).then((res) => res.json());

export default function TweetList() {
  const { user } = useUser();
  const { data } = useSWR(user ? ["/api/getTweet"] : null, fetcher);

  const [since, setSince] = useState(initialSinceDate());
  const [until, setUntil] = useState(initialUntilDate());
  let filtered = filterTweets(data, since, until);

  const handleSinceChange = (date) => {
    setSince(date);
    filtered = filterTweets(data, since, until);
  };

  const handleUntilChange = (date) => {
    setUntil(date);
    filtered = filterTweets(data, since, until);
  };

  const classes = useStyles();

  return (
    <>
      {data ? (
        <div>
          <Container maxWidth="sm" className={classes.center}>
            <TimePicker
              since={since}
              until={until}
              onSinceChange={handleSinceChange}
              onUntilChange={handleUntilChange}
            />
            <h3>{"削除予定ツイート"}</h3>
            {filtered === [] ? (
              <List className={classes.root}>
                {Object.values(filtered).map((tweet, index) => {
                  const date = dateFormatter(tweet.created_at);
                  return (
                    <div key={index}>
                      <ListItem>
                        <ListItemText primary={tweet.text} secondary={date} />
                        <ListItemSecondaryAction>
                          <Tooltip title="削除予定リストから除外">
                            <IconButton edge="end" aria-label="delete">
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider />
                    </div>
                  );
                })}
              </List>
            ) : (
              <h4>削除対象のツイートはありません</h4>
            )}
          </Container>
        </div>
      ) : (
        <LinearProgress />
      )}
      :
    </>
  );
}
