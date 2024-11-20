import React, { useState } from "react";
import axios from "axios";
import { BACKENDBASEURL } from "../config";
function EducatorSignin() {
  const [studentInfo, setInfo] = useState({
    email:"",
    password:""
  });

  function handleChange(e, key) {
    setInfo((studentInfo) => ({
      ...studentInfo,
      [key]: e.target.value,
    }));
  }
  const [flag,setFlag]=useState(false)
  const handleClick=async (e)=>{
    e.preventDefault();
    if(studentInfo.email.trim()&&studentInfo.password.trim()){
      try {
        const baseURL = BACKENDBASEURL+`/edu/signin`;
        const response = await axios.post(baseURL,studentInfo,{
            withCredentials:true
        });
        if(response.status==200){

        }else{
          throw new Error("Login Failed");
          
        }
        setFlag(!flag)
        handleResponse(response.status)
        
    } catch (error) {
        console.error("Error: ", error);
        setFlag(!flag)
    }
    }
  }
  const handleResponse = (res) => {
    if (res === 200) {
      // Redirect to the "CreativeTools" page
      window.location.assign('/upload')
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5">Educator Login</h1>
      <form>
        {/* Add form fields for student registration */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your email"
            onChange={(e) => handleChange(e, "email")}
            value={studentInfo.email}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter your password"
            onChange={(e) => handleChange(e, "password")}
            value={studentInfo.password}
          />
        </div>
        
        {/* Add more fields as needed */}
        <button type="submit" onClick={handleClick} className="btn btn-primary">
          Signin
        </button>
      </form>
      {/*Add a dialog box*/}
      
    </div>
  );
}

export default EducatorSignin;
