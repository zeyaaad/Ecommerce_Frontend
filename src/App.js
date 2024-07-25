import logo from './logo.svg';
import './App.css';
import Register from './Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Home from './Home';
import Loading from './Loading';
import ProductDetalis from './ProductDetalis';
import Navbar from './Components/Navbar';
import CategoryProducts from './CategoryProducts';
import ContextPrivider from './context';
import Cart from './Cart';
import Wishlist from './Wishlist';
import Products from './Products';
import Teststart from './Teststar';
import Profile from './Profile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  
  useEffect(() => {
    async function checkAuth() {
      let id = localStorage.getItem("user_id");
      let token = localStorage.getItem("token");
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

  
function ProtectRoute({ children }) {

  if (isAuthenticated === null) {
    return <div>Loading...</div>; 
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}


function Protectloginreg({ children }) {

  if (isAuthenticated === null) {
    return <div>Loading...</div>; 
  }

  return isAuthenticated ? <Navigate to="/home" />  :children ;
}
  






  return (
    <>
    <ContextPrivider> 

    {isAuthenticated==null?
    <>
      <Loading/>
    </>
    :""}
    <Navbar/>
    <Routes>
        <Route path="/" element={ <Protectloginreg> <Login/></Protectloginreg> } />
        <Route path="/register" element={ <Protectloginreg> <Register/></Protectloginreg> } />
        <Route path="/login" element={ <Protectloginreg> <Login /> </Protectloginreg> } /> 
        <Route path="/home" element={ <ProtectRoute> <Home /> </ProtectRoute> } /> 
        <Route path="/cart" element={ <ProtectRoute> <Cart /> </ProtectRoute> } /> 
        <Route path="/wishlist" element={ <ProtectRoute> <Wishlist /> </ProtectRoute> } /> 
        <Route path="/star" element={ <ProtectRoute> <Teststart /> </ProtectRoute> } /> 
        <Route path="/products" element={ <ProtectRoute> <Products /> </ProtectRoute> } /> 
        <Route path="/profile" element={ <ProtectRoute> <Profile /> </ProtectRoute> } /> 
        <Route path='/products' element={<ProtectRoute><ProductDetalis/></ProtectRoute>} > 
            <Route path=':id' element={<ProtectRoute><ProductDetalis/></ProtectRoute>} /> 
        </Route>    
        <Route path='/category/products' element={<ProtectRoute><CategoryProducts/></ProtectRoute>} > 
            <Route path=':id' element={<ProtectRoute><CategoryProducts/></ProtectRoute>} /> 
        </Route>    
    </Routes>
      </ContextPrivider>

    </>
    




  );
}

export default App;
