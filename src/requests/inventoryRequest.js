import axios from "axios";


const BACKEND_URL = process.env.BACKEND_URL;
const APP = 'inventory'

export const get_items = async(data)=>{
    console.log('data', data)
    const res = await axios.get(`${BACKEND_URL}${APP}/get_items`, {
        params: data
    }, {'Content-Type': 'application/json'});
    return res.data;
}

export const get_total_item = async()=>{
    const res = await axios.get(`${BACKEND_URL}${APP}/get_total_item`, {
        params: data
    }, {'Content-Type': 'application/json'});
    return res.data;
}

