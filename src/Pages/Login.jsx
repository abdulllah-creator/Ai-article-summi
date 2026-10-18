import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login(){

  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const navigate = useNavigate();


  const login = ()=>{

    const user =
      JSON.parse(localStorage.getItem("user"));


    if(!user){

      alert("Please register first");
      return;

    }


    if(
      email === user.email &&
      password === user.password
    ){

      localStorage.setItem(
        "loggedIn",
        "true"
      );

      navigate("/");

    }
    else{

      alert("Wrong email or password");

    }

  };


  return(

    <div className="container">

      <h1>
        Login
      </h1>


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


      <button onClick={login}>
        Login
      </button>


      <p>
        Don't have an account?

        <Link to="/register">
          Register
        </Link>

      </p>


    </div>

  );

}


export default Login;