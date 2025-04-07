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

  useEffect(() => {
    const data = localStorage.getItem("employeeData");
    if (data) {
      setEmployeeData(JSON.parse(data));
    }
  }, []);

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
        sx={{
          maxHeight: 650,
          overflow: "auto",
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#FF9F40" }}>
            <TableRow>
              <TableCell>Sl No</TableCell>
              <TableCell>Profile</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Present Address</TableCell>
              <TableCell>Permanent Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employeeData.map((emp, index) => (
              <TableRow key={index}>
                <TableCell>{emp.id}</TableCell>
                <TableCell>
                  <Avatar src={emp.profilePic} />
                </TableCell>
                <TableCell>
                  <Link
                    to={`/EmployeeForm/${emp.id}`}
                    style={{
                      color: "#007bff",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                  >
                    {emp.name}
                  </Link>
                </TableCell>
                <TableCell>{emp.phone}</TableCell>
                <TableCell>{emp.email}</TableCell>
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
                <TableCell colSpan={6} align="center">
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
