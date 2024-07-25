import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Profile() {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [reNewPass, setReNewPass] = useState('');

  const [name, setName] = useState('Zeyad Mohamed');
  const [email, setEmail] = useState('zeyad@gmail.com');
  const [phone, setPhone] = useState('01122788620');

  const [changePassError, setChangePassError] = useState('');
  const [changeDataError, setChangeDataError] = useState('');
  const [errs, setErrs] = useState({});

  const userId = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');

    const[userData,setUserdata]=useState(null);

useEffect(()=>{
    getuserdata()
},[])
    async function getuserdata(){
        try {
            let res=await axios.post('http://127.0.0.1:8000/api/eccomerce/auth/getuserdata', {
        id: userId,
        token
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setUserdata(res.data.data);
        setName(res.data.data.name);
      setEmail(res.data.data.email);
      setPhone(res.data.data.phone);
        } catch (error) {
            alert("err to get user data")
            console.log(error)
        }
    }





  const passwordSchema = Yup.object().shape({
    current_pass: Yup.string().required('Current password is required'),
    new_pass: Yup.string().min(6, 'New password must be at least 6 characters').required('New password is required'),
    re_new_pass: Yup.string().oneOf([Yup.ref('new_pass'), null], 'Passwords must match').required('Re-new password is required'),
  });

  const dataSchema = Yup.object().shape({
    name: Yup.string().matches(/^[a-zA-Z0-9_ ]*$/, 'Name can only contain letters, numbers, underscores, and spaces').required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phone: Yup.string().matches(/^01[0125][0-9]{8}$/, 'Phone number must be a valid Egyptian number').required('Phone number is required'),
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await passwordSchema.validate({ current_pass: currentPass, new_pass: newPass, re_new_pass: reNewPass }, { abortEarly: false });
      setErrs({});
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/eccomerce/auth/changepass', {
        id: userId,
        token,
        currnet_pass: currentPass,
        new_pass: newPass,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.message === "success") {
        setChangePassError('');
        closecontpass()
        toast.success("Password changed successfully!")
      }
      } catch (error) {
        if(error.response.data.message=="Worng Currnet password") {
            setChangePassError(error.response.data.message)
        } else {
            alert("err cahnge pass")
            console.log(error)
        }
      }

    } catch (validationErrors) {
      const errors = {};
      validationErrors?.inner?.forEach(err => {
        errors[err.path] = err.message;
      });
      setErrs(errors);
    } 
  };

  const handleChangeData = async (e) => {
    e.preventDefault();
    try {
      await dataSchema.validate({ name, email, phone }, { abortEarly: false });
      setErrs({});

      try {
        const response = await axios.post('http://127.0.0.1:8000/api/eccomerce/auth/changedata', {
        id: userId,
        token,
        name,
        email,
        phone,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.message === "success") {
        setChangeDataError('');
        getuserdata();
        closecontdata()
        toast.success("Data changed successfully!");
      } 
      } catch (error) {
        if(error.response.data.message=='The email has already been taken.') {
            setChangeDataError(error.response.data.message)
            
        } else {
            alert("error change data")
            console.log(error)
        }
      }
    } catch (validationErrors) {
      const errors = {};
      validationErrors?.inner?.forEach(err => {
        errors[err.path] = err.message;
      });
      setErrs(errors);
    } 
  };

  function closecontpass(){
    document.querySelector('#contpass').classList.add('d-none')
    setErrs({})
  }
  function opencontdata(){
    document.querySelector('#contdata').classList.remove('d-none')
    setErrs({})
    setName(userData.name)
    setEmail(userData.email)
    setPhone(userData.phone)
  }
  function closecontdata(){
    document.querySelector('#contdata').classList.add('d-none')
    setErrs({})
  }
  
  return (
    <div className='conainer_fluid'>
        <ToastContainer/>
      <div id='contpass' className="contchangepass d-none" >
        <button onClick={closecontpass}  className='btn btn-close closecont'></button>
        <h5> Change Your Password </h5>
        <hr />
        <form onSubmit={handleChangePassword}>
          {changePassError && <p className='alert alert-danger mb-3'>{changePassError}</p>}
          <label htmlFor="current_pass">Current Password</label>
          <input className='form-control' type="password" value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} id="current_pass" />
          {errs.current_pass && <p className='alert alert-danger'>{errs.current_pass}</p>}
          <hr />
          <label htmlFor="new_pass">New Password</label>
          <input className='form-control' type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} id="new_pass" />
          {errs.new_pass && <p className='alert alert-danger'>{errs.new_pass}</p>}
          <label htmlFor="re_new_pass">Re-New Password</label>
          <input className='form-control' type="password" value={reNewPass} onChange={(e) => setReNewPass(e.target.value)} id="re_new_pass" />
          {errs.re_new_pass && <p className='alert alert-danger'>{errs.re_new_pass}</p>}
          <button className='btn btn-primary' type="submit">Change</button>
        </form>
      </div>

      
      {userData?<>
      <div  id='contdata' className="contchangepass d-none ">
        <button onClick={closecontdata} className='btn btn-close closecont'></button>
        <h5> Change Your Information </h5>
        <hr />
        <form onSubmit={handleChangeData}>
          {changeDataError && <p className='alert alert-danger mb-2'>{changeDataError}</p>}
          <label htmlFor="name">New Name</label>
          <input className='form-control' type="text" value={name} onChange={(e) => setName(e.target.value)} id="name" />
          {errs.name && <p className='alert alert-danger'>{errs.name}</p>}
          <label htmlFor="email">New Email</label>
          <input className='form-control' type="text" value={email} onChange={(e) => setEmail(e.target.value)} id="email" />
          {errs.email && <p className='alert alert-danger'>{errs.email}</p>}
          <label htmlFor="phone">New Phone</label>
          <input className='form-control' type="text" value={phone} onChange={(e) => setPhone(e.target.value)} id="phone" />
          {errs.phone && <p className='alert alert-danger'>{errs.phone}</p>}
          <button className='btn btn-primary' type="submit">Change</button>
        </form>
      </div>
        <h2 className="section-title position-relative text-uppercase mt-4 mx-xl-5 mb-4"><span className="bg-secondary pr-3">Profile Page</span></h2>
      <div className="container">
        <div className="contProfile">
          <h4 className='text-primary'>Your Information</h4>
          <hr />
          <h3>Name: {userData.name}</h3>
          <h3>Email: {userData.email}</h3>
          <h3>Phone: {userData.phone}</h3>
          <button className='btn btn-primary' onClick={() => document.querySelector('#contpass').classList.remove('d-none')}>Change Password</button>
          <button className='btn btn-info ms-4' onClick={opencontdata}>Change Data</button>
        </div>
      </div>
      </>:"Loading..."}
      
    </div>
  );
}
