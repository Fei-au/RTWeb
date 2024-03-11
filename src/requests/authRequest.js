import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL;
const APP = 'staff'

export const login_admin = async(data)=>{
    const res = await axios.post(`${BACKEND_URL}${APP}/login_admin`, data, {'Content-Type': 'application/json'});
    return res.data;
}