import axios from 'axios';
import React, { useEffect, useState,useContext } from 'react'
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import {projectcontext} from './context'

export default function Wishlist() {
   const customer_id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    const[products,setProducts]=useState(null);
    const[count,setcount]=useState(null);
    useEffect(()=>{
        getuserfav()
    },[])
        let allcontext=useContext(projectcontext)
    let {cartids,favids,setcartids,setfavids}=useContext(projectcontext)


   
    async function getuserfav() {
        try {
            let res = await axios.get("http://127.0.0.1:8000/api/eccomerce/wishlist", {
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    customer_id,
                    token
                }
            });
            console.log(res.data.data)
            setProducts(res.data.data);
            setcount(res.data.count);
        } catch (error) {
            console.log(error);
        }
}


async function delproduct(product_id){
    try {
        let res = await axios.delete("http://127.0.0.1:8000/api/eccomerce/wishlist", {
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    customer_id,
                    token,
                    product_id
                }
            });
            console.log(res)
            getuserfav()
            allcontext.getfavids();
            allcontext.setcountfav(allcontext.countfav-1);
            toast.success("Product Deleted Suuccesufully")
            
    } catch (error) {
        alert("err to del product")
        console.log(error)
    }
}

async function clear(){
    try {
        let res = await axios.delete("http://127.0.0.1:8000/api/eccomerce/wishlist/clear", {
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    customer_id,
                    token
                }
            });
            console.log(res)
            getuserfav()
            allcontext.setcountfav(0);
            allcontext.getfavids();
            toast.success("Your Wishlist Cleared ")
            
    } catch (error) {
        alert("err to clear product")
        console.log(error)
    }
}

  async function addtocart(productId) {
    if(cartids.includes(productId)){
        toast.warn("Product Already In your cart ")
        return
    }
    try {
        let res = await allcontext.addtocart(productId)
        console.log(res);
        allcontext.setcountcart(allcontext.countcart+1);
        let newsids=cartids;
        newsids.push(productId);
        setcartids(newsids);
        toast.success("Product Added Succesfully")
    } catch (error) {
        alert("error to add to cartt ")
        console.log(error)
    }
  }






  return (
        <div className="container-fluid">
            <ToastContainer/>
            <h2 class="section-title position-relative text-uppercase mt-4 mx-xl-5 mb-4"><span class="bg-secondary pr-3">Your Wishlist</span></h2>
            {products?<>
            {products.length>0?
            <>
                
             <div className="container">
                  <div className="headerCart">
                    <div>
                    <p>{count} Items</p>
                    </div>
                    <div>
                        <button className='btn btn-danger' onClick={clear} > Clear Wishlist </button>
                    </div>
                  </div>
                  <hr />
                  <div className="cartproducts">
                    {products.map((product,i)=>
                    <div className='contcart' >
                        <div className="data">
                            <div className="img">
                            <Link to={`/products/${product.product_id}`} >
                                <img src={`http://127.0.0.1:8001/images/products/main_imgs/${product.img}`} alt="" />
                            </Link>
                            </div>
                            <div cl className='infoproduct' >
                                <h3> {product.name} </h3>
                                <p className='btn btn-danger' onClick={()=>delproduct(product.product_id)} >  Delete </p>
                            </div>
                        </div>
                        <div className="operation">
                            <span className='btn btn-primary p-2 'onClick={()=>addtocart(product.product_id)} > Add to cart </span>
                        </div>

                    </div>
                    )}
                  </div>
             </div>
            
            
            </>:<>
                <h2 className='text-center '> Your Wishlist is empty </h2>
                <div className="backshop text-center mt-5">
                    <Link className='btn btn-primary' to="/products" >Back To shop</Link>
                </div>
            </>}
            </>:<>loading</>}
            <h5></h5>

        </div>
  )
}

