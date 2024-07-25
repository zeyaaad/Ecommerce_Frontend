import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    let go=useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    let id = localStorage.getItem("user_id");
    let token = localStorage.getItem("token");
  useEffect(() => {
    async function checkAuth() {
      
      if (id && token) {
        try {
          let res = await axios.post(`http://127.0.0.1:8000/api/eccomerce/auth/checklogin`,JSON.stringify(
            {
              "id":id,
              "token":token
            }
          ),{
            headers: {
          'Content-Type': 'application/json',
          }
        }
          );
          if (res.data.message) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.log(error)
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);





async function logout(){
      try {
          let res = await axios.post(`http://127.0.0.1:8000/api/eccomerce/auth/logout`,JSON.stringify(
            {"id":id,"token":token}
          ),{
            headers: {
          'Content-Type': 'application/json',
          }
        });
        localStorage.removeItem("user_id")
        localStorage.removeItem("token")
        localStorage.removeItem("id")
        go("/login")
        window.location.reload();
        
          
        } catch (error) {
          alert("err to logout")
          console.log(error)
          setIsAuthenticated(false);
        }
      }
  


  return (
    <header className="header">
      <nav className="navbar">
        <a href="#" className="nav-logo">CuriousAman</a>
        <ul className="nav-menuu" ref={navMenuRef}>
          {isAuthenticated ? <>
            <li className="nav-itemm">
            <Link to="/home" className="nav-linkk" ref={el => navLinkRefs.current[0] = el}>Home</Link>
          </li>
          <li className="nav-itemm">
            <Link to="/products" className="nav-linkk" ref={el => navLinkRefs.current[1] = el}>Prducts</Link>
          </li>
          <li className="nav-itemm">
            <Link to="/cart" className="nav-linkk" ref={el => navLinkRefs.current[2] = el}>Cart</Link>
          </li>
          <li className="nav-itemm">
            <Link to="/wishlist" className="nav-linkk" ref={el => navLinkRefs.current[3] = el}>wishlist</Link>
          </li>
          <li className="nav-itemm" onClick={logout}>
            <Link  className="nav-linkk" ref={el => navLinkRefs.current[3] = el}>Logout</Link>
          </li>
          </>:<>
          <li className="nav-itemm">
            <Link to="/login" className="nav-linkk" ref={el => navLinkRefs.current[4] = el}>Login</Link>
          </li>
          <li className="nav-itemm">
            
            <Link to="/register" className="nav-linkk" ref={el => navLinkRefs.current[5] = el}>Resister</Link>
          </li>
          </>}
          
        </ul>
        <div className="hamburger" ref={hamburgerRef}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </nav>
    </header>
  );
}
