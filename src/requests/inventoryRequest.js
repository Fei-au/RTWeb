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
    const res = await axios.get(`${BACKEND_URL}${APP}/get_total_item`, {'Content-Type': 'application/json'});
    return res.data;
}

export const get_status = async()=>{
    const res = await axios.get(`${BACKEND_URL}${APP}/status`, {'Content-Type': 'application/json'});
    return res.data;
}

export const update_item = async(data)=>{
    console.log('data', data);
    const {id, ...other} = data;
    const res = await axios.patch(`${BACKEND_URL}${APP}/update_item/${id}`, other, {'Content-Type': 'application/json'});
    return res.data;
}

export const export_items = async(data)=>{
    const res = await axios.post(`${BACKEND_URL}${APP}/export_items`, data, {'Content-Type': 'application/json', responseType: 'blob'});
    return res.data;
}