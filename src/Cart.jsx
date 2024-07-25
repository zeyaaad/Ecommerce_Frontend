import axios from 'axios';
import React, { useEffect, useState,useContext } from 'react'
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import {projectcontext} from './context'
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51Pg8KrJw4UM6YjPNg7r4BoglfjdXmGSgFEotAVzAMLFLrPegbYKoAA1Gzj85qyRg06dxPcMtbPClKbuOMqO2O3iA00yxIkXYrc');
export default function Cart() {
    const customer_id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    const[products,setProducts]=useState(null);
    const[arr_products,setArrProducts]=useState([]);
    const[total,setTotal]=useState(null);
    const[count,setcount]=useState(null);
    useEffect(()=>{
        getusercart()
    },[])
        let allcontext=useContext(projectcontext)


   
    async function getusercart() {
        try {
            let res = await axios.get("http://127.0.0.1:8000/api/eccomerce/cart", {
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    customer_id,
                    token
                }
            });
            console.log(res.data)
            var arr=[];
            res.data.data.forEach(product => {
                var prod={};
                prod["id"]=product.product_id;
                prod["quantity"]=product.quantity
                arr.push(prod)
            });
            setArrProducts(arr)
            setProducts(res.data.data);
            setTotal(res.data.total);
            setcount(res.data.count);
        } catch (error) {
            console.log(error);
        }
}


async function delproduct(product_id){
    try {
        let res = await axios.delete("http://127.0.0.1:8000/api/eccomerce/cart", {
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
            getusercart()
            allcontext.getcartids();
            allcontext.setcountcart(allcontext.countcart-1);
            toast.success("Product Deleted Suuccesufully")
            
    } catch (error) {
        alert("err to del product")
        console.log(error)
    }
}


async function makeOrder(){
    try {
        let res = await axios.post("http://127.0.0.1:8000/api/eccomerce/cart/order", {
            customer_id,
            token,
            products:arr_products,
            total
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

    console.log(res);
    } catch (error) {
        console.log(error);
        alert("err ro make order")
    }
}

async function clear(){
    try {
        let res = await axios.delete("http://127.0.0.1:8000/api/eccomerce/cart/clear", {
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    customer_id,
                    token
                }
            });
            console.log(res)
            getusercart()
            allcontext.setcountcart(0);
            allcontext.getcartids();
            toast.success("Your Cart Cleared ")
            
    } catch (error) {
        alert("err to clear product")
        console.log(error)
    }
}




async function updateadd(product_id, quant,type) {
    let quantity=0
    if(type=="plus") {
         quantity = quant + 1;
    } else {
        quantity = quant -1;
    }
    if (quantity < 1) {
        delproduct(product_id);
        return;
    }

    try {
        let res = await axios.put("http://127.0.0.1:8000/api/eccomerce/cart", 
            {
                customer_id,
                token,
                product_id,
                quantity
            }, 
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(res);
        getusercart();
        toast.success("Product Updated Successfully");
    } catch (error) {
        alert("Error updating product");
        console.log(error);
    }
}

const createCheckoutSession = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/eccomerce/checkout', {
                cart: products,
                success_url: 'http://localhost:3000/home',
                cancel_url: 'http://localhost:3000/cart',
            });
            const stripe = await stripePromise;
            await makeOrder();
            await clear();
            await stripe.redirectToCheckout({ sessionId: response.data.id });
        } catch (error) {
            console.error('Error creating checkout session:', error);
        }
    };


  return (
        <div className="container-fluid">
            <ToastContainer/>
            <h2 class="section-title position-relative text-uppercase mt-4 mx-xl-5 mb-4"><span class="bg-secondary pr-3">Your Cart</span></h2>
            {products?<>
            {products.length>0?
            <>
             <div className="container">
                  <div className="headerCart">
                    <div>
                     <h4> Total :{total}$  </h4>
                    <p>{count} Items</p>
                    </div>
                    <div>
                        <button className='btn btn-danger d-block' onClick={clear} > Clear Cart </button>
                        <button className='btn btn-primary mt-1 orderbtn ' onClick={createCheckoutSession} > Checkout </button>

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
                                <h5> {product.price}$ </h5>
                                <p className='btn btn-danger' onClick={()=>delproduct(product.product_id)} >  Delete </p>
                            </div>
                        </div>
                        <div className="operation">
                            <span className='btn btn-outline-danger me-1' onClick={()=>updateadd(product.product_id,product.quantity,"minus")}>-</span>
                            <span className='bg-warning p-2 quantiti' > {product.quantity} </span>
                            <span className='btn btn-outline-primary ms-1' onClick={()=>updateadd(product.product_id,product.quantity,"plus")}  > + </span>
                        </div>

                    </div>
                    )}
                    <div className='w-100'>
                    </div>
                  </div>
             </div>
            
            
            </>:<>
                <h2 className='text-center '> Your cart is empty </h2>
                <div className="backshop text-center mt-5">
                    <Link className='btn btn-primary' to="/products" >Back To shop</Link>
                </div>
            </>}
            </>:<>
                    <div className='cartloading'>
                        <span class="loader"></span>
                    </div>
            
            </>}
            <h5></h5>

        </div>
  )
}
