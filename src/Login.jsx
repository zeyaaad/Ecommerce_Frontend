import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Yup from 'yup';

function Login() {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const[errs,seterrs]=useState({})
let go=useNavigate();
     const schema=Yup.object().shape({
        email:Yup.string().required("Email required").matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Write valid Email"),
        pass:Yup.string().required("Write The Password")
    });


  const handleSubmit = async (e) => {
    e.preventDefault();
      try {
            await schema.validate({"email":email.trim(),"pass":password.trim()},{abortEarly:false});
            seterrs({});
              try {
                 const response = await axios.post('http://127.0.0.1:8000/api/eccomerce/auth/login',
                 JSON.stringify({email:email , password:password}) , {
                      headers: {
                    'Content-Type': 'application/json',
                    }
                 });
                 console.log(response)
                if (response.data.message=="success") {
                  localStorage.setItem("token",response.data.token);
                  localStorage.setItem("user_id",response.data.user.id);
                  localStorage.setItem("user_data",JSON.stringify(response.data.user));
                    go('/home');
                    window.location.reload();
                } else {
                  setError(response.data.message);
                }
              } catch(err) {
                  console.log(err.response.data)
                if(err.response.data.message==="Wrong Email or password"){
                  setError("Invalid Email or pass");
                }
              }

        } catch (validationErrors) {
            var errors={}
            validationErrors?.inner?.forEach(err => {
                errors[err.path]=err.message;
                
            });
            seterrs(errors)
            
        }

  };

  return (
    <form className='w-75  p-4 border mx-auto mt-5' onSubmit={handleSubmit}>
      <h2> LogIn </h2>
            {error && <p className='alert alert-danger'>{error}</p>}

      <label className='mt-3' htmlFor="">Email:</label>
      <input className='form-control '
        type="text"
        value={email}
        onChange={(e) => setemail(e.target.value)}
        placeholder="email"
      />
                  {errs.email &&<p className='alert alert-danger'>{errs.email}</p>}

      <label className='mt-3' htmlFor="">Password:</label>
      <input
      
      className='form-control '
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
    {errs.pass &&<p className='alert alert-danger'>{errs.pass}</p>}

      <button className='btn btn-primary mt-5' type="submit">Login</button>
    </form>
  );
}

export default Login;
