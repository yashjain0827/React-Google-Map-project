import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const EmployeeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    profilePic: "",
    id: null,
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
  const [fieldConfig, setFieldConfig] = useState([]);
  const [duplicatePhoneError, setDuplicatePhoneError] = useState(false);
  const [duplicateEmailError, setDuplicateEmailError] = useState(false);

  const states = ["Odisha", "West Bengal", "Andhra Pradesh"];
  const stateCityMap = {
    Odisha: ["Bhubaneswar", "Cuttack", "Khordha"],
    "West Bengal": ["Kolkota", "Siliguri", "Durgapur"],
    "Andhra Pradesh": ["Gunturu", "Palasa", "Vizag"],
  };

  useEffect(() => {
    const config = JSON.parse(localStorage.getItem("fieldConfig")) || [];
    setFieldConfig(config);
  }, []);

  useEffect(() => {
    if (sameAsPresent) {
      setPermanentAddress({ ...presentAddress });
    }
  }, [sameAsPresent, presentAddress]);

  useEffect(() => {
    if (id) {
      const allEmployees =
        JSON.parse(localStorage.getItem("employeeData")) || [];
      const index = parseInt(id, 10) - 1;
      const emp = allEmployees[index];

      if (emp) {
        setFormData({
          name: emp.name || "",
          phone: emp.phone || "",
          email: emp.email || "",
          profilePic: emp.profilePic || "",
          id: emp.id,
        });

        setPresentAddress({
          state: emp.statePresent || "",
          city: emp.cityPresent || "",
          nearbyPlace: emp.nearbyPlacePresent || "",
        });

        setPermanentAddress({
          state: emp.statePermanent || "",
          city: emp.cityPermanent || "",
          nearbyPlace: emp.nearbyPlacePermanent || "",
        });
      }
    }
  }, [id]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePresentAddressChange = (key, value) => {
    setPresentAddress((prev) => ({ ...prev, [key]: value }));
  };

  const handlePermanentAddressChange = (key, value) => {
    setPermanentAddress((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckboxChange = () => {
    setSameAsPresent((prev) => !prev);
    if (!sameAsPresent) {
      setPermanentAddress({ ...presentAddress });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        profilePic: imageUrl,
      }));
    }
  };

  const getFieldRule = (label) =>
    fieldConfig.find((field) => field.name === label) || {};

  const isValidField = (label, value) => {
    const rule = getFieldRule(label);
    if (rule.isMandatory && !value.trim()) return false;
    if (rule.pattern && value.trim() !== "") {
      const regex = new RegExp(rule.pattern);
      return regex.test(value);
    }
    return true;
  };

  const checkDuplicates = () => {
    const stored = JSON.parse(localStorage.getItem("employeeData")) || [];
    const duplicatePhone = stored.some(
      (emp) =>
        emp["phonenumber"] === formData["phonenumber"] && emp.id !== formData.id
    );
    const duplicateEmail = stored.some(
      (emp) => emp["e-mail"] === formData["e-mail"] && emp.id !== formData.id
    );
    setDuplicatePhoneError(duplicatePhone);
    setDuplicateEmailError(duplicateEmail);
    return !(duplicatePhone || duplicateEmail);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const allFieldsValid = fieldConfig.every(
      ({ name, isMandatory, pattern }) => {
        const key = name.toLowerCase().replace(/\s+/g, "");
        const value = formData[key] || "";
        const shouldValidatePattern =
          ["phonenumber", "e-mail"].includes(key) && pattern && value.trim();

        const patternValid = shouldValidatePattern
          ? new RegExp(pattern).test(value)
          : true;

        return !(
          (isMandatory && !value.trim()) ||
          (shouldValidatePattern && !patternValid)
        );
      }
    );

    if (!allFieldsValid) {
      alert("Please fill all mandatory fields correctly.");
      return;
    }

    const noDuplicates = checkDuplicates();
    if (!noDuplicates) {
      alert("Phone or Email already exists.");
      return;
    }

    const existingData = JSON.parse(localStorage.getItem("employeeData")) || [];

    const formattedData = {
      ...formData,
      cityPresent: presentAddress.city || "",
      statePresent: presentAddress.state || "",
      nearbyPlacePresent: presentAddress.nearbyPlace || "",
      cityPermanent: permanentAddress.city || "",
      statePermanent: permanentAddress.state || "",
      nearbyPlacePermanent: permanentAddress.nearbyPlace || "",
    };

    let updatedData;
    const isEditMode = !!formData.id;

    if (isEditMode) {
      updatedData = existingData.map((emp, index) =>
        index + 1 === formData.id ? { ...formattedData, id: formData.id } : emp
      );
    } else {
      formattedData.id = existingData.length + 1;
      updatedData = [...existingData, formattedData];
    }

    localStorage.setItem("employeeData", JSON.stringify(updatedData));

    alert(
      isEditMode
        ? "Employee updated successfully."
        : "Employee added successfully."
    );

    setTimeout(() => {
      navigate("/EmployeeList");
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

            <Box display="flex" gap={2} flexWrap="wrap">
              {fieldConfig
                .filter(
                  ({ name }) =>
                    !["State", "City", "Nearby Place"].includes(name.trim())
                )
                .map(({ name, isMandatory, length, pattern }) => {
                  const key = name.toLowerCase().replace(/\s+/g, "");
                  const value = formData[key] || "";
                  const error = isMandatory && !value.trim();
                  const regexError =
                    ["Phone Number", "E-mail"].includes(name) &&
                    pattern &&
                    value.trim() !== "" &&
                    !new RegExp(pattern).test(value);

                  const isDuplicate =
                    (name === "Phone Number" && duplicatePhoneError) ||
                    (name === "E-mail" && duplicateEmailError);

                  return (
                    <TextField
                      key={key}
                      label={name}
                      sx={{ width: "300px" }}
                      value={value}
                      onChange={(e) => handleChange(key, e.target.value)}
                      required={!!isMandatory}
                      error={error || regexError || isDuplicate}
                      helperText={
                        error
                          ? "*Mandatory field"
                          : regexError
                          ? `Invalid ${name}`
                          : isDuplicate
                          ? `${name} already exists`
                          : ""
                      }
                      inputProps={{
                        maxLength: length ? parseInt(length) : 100,
                      }}
                    />
                  );
                })}
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
            {["State", "City", "Nearby Place"].map((label) => {
              const value =
                presentAddress[label.toLowerCase().replace(" ", "")];
              const rule = getFieldRule(label);
              const error = rule.isMandatory && !value?.trim();
              return label === "Nearby Place" ? (
                <TextField
                  key={label}
                  label={label}
                  sx={{ width: "300px" }}
                  value={presentAddress.nearbyPlace}
                  onChange={(e) =>
                    handlePresentAddressChange("nearbyPlace", e.target.value)
                  }
                  required={!!rule.isMandatory}
                  error={error}
                  helperText={error ? "*Mandatory field" : ""}
                  inputProps={{
                    maxLength: rule.length ? parseInt(rule.length) : undefined,
                  }}
                />
              ) : (
                <TextField
                  select
                  key={label}
                  label={label}
                  sx={{ width: "300px" }}
                  value={presentAddress[label.toLowerCase()]}
                  onChange={(e) =>
                    handlePresentAddressChange(
                      label.toLowerCase(),
                      e.target.value
                    )
                  }
                  required={!!rule.isMandatory}
                  error={error}
                  helperText={error ? "*Mandatory field" : ""}
                >
                  {(label === "State"
                    ? states
                    : stateCityMap[presentAddress.state] || []
                  ).map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>
              );
            })}
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
            {["State", "City", "Nearby Place"].map((label) => {
              const rule = getFieldRule(label);
              const value =
                permanentAddress[label.toLowerCase().replace(" ", "")];
              const error = rule.isMandatory && !value?.trim();
              return label === "Nearby Place" ? (
                <TextField
                  key={label}
                  label={label}
                  sx={{ width: "300px" }}
                  value={permanentAddress.nearbyPlace}
                  onChange={(e) =>
                    handlePermanentAddressChange("nearbyPlace", e.target.value)
                  }
                  disabled={sameAsPresent}
                  required={!!rule.isMandatory}
                  error={error}
                  helperText={error ? "*Mandatory field" : ""}
                  inputProps={{
                    maxLength: rule.length ? parseInt(rule.length) : undefined,
                  }}
                />
              ) : (
                <TextField
                  select
                  key={label}
                  label={label}
                  sx={{ width: "300px" }}
                  value={permanentAddress[label.toLowerCase()]}
                  onChange={(e) =>
                    handlePermanentAddressChange(
                      label.toLowerCase(),
                      e.target.value
                    )
                  }
                  disabled={sameAsPresent}
                  required={!!rule.isMandatory}
                  error={error}
                  helperText={error ? "*Mandatory field" : ""}
                >
                  {(label === "State"
                    ? states
                    : stateCityMap[permanentAddress.state] || []
                  ).map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>
              );
            })}
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
    </Box>
  );
};

export default EmployeeForm;
