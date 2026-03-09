import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register({ goToLogin }) {

  const navigate = useNavigate();
  const [step,setStep] = useState(1);
  const [showPassword,setShowPassword] = useState(false);

  const [form,setForm] = useState({
    name:"",
    email:"",
    password:"",
    profession:"",
    organisationLevel:"",
    deadlineCompletion:"",
    usagePurpose:""
  });

  const change = (e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    });
  };

  const register = async ()=>{

    try{

      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          ...form,
          email: form.email.toLowerCase()
        }
      );

      alert("Account created");
      navigate("/");

    }catch(err){
      alert("Registration failed");
    }

  };

  return(

<div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">

<img
src="https://images.unsplash.com/photo-1484417894907-623942c8ee29"
className="absolute w-full h-full object-cover blur-sm opacity-40"
/>

<div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-black/60 to-pink-900/60"></div>

<div className="relative w-[1000px] h-[600px] grid grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-xl bg-white/10 hover:shadow-[0_25px_60px_rgba(236,72,153,0.35)] float-card">


{/* FORM LEFT */}

<div className="flex flex-col justify-center px-16 text-white">

<h2 className="text-3xl font-semibold mb-6">
Create Account
</h2>

<div className="flex gap-2 mb-8">

<div className={`h-2 flex-1 rounded ${step>=1?"bg-pink-500":"bg-gray-600"}`}></div>
<div className={`h-2 flex-1 rounded ${step>=2?"bg-pink-500":"bg-gray-600"}`}></div>
<div className={`h-2 flex-1 rounded ${step>=3?"bg-pink-500":"bg-gray-600"}`}></div>

</div>


{step===1 &&(

<>

<input
name="name"
placeholder="Full Name"
onChange={change}
className="bg-white/10 border border-white/20 rounded-lg p-3 mb-5 outline-none focus:border-pink-400"
/>

<input
name="email"
placeholder="Email"
onChange={change}
className="bg-white/10 border border-white/20 rounded-lg p-3 mb-5 outline-none focus:border-pink-400"
/>

<div className="relative mb-6">

<input
name="password"
type={showPassword?"text":"password"}
placeholder="Password"
onChange={change}
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
onClick={()=>setStep(2)}
className="bg-pink-500 hover:bg-pink-600 py-3 rounded-full"
>
Continue
</button>

</>

)}


{step===2 &&(

<>

<select
name="profession"
onChange={change}
className="bg-white/10 border border-white/20 rounded-lg p-3 mb-6"
>

<option value="">Select profession</option>
<option value="student">Student</option>
<option value="developer">Developer</option>
<option value="designer">Designer</option>

</select>

<select
name="usagePurpose"
onChange={change}
className="bg-white/10 border border-white/20 rounded-lg p-3 mb-6"
>

<option value="">How will you use the app?</option>
<option value="study">Study</option>
<option value="work">Work</option>

</select>

<button
onClick={()=>setStep(3)}
className="bg-pink-500 hover:bg-pink-600 py-3 rounded-full"
>
Continue
</button>

</>

)}


{step===3 &&(

<>

<select
name="organisationLevel"
onChange={change}
className="bg-white/10 border border-white/20 rounded-lg p-3 mb-6"
>

<option value="">How organised are you?</option>
<option value="very-organised">Very organised</option>
<option value="trying-to-improve">Trying to improve</option>

</select>

<select
name="deadlineCompletion"
onChange={change}
className="bg-white/10 border border-white/20 rounded-lg p-3 mb-6"
>

<option value="">Do you finish tasks before deadline?</option>
<option value="always">Always</option>
<option value="sometimes">Sometimes</option>

</select>

<button
onClick={register}
className="bg-pink-500 hover:bg-pink-600 py-3 rounded-full"
>
Register
</button>

</>

)}

<p className="text-sm text-gray-300 mt-8 text-center">

Already have an account?

<button
onClick={goToLogin}
className="text-pink-400 ml-2"
>
Login
</button>

</p>

</div>


{/* IMAGE RIGHT */}

<div className="relative">

<img
src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
className="w-full h-full object-cover"
/>

<div className="absolute inset-0 bg-gradient-to-br from-black/70 via-purple-900/60 to-pink-600/40"></div>

<div className="absolute bottom-10 left-10 text-white max-w-[250px]">

<h1 className="text-4xl font-bold">
Join TaskFlow
</h1>

<p className="text-sm opacity-80 mt-2">
Consistency today builds the discipline of tomorrow.
</p>

</div>

</div>

</div>

</div>

  );

}

export default Register;