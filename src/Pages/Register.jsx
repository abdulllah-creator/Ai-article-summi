import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Register(){

const [name,setName]=useState("");
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const navigate = useNavigate();


const register=()=>{


const user={
name,
email,
password
};


localStorage.setItem(
"user",
JSON.stringify(user)
);


alert("Account created");


navigate("/login");


};


return(

<div className="container">


<h1>
Register
</h1>


<input
placeholder="Name"
onChange={(e)=>setName(e.target.value)}
/>


<br/><br/>


<input
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
/>


<br/><br/>


<input
type="password"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>


<br/><br/>


<button onClick={register}>
Register
</button>


</div>

);


}


export default Register;