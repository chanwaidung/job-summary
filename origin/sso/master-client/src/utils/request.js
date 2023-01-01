import axios from 'axios'
import {ACCESS_TOKEN_DEFAULT_KEY, BASE_URL} from "../constants/base";

const instance = axios.create({
    timeout: 3000,
    baseURL: BASE_URL
})

instance.interceptors.request.use(config=> {
    config.headers['Authorization'] = `Bearer ${localStorage.getItem(ACCESS_TOKEN_DEFAULT_KEY)}`
    return config
}, error=> {
    return Promise.reject(error)
})

instance.interceptors.response.use(res=> {
    return Promise.resolve(res.data)
}, error => {
    if(error.response.status === 401) {
        window.location.href = `http://127.0.0.1:2048?redirect=${encodeURIComponent(window.location.href)}`
    }
    return Promise.reject(error)
})

export default instance
