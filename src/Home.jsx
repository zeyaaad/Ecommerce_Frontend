import React, { useEffect, useState ,useContext} from 'react'

import { Carousel } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { projectcontext } from './context';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

import { FreeMode, Pagination } from 'swiper/modules';
import "./style2.css";
import { ToastContainer, toast } from 'react-toastify';
export default function Home() {
    let allcontext=useContext(projectcontext)
    let {cartids,favids,setcartids,setfavids}=useContext(projectcontext)
    let [Products,setProducts]=useState(null);
    let [Brands,setBrands]=useState(null);
    let [Categories,setCategories]=useState(null);
    const customerId = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');


    useEffect(()=>{
        
        getcategories()
        getproducts()
        getbrands()
    },[])
    async function getproducts(){
        try {
            let res=await axios.get("http://127.0.0.1:8000/api/eccomerce/products");
            setProducts(res.data.data.slice(0,12));
        } catch (error) {
            alert("err get products")
            console.log(error)
        }
    }
    async function getbrands(){
        try {
            let res=await axios.get("http://127.0.0.1:8000/api/eccomerce/brands");
            setBrands(res.data.data)
        } catch (error) {
            alert("err get products")
            console.log(error)
        }
    }
    async function getcategories(){
        try {
            let res=await axios.get("http://127.0.0.1:8000/api/eccomerce/categories");
            setCategories(res.data.data)
            console.log(res)
        } catch (error) {
            alert("err get products")
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
<div className="-fluid">
   <div className="welcome">
     <Carousel  controls={false} indicators={false}    >
      <Carousel.Item >
        <img height={500}
          className="d-block carrr w-100"
          src="img1.jpg"
          alt="First slide"
        />
        <Carousel.Caption >
    <div className="carousel-caption-center">
          <h1 className='titlehallo' >Welcome to my Website </h1>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>

            </div>
        </Carousel.Caption>
      </Carousel.Item>

    </Carousel>
   </div>
       <div class="container-fluid pt-5">
        <div class="row px-xl-5 pb-3">
            <div class="col-lg-3 col-md-6 col-sm-12 pb-1">
                <div class="d-flex align-items-center bg-light mb-4 ppp" >
                    <h1 class="fa fa-check text-primary m-0 mr-3"></h1>
                    <h5 class="font-weight-semi-bold m-0">Quality Product</h5>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 pb-1">
                <div class="d-flex align-items-center bg-light mb-4 ppp" >
                    <h1 class="fa fa-shipping-fast text-primary m-0 mr-2"></h1>
                    <h5 class="font-weight-semi-bold m-0">Free Shipping</h5>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 pb-1">
                <div class="d-flex align-items-center bg-light mb-4 ppp" >
                    <h1 class="fas fa-exchange-alt text-primary m-0 mr-3"></h1>
                    <h5 class="font-weight-semi-bold m-0">14-Day Return</h5>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 pb-1">
                <div class="d-flex align-items-center bg-light mb-4 ppp" >
                    <h1 class="fa fa-phone-volume text-primary m-0 mr-3"></h1>
                    <h5 class="font-weight-semi-bold m-0">24/7 Support</h5>
                </div>
            </div>
        </div>
    </div>
   <div className="our_categories">
        <div className="container-fluid">
                <div class="container-fluid pt-5">
        <h2 class="section-title position-relative text-uppercase mx-xl-5 mb-4"><span class="bg-secondary pr-3">Categories</span></h2>
            {Categories?<>
        <div  class="row px-xl-5 pb-3">
            {Categories.map((cat,i)=>
            <div key={i} class="col-lg-3 col-md-4 col-sm-6 pb-1">
                <Link class="text-decoration-none" to={`/category/products/${cat.cat_id}`}>
                    <div class="cat-item d-flex align-items-center mb-4">
                        <div class="overflow-hidden categoryss" >
                            <img class="img-fluid imgcat" 
                            
                            src={`http://127.0.0.1:8001/images/categories/${cat.cat_img}`} 
                            alt=""/>
                        </div>
                        <div class="flex-fill pl-3">
                            <h6>{cat.name}</h6>
                            <small class="text-body">{cat.number_products} Products</small>
                        </div>
                    </div>
                </Link>
            </div>)}
    


        </div>
            </>:""}
    </div>
        </div>
   </div>

     <div class="container-fluid pt-5 pb-3">
        <ToastContainer/>
        <h2 class="section-title position-relative text-uppercase mx-xl-5 mb-4"><span class="bg-secondary pr-3">Recent Products</span></h2>
    {Products?<>
                
        <div class="row px-xl-5">
            {Products.map((product,i)=>
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


    
     <div class="container-fluid py-5">
                <h2 class="section-title position-relative text-uppercase mx-xl-5 mb-4"><span class="bg-secondary pr-3">Our Brands</span></h2>
        <div class="row px-xl-5">
          {Brands?
         <>
        <Swiper
        slidesPerView={7}
        spaceBetween={2}
        freeMode={true}
        pagination={{
          clickable: true,
        }}
        modules={[FreeMode, Pagination]}
        className="mySwiper"
      >
       
    {Brands.map((brand,i)=>

        <SwiperSlide>
            <div className='brandcont' >
                <img width={200} height={230} src={`http://127.0.0.1:8001/images/brands/${brand.brand_img}`}/>
            </div>
        </SwiperSlide>
            )}
    
            


      </Swiper>
      </>:""}
        </div>
    </div>
            <ToastContainer/>

    </div>




        // <div class="product-item bg-light mb-4 w-25">
        //             <div class="product-img position-relative overflow-hidden ">
        //                 <img class="img-fluid w-100" src="http://127.0.0.1:8001/images/products/main_imgs/main_img_1721546677_669cb7b5dcc71.png" alt=""/>
        //                 <div class="product-action">
        //                     <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-shopping-cart"></i></a>
        //                     <a class="btn btn-outline-dark btn-square" href=""><i class="far fa-heart"></i></a>
        //                     <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-sync-alt"></i></a>
        //                     <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-search"></i></a>
        //                 </div>
        //             </div>
        //             <div class="text-center py-4">
        //                 <h3 class="" href="">Product Name Goes Here</h3>
        //                 <div class="d-flex align-items-center justify-content-center mt-2">
        //                     <h5>$123.00</h5><h6 class="text-muted ml-2"><del>$123.00</del></h6>
        //                 </div>
        //                 <div class="d-flex align-items-center justify-content-center mb-1">
        //                     <small class="fa fa-star text-primary mr-1"></small>
        //                     <small class="fa fa-star text-primary mr-1"></small>
        //                     <small class="fa fa-star text-primary mr-1"></small>
        //                     <small class="fa fa-star text-primary mr-1"></small>
        //                     <small class="fa fa-star text-primary mr-1"></small>
        //                     <small>(99)</small>
        //                 </div>
        //             </div>
        //         </div>
    );
}
