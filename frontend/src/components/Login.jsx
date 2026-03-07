import { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {

  const [isRegister,setIsRegister] = useState(false);

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleSubmit = async () => {

    try {

      if(isRegister){

        await axios.post(
          "http://localhost:5000/api/auth/register",
          { name,email,password }
        );

        alert("Account created. Please login.");
        setIsRegister(false);

      }else{

        const res = await axios.post(
          "http://localhost:5000/api/auth/login",
          { email,password }
        );

        localStorage.setItem("token",res.data.token);

        onLogin();

      }

    }catch(err){

      alert("Error: "+err.response?.data?.message || "Something went wrong");

    }

  };

  return(

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-md w-[350px]">

        <h2 className="text-2xl font-bold mb-6 text-center">

          {isRegister ? "Create Account" : "Login"}

        </h2>

        {isRegister && (

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="border p-2 rounded w-full mb-3"
          />

        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="border p-2 rounded w-full mb-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded"
        >

          {isRegister ? "Register" : "Login"}

        </button>

        <p className="text-center text-sm mt-4">

          {isRegister ? "Already have an account?" : "New user?"}

          <span
            onClick={()=>setIsRegister(!isRegister)}
            className="text-blue-500 cursor-pointer ml-1"
          >
            {isRegister ? "Login" : "Register"}
          </span>

        </p>

      </div>

    </div>

  );

}

export default Login;