import React, { useEffect, useState ,useContext} from 'react'
import Ratings from "react-ratings-declarative";
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "./style2.css";
import { projectcontext } from './context';
import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer, toast } from 'react-toastify';

export default function CategoryProducts() {
    let {id}=useParams();
    let allcontext=useContext(projectcontext)
    let {cartids,favids,setcartids,setfavids}=useContext(projectcontext)
    let [products,setProducts]=useState(null);
    let [cat_name,setCat_name]=useState(null)
    async function getproducts() {
        try {
            let res=await axios.get(`http://127.0.0.1:8000/api/eccomerce/categories/getproducts/${id}`)
            console.log(res)
            setCat_name(res.data.cat_name);
            setProducts(res.data.data)
        } catch (error) {
            alert("err to get products")
            console.log("error");
        }
    
    }
    useEffect(()=>{
        getproducts()
    },[])

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
  async function addtofav(productId) {
    if(favids.includes(productId)){
        toast.warn("Product Already In your wishlist ")
        return
    }
    try {
        let res = await allcontext.addtofav(productId)
        console.log(res);
        allcontext.setcountfav(allcontext.countfav+1);
        let newsids=favids;
        newsids.push(productId);
        setfavids(newsids);
        toast.success("Product Added Succesfully")
    } catch (error) {
        alert("error to add to fav ")
        console.log(error)
    }
  }

  return (
    <div >
          <div class="container-fluid pt-5 pb-3">
    {products?<>
        <h2 class="section-title position-relative text-uppercase mx-xl-5 mb-4"><span class="bg-secondary pr-3">ALL <span className='bg-primary' >{cat_name} </span> Products</span></h2>
                <ToastContainer/>
        <div class="row px-xl-5">
            {products.map((product,i)=>
            <div class="col-lg-3 col-md-4 col-sm-6 pb-1">
                <div class="product-item bg-light mb-4">
                    <div class="product-img position-relative overflow-hidden">
                        <img class="img-fluid w-100 productimgg" src={`http://127.0.0.1:8001/images/products/main_imgs/${product.main_img}`} alt=""/>
                        <div class="product-action">
                            <a class="btn btn-outline-dark btn-square" onClick={()=>addtocart(product.id)}><i class="fa fa-shopping-cart"></i></a>
                            <a class="btn btn-outline-dark btn-square"  onClick={()=>addtofav(product.id)}><i class="far fa-heart"></i></a>
                            <Link class="btn btn-outline-dark btn-square" to={`/products/${product.id}`}><i class="fa fa-search"></i></Link>
                        </div>
                    </div>
                    <div class="text-center py-4">
                        <a class="h6 text-decoration-none text-truncate" >{product.name}</a>
                        <div class="d-flex align-items-center justify-content-center mt-2">
                            <h5>{product.price}</h5><h6 class="text-muted ml-2"><del>{product.price+product.price/4}</del></h6>
                        </div>
                        <div class="d-flex align-items-center justify-content-center mb-1">
                             {Array.from({ length: 5 }).map((_, index) => (
                        <small key={index} className={`fa fa-star ${index < product.rating ? 'text-primary' : 'text-muted'} mr-1`}></small>
                      ))}
                      <small>({product.rating || 0})</small>
                        </div>
                    </div>
                </div>
            </div>
            )}
            
        </div>
                
                </>:""} 

    </div>

    </div>
  )
}
