import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Snackbar,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const EmployeeForm = () => {
  const stateCityMap = {
    Odisha: ["Bhubaneswar", "Cuttack", "Khordha"],
    "Andhra Pradesh": ["Vizag", "Guntur", "Palasa"],
    "West Bengal": ["Kolkota", "Siliguri", "Durgapur"],
  };

  const states = Object.keys(stateCityMap);

  const { id } = useParams();
  const [formData, setFormData] = useState({
    profilePic: "",
    name: "",
    phone: "",
    email: "",
  });

  const [presentAddress, setPresentAddress] = useState({
    state: "",
    city: "",
    nearbyPlace: "",
  });

  const [permanentAddress, setPermanentAddress] = useState({
    state: "",
    city: "",
    nearbyPlace: "",
  });

  const [sameAsPresent, setSameAsPresent] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [duplicatePhoneError, setDuplicatePhoneError] = useState(false);
  const [duplicateEmailError, setDuplicateEmailError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const storedData = JSON.parse(localStorage.getItem("employeeData")) || [];
      const employee = storedData.find((e) => e.id === parseInt(id));
      if (employee) {
        setFormData({
          profilePic: employee.profilePic || "",
          name: employee.name || "",
          phone: employee.phone || "",
          email: employee.email || "",
        });
        setPresentAddress({
          state: employee.statePresent || "",
          city: employee.cityPresent || "",
          nearbyPlace: employee.nearbyPlacePresent || "",
        });
        setPermanentAddress({
          state: employee.statePermanent || "",
          city: employee.cityPermanent || "",
          nearbyPlace: employee.nearbyPlacePermanent || "",
        });
      }
    }
  }, [id]);

  useEffect(() => {
    if (sameAsPresent) {
      setPermanentAddress({ ...presentAddress });
    }
  }, [presentAddress, sameAsPresent]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePresentAddressChange = (field, value) => {
    setPresentAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handlePermanentAddressChange = (field, value) => {
    setPermanentAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setSameAsPresent(checked);
    if (checked) {
      setPermanentAddress({ ...presentAddress });
    }
  };

  const handleSubmit = () => {
    const trimmedPhone = formData.phone.trim();
    const trimmedEmail = formData.email.trim();

    const fullData = {
      ...formData,
      phone: trimmedPhone,
      email: trimmedEmail,
      statePresent: presentAddress.state,
      cityPresent: presentAddress.city,
      nearbyPlacePresent: presentAddress.nearbyPlace,
      statePermanent: permanentAddress.state,
      cityPermanent: permanentAddress.city,
      nearbyPlacePermanent: permanentAddress.nearbyPlace,
    };

    const existingData = JSON.parse(localStorage.getItem("employeeData")) || [];
    const updatedData = [...existingData];

    // Validation block
    const isPhoneInvalid =
      trimmedPhone.length !== 10 ||
      !["6", "7", "8", "9"].includes(trimmedPhone[0]) ||
      trimmedPhone.includes(" ");

    const isEmailInvalid =
      !trimmedEmail.endsWith("@gmail.com") || trimmedEmail.includes(" ");

    const isDuplicatePhone = existingData.some(
      (emp) => emp.phone === trimmedPhone && emp.id !== parseInt(id)
    );
    const isDuplicateEmail = existingData.some(
      (emp) => emp.email === trimmedEmail && emp.id !== parseInt(id)
    );

    // Set errors
    setPhoneError(isPhoneInvalid);
    setEmailError(isEmailInvalid);
    setDuplicatePhoneError(isDuplicatePhone);
    setDuplicateEmailError(isDuplicateEmail);

    // If any error exists, stop submission
    if (
      isPhoneInvalid ||
      isEmailInvalid ||
      isDuplicatePhone ||
      isDuplicateEmail
    ) {
      return;
    }

    if (id) {
      const index = updatedData.findIndex((e) => e.id === parseInt(id));
      if (index !== -1) {
        updatedData[index] = { ...fullData, id: parseInt(id) };
      }
    } else {
      const newId = existingData.length
        ? Math.max(...existingData.map((e) => e.id || 0)) + 1
        : 1;
      updatedData.push({ ...fullData, id: newId });
    }

    localStorage.setItem("employeeData", JSON.stringify(updatedData));
    setSnackbarOpen(true);

    setFormData({
      profilePic: "",
      name: "",
      phone: "",
      email: "",
    });
    setPresentAddress({
      state: "",
      city: "",
      nearbyPlace: "",
    });
    setPermanentAddress({
      state: "",
      city: "",
      nearbyPlace: "",
    });
    setSameAsPresent(false);

    setTimeout(() => {
      navigate("/employeelist");
    }, 1000);
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 171px)",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 3,
        backgroundColor: "#f4f4f4",
      }}
    >
      <Typography variant="h4" sx={{ color: "#400c60", mb: 3 }}>
        Employee Form
      </Typography>

      <Box
        sx={{ width: "80%", display: "flex", flexDirection: "column", gap: 3 }}
      >
        <Box
          sx={{
            border: "1px solid #ccc",
            p: 3,
            borderRadius: 2,
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Employee Details
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={1}
            >
              <Avatar
                src={formData.profilePic}
                sx={{ width: 80, height: 80 }}
              />
              <Button variant="contained" component="label">
                Upload Image
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                label="Name"
                sx={{ width: "300px" }}
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              <TextField
                label="Phone Number"
                sx={{ width: "300px" }}
                value={formData.phone}
                error={phoneError || duplicatePhoneError}
                helperText={
                  phoneError
                    ? "Enter a valid 10-digit Indian phone number"
                    : duplicatePhoneError
                    ? "This phone number already exists"
                    : ""
                }
                onChange={(e) => handleChange("phone", e.target.value)}
                inputProps={{
                  maxLength: 10,
                }}
              />
              <TextField
                label="E-mail"
                sx={{ width: "300px" }}
                value={formData.email}
                error={emailError || duplicateEmailError}
                helperText={
                  emailError
                    ? "Only emails ending with @gmail.com are allowed"
                    : duplicateEmailError
                    ? "This email already exists"
                    : ""
                }
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            border: "1px solid #ccc",
            p: 3,
            borderRadius: 2,
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Present Address
          </Typography>
          <Box display="flex" gap={2}>
            <TextField
              select
              label="State"
              sx={{ width: "300px" }}
              value={presentAddress.state}
              onChange={(e) =>
                handlePresentAddressChange("state", e.target.value)
              }
            >
              {states.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="City"
              sx={{ width: "300px" }}
              value={presentAddress.city}
              onChange={(e) =>
                handlePresentAddressChange("city", e.target.value)
              }
              disabled={!presentAddress.state}
            >
              {(stateCityMap[presentAddress.state] || []).map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Nearby Place"
              sx={{ width: "300px" }}
              value={presentAddress.nearbyPlace}
              onChange={(e) =>
                handlePresentAddressChange("nearbyPlace", e.target.value)
              }
            />
          </Box>
        </Box>

        <Box
          sx={{
            border: "1px solid #ccc",
            p: 3,
            borderRadius: 2,
            backgroundColor: "#fff",
          }}
        >
          <Box display="flex" alignItems="center" gap={3} sx={{ mb: 2 }}>
            <Typography variant="h6">Permanent Address</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sameAsPresent}
                  onChange={handleCheckboxChange}
                />
              }
              label="Same as Present Address"
            />
          </Box>
          <Box display="flex" gap={2}>
            <TextField
              select
              label="State"
              sx={{ width: "300px" }}
              value={permanentAddress.state}
              onChange={(e) =>
                handlePermanentAddressChange("state", e.target.value)
              }
              disabled={sameAsPresent}
            >
              {states.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="City"
              sx={{ width: "300px" }}
              value={permanentAddress.city}
              onChange={(e) =>
                handlePermanentAddressChange("city", e.target.value)
              }
              disabled={!permanentAddress.state || sameAsPresent}
            >
              {(stateCityMap[permanentAddress.state] || []).map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Nearby Place"
              sx={{ width: "300px" }}
              value={permanentAddress.nearbyPlace}
              onChange={(e) =>
                handlePermanentAddressChange("nearbyPlace", e.target.value)
              }
              disabled={sameAsPresent}
            />
          </Box>
        </Box>

        <Button
          variant="contained"
          color="primary"
          sx={{ width: "300px", alignSelf: "flex-end", mt: 2 }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Form submitted successfully!"
      />
    </Box>
  );
};

export default EmployeeForm;
