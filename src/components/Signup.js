import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = (props) => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  
  const [errorMessages, setErrorMessages] = useState({
    nameError: "",
    emailError: "",
    passwordError: "",
    cpasswordError: "",
  });
  
  let navigate = useNavigate();
  const [error, setError] = useState(""); 
  // const [passwordmatchError, setPasswordMatchError] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, cpassword } = credentials;
    
    // Reset error messages
    setErrorMessages({
      nameError: "",
      emailError: "",
      passwordError: "",
      cpasswordError: "",
    });

    if (password !== cpassword) {
      setError("Passwords do not match.");
      return; // Stop submission
    }
    
    const response = await fetch("http://localhost:5000/api/auth/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password , cpassword}),
    });

    const json = await response.json();
    console.log(json);

    // if (json.error && json.error.field === "email") {
    //   setError(json.error.message);  // Display the error message
    // } else {
    //   setError(""); 
// debugger
    if (json.success) {
      // Save the auth token and redirect
      localStorage.setItem("token", json.authtoken);
      navigate("/");
      props.showAlert("Account created successfully", "success");
    }else if (json.error) {
      // Set specific error messages based on the field
      if (json.error.field === "email") {
        setErrorMessages((prevState) => ({
          ...prevState,
          emailError: json.error.message,
        }));
      } else if (json.error.field === "password") {
        setErrorMessages((prevState) => ({
          ...prevState,
          passwordError: json.error.message,
        }));
      }
    } else {
      setErrorMessages((prevState) => ({
        ...prevState,
        emailError: "An unexpected error occurred.",
      }));
    }
  
};

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError("");
  };
  return (
    <div className="container mt-2">
      <h2 className="my-2">Create an account to use iNotebook</h2>
    
      <form onSubmit={handleSubmit}>
        <div className="my-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            onChange={onChange}
            placeholder="Enter your Name"
            aria-describedby="emailHelp"
            required
          />
          {errorMessages.nameError && (
            <div className="text-danger">{errorMessages.nameError}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            onChange={onChange}
             placeholder="Enter your Email"
            aria-describedby="emailHelp"
            required
          />
          {errorMessages.emailError && (
            <div className="text-danger">{errorMessages.emailError}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            onChange={onChange}
            placeholder="Enter a strong password"
            minLength={5}
            required
          />
           {errorMessages.passwordError && (
            <div className="text-danger">{errorMessages.passwordError}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="cpassword"
            name="cpassword"
            onChange={onChange}
            placeholder="Confirm your password"
            minLength={5}
            required
          />
           {errorMessages.cpasswordError && (
            <div className="text-danger">{errorMessages.cpasswordError}</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Signup;
