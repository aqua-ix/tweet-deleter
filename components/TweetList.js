import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Tooltip from "@material-ui/core/Tooltip";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/RemoveCircle";
import AddIcon from "@material-ui/icons/AddCircle";
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

const filterTweets = (data, since, until, ex) => {
  return data
    ? data.filter((tweet) => {
        const u = new Date(until);
        const c = new Date(tweet.created_at);
        const s = new Date(since);
        return u > c && c > s && !ex.includes(tweet.id.toString());
      })
    : null;
};

const excludeTweets = (data, since, until, ex) => {
  return data
    ? data.filter((tweet) => {
        const u = new Date(until);
        const c = new Date(tweet.created_at);
        const s = new Date(since);
        return u > c && c > s && ex.includes(tweet.id.toString());
      })
    : null;
};

// TODO DBから取得
const initialSinceDate = () => {
  const hours = getHours(new Date());
  if (hours < 6) {
    return startOfToday();
  } else {
    return startOfTomorrow();
  }
};

// TODO DBから取得
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
  const [excludeList, setExcludeList] = useState([]);
  const classes = useStyles();

  let filtered = filterTweets(data, since, until, excludeList);
  let exclude = excludeTweets(data, since, until, excludeList);

  // TODO DBに保存
  const handleSinceChange = (date) => {
    setSince(date);
    filtered = filterTweets(data, since, until, excludeList);
  };

  // TODO DBに保存
  const handleUntilChange = (date) => {
    setUntil(date);
    filtered = filterTweets(data, since, until, excludeList);
  };

  // TODO DBに保存
  const handleRemove = (event) => {
    const id = event.currentTarget.id;
    setExcludeList((prev) => (prev.includes(id) ? [...prev] : [...prev, id]));
    filtered = filterTweets(data, since, until, excludeList);
  };

  // TODO DBに保存
  const handleAdd = (event) => {
    const id = event.currentTarget.id;
    setExcludeList((prev) => prev.filter((item) => item !== id));
    filtered = filterTweets(data, since, until, excludeList);
  };

  // TODO 除外ボタンを機能させる
  // TODO 削除除外リストを作る
  // TODO 除外ツイートのIDをDBに保存
  // TODO 除外リストをDBから取得
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
            <Divider />
            <h3>{"削除予定ツイート"}</h3>
            {filtered.length ? (
              <List className={classes.root}>
                {Object.values(filtered).map((tweet, index) => {
                  const date = dateFormatter(tweet.created_at);
                  return (
                    <div key={index}>
                      <ListItem>
                        <ListItemText primary={tweet.text} secondary={date} />
                        <ListItemSecondaryAction>
                          <Tooltip title="削除予定リストから除外">
                            <IconButton
                              edge="end"
                              aria-label="remove"
                              onClick={handleRemove}
                              id={tweet.id}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Box m="0.5rem" />
                    </div>
                  );
                })}
              </List>
            ) : (
              <h4>削除対象のツイートはありません</h4>
            )}
            <h3>削除対象外ツイート</h3>
            {exclude.length ? (
              <List className={classes.root}>
                {Object.values(exclude).map((tweet, index) => {
                  const date = dateFormatter(tweet.created_at);
                  return (
                    <div key={index}>
                      <ListItem>
                        <ListItemText primary={tweet.text} secondary={date} />
                        <ListItemSecondaryAction>
                          <Tooltip title="削除対象に戻す">
                            <IconButton
                              edge="end"
                              aria-label="remove"
                              onClick={handleAdd}
                              id={tweet.id}
                            >
                              <AddIcon />
                            </IconButton>
                          </Tooltip>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Box m="0.5rem" />
                    </div>
                  );
                })}
              </List>
            ) : (
              <h4>削除対象外のツイートはありません</h4>
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
