import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link as RouterLink, useParams } from "react-router-dom";

import axios from "axios";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Container, Typography, TextField, Button, Box } from "@mui/material";

interface User {
  fullName: String;
  email: String;
  jobTitle: String;
  afm: String;
  salary: Number;
  password: String;
}

const schema = yup.object().shape({
  fullName: yup.string(),
  email: yup.string().email(),
  jobTitle: yup.string(),
  afm: yup.string(),
  salary: yup.number(),
  password: yup.string().min(8).max(120),
});

function EditEmployee() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState<User>({
    fullName: "",
    email: "",
    jobTitle: "",
    afm: "",
    salary: 0,
    password: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({ resolver: yupResolver(schema) });

  useEffect(() => {
    getEmployee();
  }, []);

  const getEmployee = async () => {
    const token = sessionStorage.getItem("user-token");
    const employee = await axios
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

  const onInputChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setUser({ ...user, [target.name]: target.value });
  };

  const onSubmit = async (data: User) => {
    const token = sessionStorage.getItem("user-token");
    await axios
      .put(
        `http://localhost:8080/employee/${id}`,
        {
          fullName: user.fullName,
          email: user.email,
          jobTitle: user.jobTitle,
          afm: user.afm,
          salary: user.salary,
          password: user.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        if (error.response.status === 403) navigate("/signin");
        alert("You must be logged in!");
      });
  };

  return (
    <Container maxWidth="xs">
      <Typography
        variant="h4"
        gutterBottom
        style={{ marginTop: "32px", textAlign: "center" }}
        color="primary"
      >
        Edit Employee
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          {...register("fullName")}
          variant="outlined"
          margin="normal"
          label="Full Name"
          helperText={errors.fullName?.message}
          error={!!errors.fullName?.message}
          fullWidth
          required
          style={{ marginBottom: "12px" }}
          value={user.fullName}
          onChange={onInputChange}
        />
        <TextField
          {...register("email")}
          variant="outlined"
          margin="normal"
          label="email"
          helperText={errors.email?.message}
          error={!!errors.email?.message}
          fullWidth
          required
          style={{ marginBottom: "12px" }}
          value={user.email}
          onChange={onInputChange}
        />
        <TextField
          {...register("jobTitle")}
          variant="outlined"
          margin="normal"
          label="Job Title"
          helperText={errors.jobTitle?.message}
          error={!!errors.jobTitle?.message}
          fullWidth
          required
          style={{ marginBottom: "12px" }}
          value={user.jobTitle}
          onChange={onInputChange}
        />
        <TextField
          {...register("afm")}
          variant="outlined"
          margin="normal"
          label="TIN"
          helperText={errors.afm?.message}
          error={!!errors.afm?.message}
          fullWidth
          required
          style={{ marginBottom: "12px" }}
          value={user.afm}
          onChange={onInputChange}
        />
        <TextField
          {...register("salary")}
          variant="outlined"
          margin="normal"
          label="Salary"
          helperText={errors.salary?.message}
          error={!!errors.salary?.message}
          fullWidth
          required
          style={{ marginBottom: "12px" }}
          value={user.salary}
          onChange={onInputChange}
        />
        <Box
          component="span"
          m={1}
          display="flex"
          justifyContent="space-around"
          alignItems="center"
          style={{ margin: "32px" }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{ height: 40 }}
            size="large"
            type="submit"
          >
            Submit
          </Button>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            color="secondary"
            sx={{
              height: 40,
              background: "red",
              ":hover": { bgcolor: "#d11a2a" },
            }}
            size="large"
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Container>
  );
}

export default EditEmployee;
