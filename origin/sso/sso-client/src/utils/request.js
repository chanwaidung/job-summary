import axios from 'axios'
import {BASE_URL} from "../constants/base";

const instance = axios.create({
    timeout: 3000,
    baseURL: BASE_URL
})

instance.interceptors.request.use(config=> {
    return config
}, error=> {
    return Promise.reject(error)
})

instance.interceptors.response.use(res=> {
    return Promise.resolve(res.data)
}, error => {
    return Promise.reject(error)
})

export default instance
