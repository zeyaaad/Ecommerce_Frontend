import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { projectcontext } from './context';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import './filterproductspage.css';

const Products = () => {
  const [filters, setFilters] = useState({
    min_price: '',
    max_price: '',
    category_id: '',
    brand_id: '',
    rating: '',
  });

  const { cartids, favids, setcartids, setfavids, addtocart, addtofav, setcountcart, setcountfav } = useContext(projectcontext);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  async function getproducts() {
    try {
      let res = await axios.get("http://127.0.0.1:8000/api/eccomerce/products");
      setProducts(res.data.data);
    } catch (error) {
      alert("Error getting products");
      console.log(error);
    }
  }

  useEffect(() => {
    getproducts();
    const fetchCategoriesAndBrands = async () => {
      try {
        const categoryResponse = await axios.get('http://127.0.0.1:8000/api/eccomerce/categories');
        const brandResponse = await axios.get('http://127.0.0.1:8000/api/eccomerce/brands');

        setCategories(categoryResponse.data.data);
        setBrands(brandResponse.data.data);
      } catch (error) {
        console.error('Error fetching categories and brands', error);
      }
    };

    fetchCategoriesAndBrands();
  }, []);

  const handleChange = async (e) => {
    const updatedFilters = {
      ...filters,
      [e.target.name]: e.target.value,
    };
    setFilters(updatedFilters);

    console.log('Filters:', updatedFilters); // Log filters for debugging

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/eccomerce/products/filter', updatedFilters);
      setProducts(response.data.data);
      if (response.data.data.length === 0) {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching the products!', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const handleAddToCart = async (productId) => {
    let allbtns = document.querySelectorAll(".btntocart");
    allbtns.forEach((e) => {
      e.classList.add("disabled");
    });
    if (cartids.includes(productId)) {
      toast.warn('Product Already In your cart');
      allbtns.forEach((e) => {
        e.classList.remove("disabled");
      });
      return;
    }
    try {
      let res = await addtocart(productId);
      setcountcart((prevCount) => prevCount + 1);
      setcartids((prevCartIds) => [...prevCartIds, productId]);
      toast.success('Product Added Successfully');
      allbtns.forEach((e) => {
        e.classList.remove("disabled");
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding to cart');
      allbtns.forEach((e) => {
        e.classList.remove("disabled");
      });
    }
  };

  const handleAddToFav = async (productId) => {
    let allbtns = document.querySelectorAll(".btntofav");
    allbtns.forEach((e) => {
      e.classList.add("disabled");
    });
    if (favids.includes(productId)) {
      toast.warn('Product Already In your wishlist');
      allbtns.forEach((e) => {
        e.classList.remove("disabled");
      });
      return;
    }
    try {
      let res = await addtofav(productId);
      setcountfav((prevCount) => prevCount + 1);
      setfavids((prevFavIds) => [...prevFavIds, productId]);
      toast.success('Product Added Successfully');
      allbtns.forEach((e) => {
        e.classList.remove("disabled");
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Error adding to wishlist');
      allbtns.forEach((e) => {
        e.classList.remove("disabled");
      });
    }
  };

  return (
    <div className="container filterproductpage">
      <button className="toggle-sidebar-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <i className="fa fa-filter"></i> Filter
      </button>

      <aside className={`filter-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Min Price:
              <input type="number" name="min_price" value={filters.min_price} onChange={handleChange} />
            </label>
          </div>
          <div className="form-group">
            <label>
              Max Price:
              <input type="number" name="max_price" value={filters.max_price} onChange={handleChange} />
            </label>
          </div>
          <div className="form-group">
            <label>
              Category:
              <select name="category_id" value={filters.category_id} onChange={handleChange}>
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.cat_id} value={category.cat_id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-group">
            <label>
              Brand:
              <select name="brand_id" value={filters.brand_id} onChange={handleChange}>
                <option value="">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand.brand_id} value={brand.brand_id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </form>
      </aside>

      <main className="product-list">
        <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">ALL Products</span></h2>

        <div className="row px-xl-5">
          {products.length > 0 ? (
            products.map((product, i) => (
              <div className="col-lg-4 col-md-6 col-sm-12 pb-1" key={product.id}>
                <div className="product-item bg-light mb-4">
                  <div className="product-img position-relative overflow-hidden">
                    <img className="img-fluid w-100 productimgg" src={`http://127.0.0.1:8001/images/products/main_imgs/${product.main_img}`} alt="" />
                    <div className="product-action">
                      <a className="btn btn-outline-dark btn-square btntocart" onClick={() => handleAddToCart(product.id)}><i className="fa fa-shopping-cart"></i></a>
                      <a className="btn btn-outline-dark btn-square" onClick={() => handleAddToFav(product.id)}><i className="far fa-heart"></i></a>
                      <Link className="btn btn-outline-dark btn-square btntofav" to={`/products/${product.id}`}><i className="fa fa-search"></i></Link>
                    </div>
                  </div>
                  <div className="text-center py-4">
                    <a className="h6 text-decoration-none text-truncate">{product.name}</a>
                    <div className="d-flex align-items-center justify-content-center mt-2">
                      <h5>{product.price}</h5><h6 className="text-muted ml-2"><del>{product.price + product.price / 4}</del></h6>
                    </div>
                    <div className="d-flex align-items-center justify-content-center mb-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <small key={index} className={`fa fa-star ${index < product.rating ? 'text-primary' : 'text-muted'} mr-1`}></small>
                      ))}
                      <small>({product.rating || 0})</small>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h3 className='text-center mt-5'>There are no products with these specifications.</h3>
          )}
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};

export default Products;
