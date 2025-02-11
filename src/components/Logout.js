import React from "react";
import { useAuth } from "./AuthContext";

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      style={{
        padding: "10px",
        background: "red",
        color: "white",
        border: "1px solid",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
