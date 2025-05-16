import React, { useState } from "react";
import authService from "../services/authService";

const SignUp = () => {
  const [userData, setUserData] = useState({});

  const handleSignUp = async () => {
    await authService.register(userData);
    alert("Registration successful!");
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <input
        type="text"
        placeholder="First Name"
        onChange={(e) =>
          setUserData({ ...userData, firstName: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Last Name"
        onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
      />
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default SignUp;
