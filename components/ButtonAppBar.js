import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Logout from "@material-ui/icons/ExitToApp";
import { useUser } from "../utils/auth/useUser";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();
  const { user, logout } = useUser();

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            TweetDeleter
          </Typography>
          {user && (
            <IconButton color="inherit" onClick={() => logout()}>
              <Logout />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
