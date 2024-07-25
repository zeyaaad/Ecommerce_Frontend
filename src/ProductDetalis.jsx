import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { projectcontext } from './context';
import StarRating from './StarRating'; // Import the StarRating component
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Pagination, Navigation } from 'swiper/modules';
export default function ProductDetalis() {
    let allcontext = useContext(projectcontext);
    let { cartids, favids, setcartids, setfavids } = useContext(projectcontext);
    let [comments, setComments] = useState(null);
    const [product, setProduct] = useState(null);
    const [rating, setRating] = useState(0);
    let { id } = useParams();

    // Fetch product details
    async function getproduct() {
        try {
            let res = await axios.get(`http://127.0.0.1:8000/api/eccomerce/products/${id}`);
            setProduct(res.data.data);
            
        } catch (error) {
            alert("Error getting product");
            console.log(error);
        }
    }

    // Fetch product comments
    async function getcomments() {
        try {
            let res = await axios.get(`http://127.0.0.1:8000/api/eccomerce/products/comments/${id}`);
            setComments(res.data.data);
        } catch (error) {
            alert("Error getting comments");
            console.log(error);
        }
    }

    async function getUserRating() {
        let customer_id = localStorage.getItem("user_id");
        if (customer_id) {
            try {
                let res = await axios.post(`http://127.0.0.1:8000/api/eccomerce/rating/check`, {
                customer_id,
                product_id: product.id
            });
                console.log(res)
                setRating(res.data.rating_exists || 0);
            } catch (error) {
                console.log("Error fetching user rating:", error);
            }
        }
    }

    useEffect(() => {
        getproduct();
        getcomments();
    }, []);

    useEffect(() => {
        if (product) {
            getUserRating();
        }
    }, [product]);

    // Handle rating change
    const handleRatingChange = async (newRating) => {
        setRating(newRating);
        let customer_id = localStorage.getItem("user_id");

        try {
            await axios.post("http://127.0.0.1:8000/api/eccomerce/rating/add", {
                customer_id,
                product_id: product.id,
                rating: newRating
            });
            toast.success("Rating updated successfully");
            getproduct()
            
        } catch (error) {
            toast.error("Error updating rating");
            console.log(error);
        }
    };

    // Add to cart
    async function addtocart(productId) {
        if (cartids.includes(productId)) {
            toast.warn("Product Already In your cart");
            return;
        }
        try {
            await allcontext.addtocart(productId);
            allcontext.setcountcart(allcontext.countcart + 1);
            setcartids([...cartids, productId]);
            toast.success("Product Added Successfully");
        } catch (error) {
            alert("Error adding to cart");
            console.log(error);
        }
    }

    // Add to wishlist
    async function addtofav(productId) {
        if (favids.includes(productId)) {
            toast.warn("Product Already In your wishlist");
            return;
        }
        try {
            await allcontext.addtofav(productId);
            allcontext.setcountfav(allcontext.countfav + 1);
            setfavids([...favids, productId]);
            toast.success("Product Added Successfully");
        } catch (error) {
            alert("Error adding to wishlist");
            console.log(error);
        }
    }

    // Handle review input change
    function handleChange(e) {
        setReview(e.target.value);
    }

    // Add comment
    async function addcomment() {
        let customer_id = localStorage.getItem("user_id");
        let token = localStorage.getItem("token");
        let product_id = product.id;
        let value = review;
        if (!value || value.trim().length < 1) {
            toast.error("Write The Value of Review");
            return;
        }
        try {
            await axios.post("http://127.0.0.1:8000/api/eccomerce/products/comments", {
                customer_id,
                token,
                product_id,
                value
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            toast.success("Review Added Successfully");
            document.getElementById("inputcomment").value = "";
            getcomments();
        } catch (error) {
            alert("Error adding comment");
            console.log(error);
        }
    }

    // Delete comment
    async function delcomment(id) {
        let customer_id = localStorage.getItem("user_id");
        let token = localStorage.getItem("token");
        let product_id = product.id;
        let comment_id = id;
        try {
            await axios.delete("http://127.0.0.1:8000/api/eccomerce/products/comments", {
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    customer_id,
                    token,
                    product_id,
                    comment_id
                }
            });
            toast.success("Review Deleted Successfully");
            getcomments();
        } catch (error) {
            alert("Error deleting comment");
            console.log(error);
        }
    }

    const [review, setReview] = useState(null);

    return (
        <div className="container mt-5 py-4 px-xl-5">
            <ToastContainer />
            {product ? (
                <>
                    <div className="row mb-4 productcondetalis">
                        <div className="col-lg-6">
                                <Swiper
                            pagination={{
                            type: 'fraction',
                            }}
                            navigation={true}
                            modules={[Pagination, Navigation]}
                            className="mySwiper"
                            >
                            {product.more_imgs.map((img, i) => (
                            <SwiperSlide key={i} className='contslide'>
                            <img
                            alt={`Product Image ${i}`}
                            className='imgdetalis'
                            src={`http://127.0.0.1:8001/images/products/more_imgs/${img}`}
                            />
                            </SwiperSlide>
                            ))}
                                </Swiper>
                        </div>

                        <div className="col-lg-5">
                            <div className="d-flex flex-column h-100">
                                <h2 className="mb-1">{product.name}</h2>

                                <div className="row g-3 mb-4">
                                    <div className="col">
                                        <button onClick={() => addtocart(product.id)} className="btn btn-dark py-2 w-100">
                                            Add to cart
                                        </button>
                                    </div>
                                    
                                    <div className="col">
                                        <button onClick={() => addtofav(product.id)} className="btn btn-outline-dark py-2 w-100">
                                            Add to Wishlist
                                        </button>
                                    </div>
                                </div>

                                <h4 className="mb-0">Details</h4>
                                <hr />
                                <dl className="row">
                                    <dt className="col-sm-4">Code</dt>
                                    <dd className="col-sm-8 mb-3">{product.id}</dd>

                                    <dt className="col-sm-4">Category</dt>
                                    <dd className="col-sm-8 mb-3">{product.cat_name}</dd>

                                    <dt className="col-sm-4">Brand</dt>
                                    <dd className="col-sm-8 mb-3">{product.BrandName}</dd>

                                    <dt className="col-sm-4">Status</dt>
                                    <dd className="col-sm-8 mb-3">Instock</dd>

                                    <dt className="col-sm-4">Rating</dt>
                                    <dd className="col-sm-8 mb-3">
                                        {Array.from({ length: 5 }).map((_, index) => (
                        <small key={index} className={`fa fa-star ${index < product.rating ? 'text-primary' : 'text-muted'} mr-1`}></small>
                      ))}
                      <small>({product.rating || 0})</small>
                                    </dd>
                                </dl>
                                <h5 className='mb-3'>
                                    <span>Your Rating :</span> <span className='mt-2'><StarRating rating={rating} onRatingChange={handleRatingChange} /></span>
                                </h5>

                                <h4 className="mb-0">Description</h4>
                                <hr />
                                <p className="lead flex-shrink-0">
                                    <small>{product.description}</small>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="row md-4 product comments">
                        <h5 className="section-title position-relative text-uppercase mx-xl-5 mb-4">
                            <span className="bg-secondary pr-3">Product reviews</span>
                        </h5>
                        <hr />
                        <div className="contcomments">
                            <h5 className='text-primary'>All reviews</h5>
                            {comments ? (
                                comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <div key={comment.id} className='commenttt mt-3'>
                                            <div>
                                                <h6 className='mb-0'>
                                                    {localStorage.getItem("user_id") == comment.customer_id ? "You" : comment.customer_name}
                                                </h6>
                                                <p className='ms-3'> -> {comment.value} </p>
                                            </div>
                                            {localStorage.getItem("user_id") == comment.customer_id ? (
                                                <button onClick={() => delcomment(comment.id)} className='btn btn-danger'> Delete </button>
                                            ) : null}
                                        </div>
                                    ))
                                ) : (
                                    <h5> There Are No Reviews About This Product </h5>
                                )
                            ) : "Loading..."}
                            <hr /> <hr />
                            <div className="addcomment">
                                <input onChange={handleChange} type="text" className='form-control d-inline w-75' id='inputcomment' />
                                <button onClick={addcomment} className='btn btn-primary'> Add </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : "Loading"}
        </div>
    );
}
