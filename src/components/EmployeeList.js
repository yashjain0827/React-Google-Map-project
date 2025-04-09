import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";

const EmployeeList = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [fieldConfig, setFieldConfig] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("employeeData");
    if (data) {
      setEmployeeData(JSON.parse(data));
    }
    const config = localStorage.getItem("fieldConfig");
    if (config) {
      setFieldConfig(JSON.parse(config));
    }
  }, []);

  const displayFields = fieldConfig.filter(
    ({ name }) => !["State", "City", "Nearby Place"].includes(name.trim())
  );

  return (
    <Box
      sx={{
        width: "100vw",
        height: "calc(100vh - 171px)",
        padding: 4,
        backgroundColor: "#f4f4f4",
        marginLeft: "60px",
        transition: "margin-left 0.3s ease",
      }}
    >
      <Typography variant="h4" sx={{ color: "#400c60", mb: 3 }}>
        Employee List
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ maxHeight: 650, overflow: "auto" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#400c60" }}>
              <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
                Sl No
              </TableCell>
              <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
                Profile
              </TableCell>
              {displayFields.map(({ name }) => (
                <TableCell
                  key={name}
                  sx={{ color: "#FFFFFF", fontWeight: "bold" }}
                >
                  {name}
                </TableCell>
              ))}
              <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
                Present Address
              </TableCell>
              <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
                Permanent Address
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employeeData.map((emp, index) => (
              <TableRow
                key={index}
                sx={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9" }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Avatar src={emp.profilePic} />
                </TableCell>
                {displayFields.map(({ name }) => {
                  const key = name.toLowerCase().replace(/\s+/g, "");
                  return <TableCell key={key}>{emp[key]}</TableCell>;
                })}
                <TableCell>
                  {emp.statePresent}, {emp.cityPresent},{" "}
                  {emp.nearbyPlacePresent}
                </TableCell>
                <TableCell>
                  {emp.statePermanent}, {emp.cityPermanent},{" "}
                  {emp.nearbyPlacePermanent}
                </TableCell>
              </TableRow>
            ))}
            {employeeData.length === 0 && (
              <TableRow>
                <TableCell colSpan={displayFields.length + 4} align="center">
                  No employee data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EmployeeList;
