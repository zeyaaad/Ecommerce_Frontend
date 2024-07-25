import { useEffect, useRef, useState,useContext } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "../Styles/main.css";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { projectcontext } from "../context";
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar() {
	const navRef = useRef();
  
    let {countcart,countfav}=useContext(projectcontext)
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
    var navs=document.querySelectorAll(".navItem")
    navs.forEach((e)=>{
      e.addEventListener("click" , function(){
        navs.forEach((i)=>{
          i.classList.remove("activeNav")
        })
        e.classList.add("activeNav")
      })
    })
      
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

	const showNavbar = () => {
		navRef.current.classList.toggle(
			"responsive_nav"
		);
	};

	return (
		<header className="navabaar">
      	<Link to="/home"><h3 className="titlehallo">Eccomerce</h3></Link>
			<nav ref={navRef}>
				{isAuthenticated?<>
				<Link className="navItem" to="/home">Home</Link>
				<Link className="navItem"  to="/products">All Products</Link>
				<Link  className="position-relative navItem" to="/cart">
          Cart   
        <FaShoppingCart size={24} color="goldenrod" /> 
         <span className="badge badge-danger position-absolute top-0 start-100 translate-middle">
                {countcart}
              </span></Link>
				<Link className="position-relative navItem" to="/wishlist">wishlist 
        <FaHeart size={24} color="goldenrod" /> 
        <span className="badge badge-danger position-absolute top-0 start-100 translate-middle">
                {countfav}
              </span>
        </Link>
				<Link to='/profile'>Profile</Link>
				<Link onClick={logout}>Logout</Link>
				</>:<>
				<Link className="navItem"  to="/login">Login</Link>
				<Link className="navItem"  to="/register">Register</Link>
				</>}
				
				
				
				<button
					className="nav-btn nav-close-btn"
					onClick={showNavbar}>
					<FaTimes />
				</button>
			</nav>
			<button
				className="nav-btn"
				onClick={showNavbar}>
				<FaBars />
			</button>
		</header>
	);
}

export default Navbar;
