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
  const navigate = useNavigate();

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
  const [fieldConfig, setFieldConfig] = useState([]);

  useEffect(() => {
    const config = JSON.parse(localStorage.getItem("fieldConfig")) || [];
    setFieldConfig(config);
  }, []);

  const getFieldRule = (fieldName) => {
    return fieldConfig.find((f) => f.name === fieldName) || {};
  };

  useEffect(() => {
    if (id) {
      const storedData = JSON.parse(localStorage.getItem("employeeData")) || [];
      const employee = storedData.find((e) => e.id === parseInt(id));
      if (employee) {
        const isVisible = (field) => {
          const rule = fieldConfig.find((f) => f.name === field);
          return rule ? rule.isVisible !== false : true;
        };

        setFormData({
          profilePic: isVisible("Profile Pic") ? employee.profilePic || "" : "",
          name: isVisible("Name") ? employee.name || "" : "",
          phone: isVisible("Phone Number") ? employee.phone || "" : "",
          email: isVisible("E-mail") ? employee.email || "" : "",
        });

        setPresentAddress({
          state: isVisible("State") ? employee.statePresent || "" : "",
          city: isVisible("City") ? employee.cityPresent || "" : "",
          nearbyPlace: isVisible("Nearby Place")
            ? employee.nearbyPlacePresent || ""
            : "",
        });

        setPermanentAddress({
          state: isVisible("State") ? employee.statePermanent || "" : "",
          city: isVisible("City") ? employee.cityPermanent || "" : "",
          nearbyPlace: isVisible("Nearby Place")
            ? employee.nearbyPlacePermanent || ""
            : "",
        });
      }
    }
  }, [id, fieldConfig]);

  useEffect(() => {
    if (sameAsPresent) {
      setPermanentAddress({ ...presentAddress });
    }
  }, [presentAddress, sameAsPresent]);

  const isPhoneInvalid = (phone) => {
    const trimmed = phone.trim();
    return (
      trimmed.length !== 10 ||
      !["6", "7", "8", "9"].includes(trimmed[0]) ||
      /\s/.test(trimmed)
    );
  };

  const isEmailInvalid = (email) => {
    const trimmed = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailPattern.test(trimmed);
  };

  const validatePhone = (phone) => setPhoneError(isPhoneInvalid(phone));
  const validateEmail = (email) => setEmailError(isEmailInvalid(email));

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

    const phoneInvalid = isPhoneInvalid(trimmedPhone);
    const emailInvalid = isEmailInvalid(trimmedEmail);
    const duplicatePhone = existingData.some(
      (emp) => emp.phone === trimmedPhone && emp.id !== parseInt(id)
    );
    const duplicateEmail = existingData.some(
      (emp) => emp.email === trimmedEmail && emp.id !== parseInt(id)
    );

    setPhoneError(phoneInvalid);
    setEmailError(emailInvalid);
    setDuplicatePhoneError(duplicatePhone);
    setDuplicateEmailError(duplicateEmail);

    if (phoneInvalid || emailInvalid || duplicatePhone || duplicateEmail)
      return;

    if (id) {
      const index = updatedData.findIndex((e) => e.id === parseInt(id));
      if (index !== -1) updatedData[index] = { ...fullData, id: parseInt(id) };
    } else {
      const newId = existingData.length
        ? Math.max(...existingData.map((e) => e.id || 0)) + 1
        : 1;
      updatedData.push({ ...fullData, id: newId });
    }

    localStorage.setItem("employeeData", JSON.stringify(updatedData));
    setSnackbarOpen(true);

    setFormData({ profilePic: "", name: "", phone: "", email: "" });
    setPresentAddress({ state: "", city: "", nearbyPlace: "" });
    setPermanentAddress({ state: "", city: "", nearbyPlace: "" });
    setSameAsPresent(false);

    setTimeout(() => navigate("/employeelist"), 1000);
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
                required={!!getFieldRule("Name").isMandatory}
                error={
                  getFieldRule("Name").isMandatory && !formData.name.trim()
                }
                helperText={
                  getFieldRule("Name").isMandatory && !formData.name.trim()
                    ? "*Mandatory field"
                    : ""
                }
                inputProps={{
                  maxLength: getFieldRule("Name").length
                    ? parseInt(getFieldRule("Name").length)
                    : undefined,
                }}
              />

              <TextField
                label="Phone Number"
                sx={{ width: "300px" }}
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                onBlur={(e) => {
                  const value = e.target.value.trim();
                  if (
                    getFieldRule("Phone Number").isMandatory ||
                    value !== ""
                  ) {
                    validatePhone(value);
                  } else {
                    setPhoneError(false);
                  }
                }}
                error={
                  (getFieldRule("Phone Number").isMandatory &&
                    !formData.phone.trim()) ||
                  phoneError ||
                  duplicatePhoneError
                }
                helperText={
                  getFieldRule("Phone Number").isMandatory &&
                  !formData.phone.trim()
                    ? "*Mandatory field"
                    : phoneError
                    ? "Enter Indian phone number"
                    : duplicatePhoneError
                    ? "Phone number already exists"
                    : ""
                }
                inputProps={{
                  maxLength: getFieldRule("Phone Number").length
                    ? parseInt(getFieldRule("Phone Number").length)
                    : 10,
                }}
              />

              <TextField
                label="E-mail"
                sx={{ width: "300px" }}
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={(e) => {
                  const value = e.target.value;
                  if (
                    getFieldRule("E-mail").isMandatory ||
                    value.trim() !== ""
                  ) {
                    validateEmail(value);
                  } else {
                    setEmailError(false);
                  }
                }}
                error={
                  (getFieldRule("E-mail").isMandatory &&
                    !formData.email.trim()) ||
                  emailError ||
                  duplicateEmailError
                }
                helperText={
                  getFieldRule("E-mail").isMandatory && !formData.email.trim()
                    ? "*Mandatory field"
                    : emailError
                    ? "Enter a valid email"
                    : duplicateEmailError
                    ? "Email already exists"
                    : ""
                }
                inputProps={{
                  maxLength: parseInt(getFieldRule("E-mail")?.length) || 100,
                }}
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
              required={!!getFieldRule("State").isMandatory}
              error={getFieldRule("State").isMandatory && !presentAddress.state}
              helperText={
                getFieldRule("State").isMandatory && !presentAddress.state
                  ? "*Mandatory field"
                  : ""
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
              required={!!getFieldRule("City").isMandatory}
              error={getFieldRule("City").isMandatory && !presentAddress.city}
              helperText={
                getFieldRule("City").isMandatory && !presentAddress.city
                  ? "*Mandatory field"
                  : ""
              }
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
              required={!!getFieldRule("Nearby Place").isMandatory}
              error={
                getFieldRule("Nearby Place").isMandatory &&
                !presentAddress.nearbyPlace.trim()
              }
              helperText={
                getFieldRule("Nearby Place").isMandatory &&
                !presentAddress.nearbyPlace.trim()
                  ? "*Mandatory field"
                  : ""
              }
              inputProps={{
                maxLength: getFieldRule("Nearby Place").length
                  ? parseInt(getFieldRule("Nearby Place").length)
                  : undefined,
              }}
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
              required={!!getFieldRule("State").isMandatory}
              error={
                getFieldRule("State").isMandatory && !permanentAddress.state
              }
              helperText={
                getFieldRule("State").isMandatory && !permanentAddress.state
                  ? "*Mandatory field"
                  : ""
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
              value={permanentAddress.city}
              onChange={(e) =>
                handlePermanentAddressChange("city", e.target.value)
              }
              disabled={sameAsPresent}
              required={!!getFieldRule("City").isMandatory}
              error={getFieldRule("City").isMandatory && !permanentAddress.city}
              helperText={
                getFieldRule("City").isMandatory && !permanentAddress.city
                  ? "*Mandatory field"
                  : ""
              }
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
              required={!!getFieldRule("Nearby Place").isMandatory}
              error={
                getFieldRule("Nearby Place").isMandatory &&
                !permanentAddress.nearbyPlace.trim()
              }
              helperText={
                getFieldRule("Nearby Place").isMandatory &&
                !permanentAddress.nearbyPlace.trim()
                  ? "*Mandatory field"
                  : ""
              }
              inputProps={{
                maxLength: getFieldRule("Nearby Place").length
                  ? parseInt(getFieldRule("Nearby Place").length)
                  : undefined,
              }}
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
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Form submitted successfully!"
      />
    </Box>
  );
};

export default EmployeeForm;
