import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/RemoveCircle";
import Container from "@material-ui/core/Container";
import PropTypes from "prop-types";
import TimePicker from "./TimePicker";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  center: {
    textAlign: "center",
  },
}));

TweetList.propTypes = {
  data: PropTypes.array,
  since: PropTypes.object,
};

const dateFormatter = (arg) => {
  const date = new Date(arg);
  return (
    date.getMonth() +
    1 +
    "/" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    (date.getMinutes() < 10 ? "0" : "") +
    date.getMinutes()
  );
};

export default function TweetList(props) {
  const { data, since } = props;
  const classes = useStyles();
  console.log(data);
  const filtered = data.filter((tweet) => {
    const c = new Date(tweet.created_at);
    const s = new Date(since);
    return c > s;
  });

  return (
    <>
      <Container maxWidth="sm" className={classes.center}>
        <div>
          <h3>以下のツイートが自動削除されます。</h3>
          <TimePicker />
          <List className={classes.root}>
            {Object.values(filtered).map((tweet, index) => {
              const date = dateFormatter(tweet.created_at);
              return (
                <div key={index}>
                  <ListItem>
                    <ListItemText primary={tweet.text} secondary={date} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </div>
              );
            })}
          </List>
        </div>
      </Container>
    </>
  );
}
