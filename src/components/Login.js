import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import backgroundImage from "../img/backgroundimage.jpg";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    const staticUserId = "admin";
    const staticPassword = "admin123";

    if (userId === staticUserId && password === staticPassword) {
      login();
      navigate("/dashboard");
    } else {
      setError("Invalid credentials, try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        // backgroundColor: "rgba(0, 60, 255, 0.1)",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          width: "100%",
          maxHeight: 350,
          height: "100%",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom sx={{ color: "#007bff" }}>
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ marginBottom: "20px" }}>
            {error}
          </Alert>
        )}

        <TextField
          label="User ID"
          fullWidth
          margin="normal"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ marginTop: "20px", backgroundColor: "#007bff" }}
          onClick={handleLogin}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
