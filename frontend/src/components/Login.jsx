import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ onLogin, goToRegister }) {

  const navigate = useNavigate();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [showPassword,setShowPassword] = useState(false);

  const handleLogin = async () => {

    try{

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: email.toLowerCase(),
          password
        }
      );

      localStorage.setItem("token",res.data.token);
      navigate("/dashboard");

    }catch(err){
      alert("Invalid credentials");
    }

  };

  return (

<div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">

<img
src="https://images.unsplash.com/photo-1484417894907-623942c8ee29"
className="absolute w-full h-full object-cover blur-sm opacity-40"
/>

<div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-black/60 to-pink-900/60"></div>

<div className="relative w-[1000px] h-[600px] grid grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-xl bg-white/10 hover:shadow-[0_25px_60px_rgba(236,72,153,0.35)] float-card">

{/* IMAGE */}

<div className="relative">

<img
src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
className="w-full h-full object-cover"
/>

<div className="absolute inset-0 bg-gradient-to-br from-black/70 via-purple-900/60 to-pink-600/40"></div>

<div className="absolute bottom-10 left-10 text-white max-w-[250px]">

<h1 className="text-4xl font-bold">
TaskFlow
</h1>

<p className="text-sm opacity-80 mt-2">
Small disciplined actions today build powerful habits tomorrow.
</p>

</div>

</div>


{/* FORM */}

<div className="flex flex-col justify-center px-16 text-white">

<h2 className="text-3xl font-semibold mb-10">
Login
</h2>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="bg-white/10 border border-white/20 rounded-lg p-3 mb-6 outline-none focus:border-pink-400"
/>


<div className="relative mb-10">

<input
type={showPassword ? "text":"password"}
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="w-full bg-white/10 border border-white/20 rounded-lg p-3 outline-none focus:border-pink-400"
/>

<button
type="button"
onClick={()=>setShowPassword(!showPassword)}
className="absolute right-3 top-3"
>
{showPassword ? "🙈":"👁"}
</button>

</div>


<button
onClick={handleLogin}
className="bg-pink-500 hover:bg-pink-600 py-3 rounded-full font-medium"
>
Login
</button>


<p className="text-sm text-gray-300 mt-8 text-center">

Don't have an account?

<button
onClick={goToRegister}
className="text-pink-400 ml-2"
>
Register
</button>

</p>

</div>

</div>

</div>

  );

}

export default Login;