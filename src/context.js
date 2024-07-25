import axios from "axios";
import { createContext, useState,useEffect } from "react";

export let projectcontext=createContext(0)
export default function ContextPrivider(props) {
    let [countcart , setcountcart]=useState(0)
    let [countfav , setcountfav]=useState(0)

        const customer_id = localStorage.getItem("user_id");
        const token = localStorage.getItem("token");


   
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

        console.log(res);
        setcountcart(res.data.count);
    } catch (error) {
        console.log(error);
    }
}

    async function getuserfav() {
    try {
        const customer_id = localStorage.getItem("user_id");
        const token = localStorage.getItem("token");

        let res = await axios.get("http://127.0.0.1:8000/api/eccomerce/wishlist", {
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                customer_id,
                token
            }
        });

        console.log(res);
        setcountfav(res.data.count);
    } catch (error) {
        console.log(error);
    }
}



    useEffect(()=>{
         if(localStorage.getItem("user_id") && localStorage.getItem("token")) { 
             getuserfav()
             getusercart()
             getfavids()
             getcartids()
            }
    },[])


   async function addtocart(product_id) {
    try {
        let res = await axios.post("http://127.0.0.1:8000/api/eccomerce/cart", {
            customer_id,
            token,
            product_id
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        console.log(res);
        return res;
    } catch (error) {
        console.log(error);
    }
}

   async function addtofav(product_id) {
    try {
        let res = await axios.post("http://127.0.0.1:8000/api/eccomerce/wishlist", {
            customer_id,
            token,
            product_id
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        console.log(res);
        return res;
    } catch (error) {
        console.log(error);
    }
}

const[cartids,setcartids]=useState(null)
const[favids,setfavids]=useState(null)
async function getcartids(){

        try {
   
        let res = await axios.get("http://127.0.0.1:8000/api/eccomerce/cart/getids", {
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                customer_id,
                token
            }
        });

        console.log(res);
        setcartids(res.data.data);
    } catch (error) {
        console.log(error);
    }
}
async function getfavids(){
        try {
   
        let res = await axios.get("http://127.0.0.1:8000/api/eccomerce/wishlist/getids", {
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                customer_id,
                token
            }
        });

        console.log(res);
        setfavids(res.data.data);
    } catch (error) {
        console.log(error);
    }
}



  
    return <projectcontext.Provider value={{addtocart,addtofav,countcart,setcountcart,countfav,setcountfav,favids,cartids,setcartids,setfavids,getcartids,getfavids}}>
        {props.children}
    </projectcontext.Provider>
}