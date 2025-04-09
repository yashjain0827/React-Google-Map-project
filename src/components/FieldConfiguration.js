import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TextField,
  Paper,
  Button,
  Modal,
  IconButton,
  FormControlLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

const FieldConfiguration = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [fields, setFields] = useState([]);

  useEffect(() => {
    const savedConfig = localStorage.getItem("fieldConfig");
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);

      const withDefaults = parsed.map((field) => {
        const isSystemField = ["Name", "Phone Number", "E-mail"].includes(
          field.name
        );

        let pattern = field.pattern || null;

        if (field.name === "Phone Number") {
          pattern = "^[6-9]\\d{9}$"; // Indian phone number regex
        } else if (field.name === "E-mail") {
          pattern = "^[\\w.-]+@[\\w.-]+\\.\\w{2,4}$"; // Simple email regex
        }

        return {
          ...field,
          showLength: field.showLength ?? field.length !== null,
          isMandatory: isSystemField ? true : field.isMandatory ?? false,
          length: field.length || "",
          pattern: pattern,
        };
      });

      setFields(withDefaults);
    } else {
      setFields([
        {
          name: "Name",
          showLength: true,
          isMandatory: true,
        },
        {
          name: "Phone Number",
          showLength: true,
          isMandatory: true,
          pattern: "^[6-9]\\d{9}$",
        },
        {
          name: "E-mail",
          showLength: true,
          isMandatory: true,
          pattern: "^[\\w.-]+@[\\w.-]+\\.\\w{2,4}$",
        },
        { name: "Nearby Place", showLength: true, isMandatory: false },
        { name: "State", showLength: false, isMandatory: false },
        { name: "City", showLength: false, isMandatory: false },
      ]);
    }
  }, []);

  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldMandatory, setNewFieldMandatory] = useState(false);
  const [newFieldHasLength, setNewFieldHasLength] = useState(false);

  const handleAddField = () => {
    const newField = {
      name: newFieldName.trim(),
      showLength: newFieldHasLength,
      isMandatory: newFieldMandatory,
    };

    const updatedFields = [...fields, newField];
    setFields(updatedFields);
    localStorage.setItem("fieldConfig", JSON.stringify(updatedFields));

    setNewFieldName("");
    setNewFieldMandatory(false);
    setNewFieldHasLength(false);
    setOpenModal(false);
  };

  const handleCheckboxChange = (index, value) => {
    const updated = [...fields];
    updated[index].isMandatory = value;
    setFields(updated);
  };

  const handleLengthChange = (index, value) => {
    const updated = [...fields];
    updated[index].length = value;
    setFields(updated);
  };

  const handleDeleteField = (indexToDelete) => {
    const updated = fields.filter((_, index) => index !== indexToDelete);
    setFields(updated);
    localStorage.setItem("fieldConfig", JSON.stringify(updated));
  };

  const handleSubmit = () => {
    const config = fields.map((field) => ({
      name: field.name,
      showLength: field.showLength,
      isMandatory: field.isMandatory,
      length: field.showLength ? field.length || "" : null,
      pattern: field.pattern || null,
    }));

    localStorage.setItem("fieldConfig", JSON.stringify(config));
    alert("Configuration saved!");
    setTimeout(() => {
      navigate("/employeeform");
    }, 1000);
  };

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "calc(100vh - 171px)",
        padding: 4,
        backgroundColor: "#f4f4f4",
        marginLeft: "60px",
        transition: "margin-left 0.3s ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Field Configuration
      </Typography>

      <TableContainer component={Paper} sx={{ width: "80%", maxWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Field Name</strong>
              </TableCell>
              <TableCell>
                <strong>Is Mandatory</strong>
              </TableCell>
              <TableCell>
                <strong>Length</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={`${field.name}-${index}`}>
                <TableCell>{field.name}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={field.isMandatory}
                    disabled={["Name", "Phone Number", "E-mail"].includes(
                      field.name
                    )}
                    onChange={(e) =>
                      handleCheckboxChange(index, e.target.checked)
                    }
                  />
                </TableCell>
                <TableCell>
                  {field.showLength ? (
                    <TextField
                      size="small"
                      value={field.length || ""}
                      onChange={(e) =>
                        handleLengthChange(index, e.target.value)
                      }
                      type="number"
                      inputProps={{ min: 1 }}
                    />
                  ) : (
                    "Not Applicable"
                  )}
                </TableCell>
                <TableCell>
                  {index >= 6 && (
                    <IconButton onClick={() => handleDeleteField(index)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ width: "200px" }}
          onClick={() => setOpenModal(true)}
        >
          Add New Field
        </Button>

        <Button
          variant="contained"
          color="primary"
          sx={{ width: "200px" }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            outline: "none",
            position: "relative",
          }}
        >
          <IconButton
            onClick={() => setOpenModal(false)}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" gutterBottom>
            Add New Field
          </Typography>

          <TextField
            label="Field Name"
            fullWidth
            margin="normal"
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={newFieldMandatory}
                onChange={(e) => setNewFieldMandatory(e.target.checked)}
              />
            }
            label="Is Mandatory"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={newFieldHasLength}
                onChange={(e) => setNewFieldHasLength(e.target.checked)}
              />
            }
            label="Has Length"
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddField}
            disabled={!newFieldName.trim()}
          >
            Add
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default FieldConfiguration;
