import { Link as RouterLink } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import AppShortcutIcon from "@mui/icons-material/AppShortcut";

interface childProps {
  userState: string | null;
  logout: (value: string) => void;
}

const Navbar = (props: childProps) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton size="large" edge="start" color="inherit" aria-label="logo">
          <AppShortcutIcon />
        </IconButton>
        <Typography
          variant="h6"
          component={RouterLink}
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            boxShadow: "none",
            color: "white",
          }}
          to="/"
        >
          CRUD Project
        </Typography>

        {props.userState === "true" ? (
          <Stack direction="row" spacing={2}>
            <Button
              component={RouterLink}
              to="/"
              color="inherit"
              sx={{ fontWeight: "500", letterSpacing: "1px" }}
            >
              Home
            </Button>
            <Button
              component={RouterLink}
              to="/addEmployee"
              color="inherit"
              sx={{ fontWeight: "500", letterSpacing: "1px" }}
            >
              Add Employee
            </Button>
            <Button
              component={RouterLink}
              to="/signin"
              color="inherit"
              onClick={() => {
                sessionStorage.clear();
                sessionStorage.setItem("user-state", "false");
                props.logout("false");
              }}
              sx={{ fontWeight: "bold", letterSpacing: "1px" }}
            >
              Log Out
            </Button>
          </Stack>
        ) : null}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
