// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Avatar,
//   MenuItem,
//   Checkbox,
//   FormControlLabel,
//   Snackbar,
// } from "@mui/material";
// import { useParams, useNavigate } from "react-router-dom";

// const EmployeeForm = () => {
//   const stateCityMap = {
//     Odisha: ["Bhubaneswar", "Cuttack", "Khordha"],
//     "Andhra Pradesh": ["Vizag", "Guntur", "Palasa"],
//     "West Bengal": ["Kolkota", "Siliguri", "Durgapur"],
//   };

//   const states = Object.keys(stateCityMap);
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     profilePic: "",
//     name: "",
//     phone: "",
//     email: "",
//   });

//   const [presentAddress, setPresentAddress] = useState({
//     state: "",
//     city: "",
//     nearbyPlace: "",
//   });

//   const [permanentAddress, setPermanentAddress] = useState({
//     state: "",
//     city: "",
//     nearbyPlace: "",
//   });

//   const [sameAsPresent, setSameAsPresent] = useState(false);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [formErrors, setFormErrors] = useState({});
//   const [duplicatePhoneError, setDuplicatePhoneError] = useState(false);
//   const [duplicateEmailError, setDuplicateEmailError] = useState(false);
//   const [fieldConfig, setFieldConfig] = useState([]);

//   useEffect(() => {
//     const config = JSON.parse(localStorage.getItem("fieldConfig")) || [];
//     setFieldConfig(config);
//   }, []);

//   const getFieldRule = (fieldName) => {
//     return fieldConfig.find((f) => f.name === fieldName) || {};
//   };

//   useEffect(() => {
//     if (id) {
//       const storedData = JSON.parse(localStorage.getItem("employeeData")) || [];
//       const employee = storedData.find((e) => e.id === parseInt(id));
//       if (employee) {
//         const isVisible = (field) => {
//           const rule = fieldConfig.find((f) => f.name === field);
//           return rule ? rule.isVisible !== false : true;
//         };

//         setFormData({
//           profilePic: isVisible("Profile Pic") ? employee.profilePic || "" : "",
//           name: isVisible("Name") ? employee.name || "" : "",
//           phone: isVisible("Phone Number") ? employee.phone || "" : "",
//           email: isVisible("E-mail") ? employee.email || "" : "",
//         });

//         setPresentAddress({
//           state: isVisible("State") ? employee.statePresent || "" : "",
//           city: isVisible("City") ? employee.cityPresent || "" : "",
//           nearbyPlace: isVisible("Nearby Place")
//             ? employee.nearbyPlacePresent || ""
//             : "",
//         });

//         setPermanentAddress({
//           state: isVisible("State") ? employee.statePermanent || "" : "",
//           city: isVisible("City") ? employee.cityPermanent || "" : "",
//           nearbyPlace: isVisible("Nearby Place")
//             ? employee.nearbyPlacePermanent || ""
//             : "",
//         });
//       }
//     }
//   }, [id, fieldConfig]);

//   useEffect(() => {
//     if (sameAsPresent) {
//       setPermanentAddress({ ...presentAddress });
//     }
//   }, [presentAddress, sameAsPresent]);

//   const validateField = (fieldName, value) => {
//     const rule = getFieldRule(fieldName);
//     if (!rule) return null;

//     const trimmed = value.trim();

//     if (rule.isMandatory && !trimmed) {
//       return `${fieldName} is required`;
//     }

//     if (rule.pattern) {
//       const regex = new RegExp(rule.pattern);
//       if (!regex.test(trimmed)) {
//         return `Invalid ${fieldName}`;
//       }
//     }

//     if (
//       rule.showLength &&
//       rule.length &&
//       trimmed.length > parseInt(rule.length)
//     ) {
//       return `${fieldName} must be at most ${rule.length} characters`;
//     }

//     return null;
//   };

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));

//     const configField = fieldConfig.find((f) =>
//       f.name.toLowerCase().includes(field)
//     );

//     const error = validateField(configField?.name || field, value);
//     setFormErrors((prev) => ({ ...prev, [field]: error }));
//   };

//   const handlePresentAddressChange = (field, value) => {
//     setPresentAddress((prev) => ({ ...prev, [field]: value }));
//   };

//   const handlePermanentAddressChange = (field, value) => {
//     setPermanentAddress((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData((prev) => ({ ...prev, profilePic: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleCheckboxChange = (event) => {
//     const checked = event.target.checked;
//     setSameAsPresent(checked);
//     if (checked) {
//       setPermanentAddress({ ...presentAddress });
//     }
//   };

//   const handleSubmit = () => {
//     const trimmedPhone = formData.phone.trim();
//     const trimmedEmail = formData.email.trim();

//     const validationErrors = {};

//     for (const field of fieldConfig) {
//       const fieldKey = field.name.toLowerCase().replace(/\s+/g, "");
//       const value = formData[fieldKey] || "";
//       const error = validateField(field.name, value);
//       if (error) {
//         validationErrors[fieldKey] = error;
//       }
//     }

//     setFormErrors(validationErrors);
//     const hasErrors = Object.values(validationErrors).some(Boolean);

//     const existingData = JSON.parse(localStorage.getItem("employeeData")) || [];

//     const duplicatePhone = existingData.some(
//       (emp) => emp.phone === trimmedPhone && emp.id !== parseInt(id)
//     );
//     const duplicateEmail = existingData.some(
//       (emp) => emp.email === trimmedEmail && emp.id !== parseInt(id)
//     );

//     setDuplicatePhoneError(duplicatePhone);
//     setDuplicateEmailError(duplicateEmail);

//     if (hasErrors || duplicatePhone || duplicateEmail) return;

//     const fullData = {
//       ...formData,
//       phone: trimmedPhone,
//       email: trimmedEmail,
//       statePresent: presentAddress.state,
//       cityPresent: presentAddress.city,
//       nearbyPlacePresent: presentAddress.nearbyPlace,
//       statePermanent: permanentAddress.state,
//       cityPermanent: permanentAddress.city,
//       nearbyPlacePermanent: permanentAddress.nearbyPlace,
//     };

//     const updatedData = [...existingData];

//     if (id) {
//       const index = updatedData.findIndex((e) => e.id === parseInt(id));
//       if (index !== -1) updatedData[index] = { ...fullData, id: parseInt(id) };
//     } else {
//       const newId = existingData.length
//         ? Math.max(...existingData.map((e) => e.id || 0)) + 1
//         : 1;
//       updatedData.push({ ...fullData, id: newId });
//     }

//     localStorage.setItem("employeeData", JSON.stringify(updatedData));
//     setSnackbarOpen(true);

//     setFormData({ profilePic: "", name: "", phone: "", email: "" });
//     setPresentAddress({ state: "", city: "", nearbyPlace: "" });
//     setPermanentAddress({ state: "", city: "", nearbyPlace: "" });
//     setSameAsPresent(false);

//     setTimeout(() => navigate("/employeelist"), 1000);
//   };

//   return (
//     <Box
//       sx={{
//         height: "calc(100vh - 171px)",
//         width: "100vw",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         padding: 3,
//         backgroundColor: "#f4f4f4",
//       }}
//     >
//       <Typography variant="h4" sx={{ color: "#400c60", mb: 3 }}>
//         Employee Form
//       </Typography>
//       <Box
//         sx={{ width: "80%", display: "flex", flexDirection: "column", gap: 3 }}
//       >
//         {/* Employee Details */}
//         <Box
//           sx={{
//             border: "1px solid #ccc",
//             p: 3,
//             borderRadius: 2,
//             backgroundColor: "#fff",
//           }}
//         >
//           <Typography variant="h6" sx={{ mb: 2 }}>
//             Employee Details
//           </Typography>
//           <Box display="flex" alignItems="center" gap={2}>
//             <Box
//               display="flex"
//               flexDirection="column"
//               alignItems="center"
//               gap={1}
//             >
//               <Avatar
//                 src={formData.profilePic}
//                 sx={{ width: 80, height: 80 }}
//               />
//               <Button variant="contained" component="label">
//                 Upload Image
//                 <input type="file" hidden onChange={handleFileChange} />
//               </Button>
//             </Box>
//             <Box display="flex" gap={2}>
//               {/* Name */}
//               <TextField
//                 label="Name"
//                 sx={{ width: "300px" }}
//                 value={formData.name}
//                 onChange={(e) => handleChange("name", e.target.value)}
//                 required={!!getFieldRule("Name").isMandatory}
//                 error={
//                   getFieldRule("Name").isMandatory && !formData.name.trim()
//                 }
//                 helperText={
//                   getFieldRule("Name").isMandatory && !formData.name.trim()
//                     ? "*Mandatory field"
//                     : ""
//                 }
//                 inputProps={{
//                   maxLength: getFieldRule("Name").length
//                     ? parseInt(getFieldRule("Name").length)
//                     : undefined,
//                 }}
//               />

//               {/* Phone */}
//               <TextField
//                 label="Phone Number"
//                 sx={{ width: "300px" }}
//                 value={formData.phone}
//                 onChange={(e) => handleChange("phone", e.target.value)}
//                 onBlur={(e) => {
//                   const value = e.target.value.trim();
//                   if (
//                     getFieldRule("Phone Number").isMandatory ||
//                     value !== ""
//                   ) {
//                     validatePhone(value);
//                   } else {
//                     setPhoneError(false);
//                   }
//                 }}
//                 required={!!getFieldRule("Phone Number").isMandatory}
//                 error={
//                   (getFieldRule("Phone Number").isMandatory &&
//                     !formData.phone.trim()) ||
//                   phoneError ||
//                   duplicatePhoneError
//                 }
//                 helperText={
//                   getFieldRule("Phone Number").isMandatory &&
//                   !formData.phone.trim()
//                     ? "*Mandatory field"
//                     : phoneError
//                     ? "Enter Indian phone number"
//                     : duplicatePhoneError
//                     ? "Phone number already exists"
//                     : ""
//                 }
//                 inputProps={{
//                   maxLength: getFieldRule("Phone Number").length
//                     ? parseInt(getFieldRule("Phone Number").length)
//                     : 10,
//                 }}
//               />

//               {/* Email */}
//               <TextField
//                 label="E-mail"
//                 sx={{ width: "300px" }}
//                 value={formData.email}
//                 onChange={(e) => handleChange("email", e.target.value)}
//                 onBlur={(e) => {
//                   const value = e.target.value.trim();
//                   if (getFieldRule("E-mail").isMandatory || value !== "") {
//                     validateEmail(value);
//                   } else {
//                     setEmailError(false);
//                   }
//                 }}
//                 required={!!getFieldRule("E-mail").isMandatory}
//                 error={
//                   (getFieldRule("E-mail").isMandatory &&
//                     !formData.email.trim()) ||
//                   emailError ||
//                   duplicateEmailError
//                 }
//                 helperText={
//                   getFieldRule("E-mail").isMandatory && !formData.email.trim()
//                     ? "*Mandatory field"
//                     : emailError
//                     ? "Enter a valid email"
//                     : duplicateEmailError
//                     ? "Email already exists"
//                     : ""
//                 }
//                 inputProps={{
//                   maxLength: parseInt(getFieldRule("E-mail")?.length) || 100,
//                 }}
//               />
//             </Box>
//           </Box>
//         </Box>

//         {/* Present Address */}
//         <Box
//           sx={{
//             border: "1px solid #ccc",
//             p: 3,
//             borderRadius: 2,
//             backgroundColor: "#fff",
//           }}
//         >
//           <Typography variant="h6" sx={{ mb: 2 }}>
//             Present Address
//           </Typography>
//           <Box display="flex" gap={2}>
//             <TextField
//               select
//               label="State"
//               sx={{ width: "300px" }}
//               value={presentAddress.state}
//               onChange={(e) =>
//                 handlePresentAddressChange("state", e.target.value)
//               }
//               required={!!getFieldRule("State").isMandatory}
//               error={getFieldRule("State").isMandatory && !presentAddress.state}
//               helperText={
//                 getFieldRule("State").isMandatory && !presentAddress.state
//                   ? "*Mandatory field"
//                   : ""
//               }
//             >
//               {states.map((s) => (
//                 <MenuItem key={s} value={s}>
//                   {s}
//                 </MenuItem>
//               ))}
//             </TextField>

//             <TextField
//               select
//               label="City"
//               sx={{ width: "300px" }}
//               value={presentAddress.city}
//               onChange={(e) =>
//                 handlePresentAddressChange("city", e.target.value)
//               }
//               required={!!getFieldRule("City").isMandatory}
//               error={getFieldRule("City").isMandatory && !presentAddress.city}
//               helperText={
//                 getFieldRule("City").isMandatory && !presentAddress.city
//                   ? "*Mandatory field"
//                   : ""
//               }
//             >
//               {(stateCityMap[presentAddress.state] || []).map((c) => (
//                 <MenuItem key={c} value={c}>
//                   {c}
//                 </MenuItem>
//               ))}
//             </TextField>

//             <TextField
//               label="Nearby Place"
//               sx={{ width: "300px" }}
//               value={presentAddress.nearbyPlace}
//               onChange={(e) =>
//                 handlePresentAddressChange("nearbyPlace", e.target.value)
//               }
//               required={!!getFieldRule("Nearby Place").isMandatory}
//               error={
//                 getFieldRule("Nearby Place").isMandatory &&
//                 !presentAddress.nearbyPlace.trim()
//               }
//               helperText={
//                 getFieldRule("Nearby Place").isMandatory &&
//                 !presentAddress.nearbyPlace.trim()
//                   ? "*Mandatory field"
//                   : ""
//               }
//               inputProps={{
//                 maxLength: getFieldRule("Nearby Place").length
//                   ? parseInt(getFieldRule("Nearby Place").length)
//                   : undefined,
//               }}
//             />
//           </Box>
//         </Box>

//         {/* Permanent Address */}
//         <Box
//           sx={{
//             border: "1px solid #ccc",
//             p: 3,
//             borderRadius: 2,
//             backgroundColor: "#fff",
//           }}
//         >
//           <Box display="flex" alignItems="center" gap={3} sx={{ mb: 2 }}>
//             <Typography variant="h6">Permanent Address</Typography>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={sameAsPresent}
//                   onChange={handleCheckboxChange}
//                 />
//               }
//               label="Same as Present Address"
//             />
//           </Box>
//           <Box display="flex" gap={2}>
//             <TextField
//               select
//               label="State"
//               sx={{ width: "300px" }}
//               value={permanentAddress.state}
//               onChange={(e) =>
//                 handlePermanentAddressChange("state", e.target.value)
//               }
//               disabled={sameAsPresent}
//               required={!!getFieldRule("State").isMandatory}
//               error={
//                 getFieldRule("State").isMandatory && !permanentAddress.state
//               }
//               helperText={
//                 getFieldRule("State").isMandatory && !permanentAddress.state
//                   ? "*Mandatory field"
//                   : ""
//               }
//             >
//               {states.map((s) => (
//                 <MenuItem key={s} value={s}>
//                   {s}
//                 </MenuItem>
//               ))}
//             </TextField>

//             <TextField
//               select
//               label="City"
//               sx={{ width: "300px" }}
//               value={permanentAddress.city}
//               onChange={(e) =>
//                 handlePermanentAddressChange("city", e.target.value)
//               }
//               disabled={sameAsPresent}
//               required={!!getFieldRule("City").isMandatory}
//               error={getFieldRule("City").isMandatory && !permanentAddress.city}
//               helperText={
//                 getFieldRule("City").isMandatory && !permanentAddress.city
//                   ? "*Mandatory field"
//                   : ""
//               }
//             >
//               {(stateCityMap[permanentAddress.state] || []).map((c) => (
//                 <MenuItem key={c} value={c}>
//                   {c}
//                 </MenuItem>
//               ))}
//             </TextField>

//             <TextField
//               label="Nearby Place"
//               sx={{ width: "300px" }}
//               value={permanentAddress.nearbyPlace}
//               onChange={(e) =>
//                 handlePermanentAddressChange("nearbyPlace", e.target.value)
//               }
//               disabled={sameAsPresent}
//               required={!!getFieldRule("Nearby Place").isMandatory}
//               error={
//                 getFieldRule("Nearby Place").isMandatory &&
//                 !permanentAddress.nearbyPlace.trim()
//               }
//               helperText={
//                 getFieldRule("Nearby Place").isMandatory &&
//                 !permanentAddress.nearbyPlace.trim()
//                   ? "*Mandatory field"
//                   : ""
//               }
//               inputProps={{
//                 maxLength: getFieldRule("Nearby Place").length
//                   ? parseInt(getFieldRule("Nearby Place").length)
//                   : undefined,
//               }}
//             />
//           </Box>
//         </Box>

//         {/* Submit Button */}
//         <Button
//           variant="contained"
//           color="primary"
//           sx={{ width: "300px", alignSelf: "flex-end", mt: 2 }}
//           onClick={handleSubmit}
//         >
//           Submit
//         </Button>
//       </Box>

//       {/* Snackbar */}
//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={2000}
//         onClose={() => setSnackbarOpen(false)}
//         message="Form submitted successfully!"
//       />
//     </Box>
//   );
// };

// export default EmployeeForm;

import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const EmployeeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // <-- Get ID from route

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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
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
      const index = parseInt(id, 10) - 1; // since IDs are index+1
      const emp = allEmployees[index];

      if (emp) {
        setFormData({
          name: emp.name || "",
          phone: emp.phone || "",
          email: emp.email || "",
          profilePic: emp.profilePic || "",
          id: emp.id, // preserve ID for update
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
      (emp) => emp.phone === formData.phone && emp.id !== formData.id
    );
    const duplicateEmail = stored.some(
      (emp) => emp.email === formData.email && emp.id !== formData.id
    );
    setDuplicatePhoneError(duplicatePhone);
    setDuplicateEmailError(duplicateEmail);
    return !(duplicatePhone || duplicateEmail);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields using config
    const allFieldsValid = Object.entries(formData).every(([key, value]) =>
      isValidField(key, value)
    );

    if (!allFieldsValid) {
      alert("Please fill all mandatory fields correctly.");
      return;
    }

    // Duplicate phone or email check using provided function
    const noDuplicates = checkDuplicates();
    if (!noDuplicates) {
      alert("Phone or Email already exists.");
      return;
    }

    const existingData = JSON.parse(localStorage.getItem("employeeData")) || [];

    // Flatten the address fields into top-level structure
    const formattedData = {
      ...formData,
      cityPresent: presentAddress.city || "",
      statePresent: presentAddress.state || "",
      nearbyPlacePresent: presentAddress.nearbyPlace || "",
      cityPermanent: permanentAddress.city || "",
      statePermanent: permanentAddress.state || "",
      nearbyPlacePermanent: permanentAddress.nearbyPlace || "",
    };

    // Remove nested address objects
    delete formattedData.presentAddress;
    delete formattedData.permanentAddress;

    let updatedData;
    const isEditMode = !!formData.id;

    if (isEditMode) {
      // Update existing employee using ID as array index (id - 1)
      updatedData = existingData.map((emp, index) =>
        index + 1 === formData.id ? { ...formattedData, id: formData.id } : emp
      );
    } else {
      // Set ID as next index + 1
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
        {/* Employee Details */}
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
              {[
                { label: "Name", key: "name" },
                { label: "Phone Number", key: "phone" },
                { label: "E-mail", key: "email" },
              ].map(({ label, key }) => {
                const value = formData[key];
                const rule = getFieldRule(label);
                const error = rule.isMandatory && !value.trim();
                const regexError = rule.pattern
                  ? value.trim() !== "" && !new RegExp(rule.pattern).test(value)
                  : false;
                const isDuplicate =
                  (label === "Phone Number" && duplicatePhoneError) ||
                  (label === "E-mail" && duplicateEmailError);
                return (
                  <TextField
                    key={key}
                    label={label}
                    sx={{ width: "300px" }}
                    value={value}
                    onChange={(e) => handleChange(key, e.target.value)}
                    required={!!rule.isMandatory}
                    error={error || regexError || isDuplicate}
                    helperText={
                      error
                        ? "*Mandatory field"
                        : regexError
                        ? `Invalid ${label}`
                        : isDuplicate
                        ? `${label} already exists`
                        : ""
                    }
                    inputProps={{
                      maxLength: rule.length ? parseInt(rule.length) : 100,
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        </Box>

        {/* Present Address */}
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

        {/* Permanent Address */}
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
