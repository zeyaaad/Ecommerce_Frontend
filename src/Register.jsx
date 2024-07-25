import React, { useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [errs, setErrs] = useState({});
  const [err, setErr] = useState("");
  const [userdata, setUserdata] = useState({
    name: "",
    email: "",
    password: "",
    repass: "",
    phone: ""
  });
  let go=useNavigate();
  const schema = Yup.object().shape({
    name: Yup.string().matches(/^[a-zA-Z0-9_ ]*$/, 'Name can only contain letters, numbers, underscores, and spaces').required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    repass: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Re-Password is required'),
    phone: Yup.string()
      .matches(/^01[0125][0-9]{8}$/, 'Phone number must be a valid Egyptian number')
      .required('Phone number is required')
  });

  const getData = (e) => {
    const newData = { ...userdata };
    newData[e.target.name] = e.target.value.trim();
    setUserdata(newData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await schema.validate(userdata, { abortEarly: false });
      setErrs({});
      try {
          const response = await axios.post('http://127.0.0.1:8000/api/eccomerce/auth/register',JSON.stringify(userdata),{
          headers: {
            'Content-Type': 'application/json',
          }
        });
          console.log(response)
          if(response.data.message=="success") {
            go("/login")
          }

        }catch(err) {
        console.log(err.response)
        setErr(err.response.data.message);

        
        console.log("hamada err")
      }
    } catch (error) {
      const validationErrors = {};
      error.inner.forEach(err => {
        validationErrors[err.path] = err.message;
      });
      setErr("");
      console.log("hamada err")
      setErrs(validationErrors);
    }
  };




  return (
    <div>
      <form onSubmit={handleSubmit} className='w-75 mx-auto mt-3 border p-4'>
        <h2> Register  </h2>
        {err?<p className='alert alert-danger ' > {err} </p>:""}
        <label htmlFor="name" className='mt-2'>Name:</label>
        <input type="text" onChange={getData} name='name' className='form-control' />
        {errs.name && <div className="alert alert-danger p-1">{errs.name}</div>}
        
        <label htmlFor="email" className='mt-2'>Email:</label>
        <input type="text" onChange={getData} name='email' className='form-control' />
        {errs.email && <div className="alert alert-danger p-1">{errs.email}</div>}

        <label htmlFor="password" className='mt-2'>Password:</label>
        <input type="password" onChange={getData} name='password' className='form-control' />
        {errs.password && <div className="alert alert-danger p-1">{errs.password}</div>}

        <label htmlFor="repass" className='mt-2'>Re-Password:</label>
        <input type="password" onChange={getData} name='repass' className='form-control' />
        {errs.repass && <div className="alert alert-danger p-1">{errs.repass}</div>}

        <label htmlFor="phone" className='mt-2'>Phone:</label>
        <input type="text" onChange={getData} name='phone' className='form-control' />
        {errs.phone && <div className="alert alert-danger p-1">{errs.phone}</div>}

        <input type="submit" value="Register" className='btn btn-primary mt-4' />
      </form>
    </div>
  );
}
