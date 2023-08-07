import React, { useState, useEffect } from "react";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";

import axios from "axios";

import { Paper, Chip, TextField, Button } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

interface User {
  fullName: String;
  email: String;
  jobTitle: String;
  afm: String;
  salary: Number;
  password: String;
}

const ViewEmployee = () => {
  const [user, setUser] = useState<User>({
    fullName: "",
    email: "",
    jobTitle: "",
    afm: "",
    salary: 0,
    password: "",
  });
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    loadEmployee();
  }, []);

  const loadEmployee = async () => {
    const token = sessionStorage.getItem("user-token");
    await axios
      .get(`http://localhost:8080/employee/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((employee) => {
        setUser(employee.data);
      })
      .catch((error) => {
        if (error.response.status === 403) navigate("/signin");
        alert("You must be logged in!");
      });
  };

  return (
    <div
      style={{
        textAlign: "center",
        width: "400px",
        margin: "0 auto",
        marginTop: "50px",
      }}
    >
      <Paper elevation={3} style={{ padding: "30px" }}>
        <Chip
          label="Employee Details"
          color="primary"
          variant="outlined"
          icon={<AccountBoxIcon />}
          size="medium"
          style={{ margin: "20px 0", fontWeight: 600, letterSpacing: "0.75px" }}
        />

        <br />
        <p>
          <TextField
            color="primary"
            variant="outlined"
            InputProps={{ readOnly: true }}
            fullWidth
            size="small"
            label="Full Name"
            style={{ marginBottom: "10px" }}
            value={user.fullName}
          />
        </p>
        <p>
          <TextField
            color="primary"
            variant="outlined"
            InputProps={{ readOnly: true }}
            fullWidth
            size="small"
            label="Email"
            style={{ marginBottom: "10px" }}
            value={user.email}
          />
        </p>
        <p>
          <TextField
            color="primary"
            variant="outlined"
            InputProps={{ readOnly: true }}
            fullWidth
            size="small"
            label="Job Title"
            style={{ marginBottom: "10px" }}
            value={user.jobTitle}
          />
        </p>
        <p>
          <TextField
            color="primary"
            variant="outlined"
            InputProps={{ readOnly: true }}
            fullWidth
            size="small"
            label="TIN"
            style={{ marginBottom: "10px" }}
            value={user.afm}
          />
        </p>
        <p>
          <TextField
            color="primary"
            variant="outlined"
            InputProps={{ readOnly: true }}
            fullWidth
            size="small"
            label="Salary"
            style={{ marginBottom: "10px" }}
            value={user.salary}
          />
        </p>
        <Button variant="contained" component={RouterLink} to="/">
          Back to Home
        </Button>
      </Paper>
    </div>
  );
};

export default ViewEmployee;
