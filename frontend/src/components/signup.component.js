import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import "../index.css";

// Register the components used by Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SignUp() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showData, setShowData] = useState(false); 
  const [userData, setUserData] = useState([]); 
  const [showGraph, setShowGraph] = useState(false); // State to toggle graph display

  const handleSubmit = (e) => {
    e.preventDefault();

    if (userType === "Admin") {
      if (adminEmail === "admin@email.com" && adminPassword === "Admin@123") {
        // Admin credentials are correct
        fetch("https://startoonlabs-mz3z.onrender.com/all-users", {
          method: "GET",
          crossDomain: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "ok") {
              setUserData(data.data);
              setShowData(true); 
            } else {
              alert("Failed to fetch user data");
            }
          });
      } else {
        alert("Invalid Admin credentials");
      }
    } else {
      // Handle regular user registration
      fetch("https://startoonlabs-mz3z.onrender.com/register", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          fname,
          email,
          lname,
          password,
          userType,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "ok") {
            alert("Registration Successful");
          } else {
            alert("Something went wrong");
          }
        });
    }
  };

  // Function to toggle between table and graph view
  const toggleGraph = () => {
    setShowGraph(!showGraph);
  };

  // Prepare data for bar graph
  const barData = {
    labels: userData.map((user) => `${user.fname} ${user.lname}`),
    datasets: [
      {
        label: 'Users',
        data: userData.map((user, index) => index + 1),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Data Bar Graph',
      },
    },
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        {!showData ? (
          <form onSubmit={handleSubmit}>
            <h3>{userType === "Admin" ? "Admin Login" : "Register"}</h3>
            <div>
              Register As
              <input
                type="radio"
                name="UserType"
                value="User"
                onChange={(e) => setUserType(e.target.value)}
              />
              User
              <input
                type="radio"
                name="UserType"
                value="Admin"
                onChange={(e) => setUserType(e.target.value)}
              />
              Admin
            </div>

            {userType === "Admin" ? (
              <>
                <div className="mb-3">
                  <label>Admin Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Admin Email"
                    onChange={(e) => setAdminEmail(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label>Admin Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Admin Password"
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="mb-3">
                  <label>First name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="First name"
                    onChange={(e) => setFname(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label>Last name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Last name"
                    onChange={(e) => setLname(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label>Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                {userType === "Admin" ? "Admin Login" : "Sign Up"}
              </button>
            </div>
            <p className="forgot-password text-right">
              Already registered <a href="/sign-in">Login?</a>
            </p>
          </form>
        ) : (
          <div>
            <h3>User Data</h3>
            <button className="btn btn-secondary" onClick={toggleGraph}>
              {showGraph ? "Show Table" : "Show Graph"}
            </button>
            {showGraph ? (
              <Bar data={barData} options={options} />
            ) : (
              <table className="user-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.map((user, index) => (
                    <tr key={user.email}>
                      <td>{index + 1}</td> {/* S.No column */}
                      <td>{user.fname}</td>
                      <td>{user.lname}</td>
                      <td>{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
