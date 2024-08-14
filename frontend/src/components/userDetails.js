import React, { useEffect, useState } from "react";
import "../App.css";
import UserHome from "./userHome";
import { Navigate } from "react-router-dom";

export default function UserDetails() {
  const [userData, setUserData] = useState(null);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    fetch("https://startoonlabs-mz3z.onrender.com/userData", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        
        if (data.status === "error" && data.data === "token expired") {
          alert("Token expired, login again");
          window.localStorage.clear();
          window.location.href = "./sign-in";
        } else {
          setUserData(data.data);
          if (data.data.userType === "Admin") {
            setAdmin(true);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        // Handle error case
      });
  }, []);

  if (userData === null) {
    // Optionally, add a loading state or redirect
    return <p>Loading...</p>;
  }

  return (
    admin ? <h1>Welcome Admin</h1> : <UserHome userData={userData} />
  );
}
