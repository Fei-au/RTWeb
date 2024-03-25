import axios from "axios";


const BACKEND_URL = process.env.BACKEND_URL;
const APP = 'inventory'

export const upload_sold_products = async (products)=>{
    try{
        const {data} = await axios.post(`${BACKEND_URL}${APP}/upload_sold_products`, products, {
                'Content-Type': 'multipart/form-data',
                'responseType': 'blob'
        });
        return data;
    }catch(err){
        console.log(err)
        throw(err);
    }
}

export const upload_url = `${BACKEND_URL}${APP}/upload_sold_products`