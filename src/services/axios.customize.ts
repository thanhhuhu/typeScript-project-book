import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    // setcookies mỗi lần đăng ký đăng nhập
    withCredentials: true,
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Get token from localStorage
    const token = localStorage.getItem("access_token");
    const auth = token ? `Bearer ${token}` : '';
    config.headers['Authorization'] = auth;
    // sửa lỗi refresh f5 page mà không nhận được info user
    if (token) {
        // Remove quotes from token if they exist
        const cleanToken = token.replace(/"/g, '');
        config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Return the response data directly
    return response.data;
}, function (error) {
    // Handle 401 Unauthorized error
    // if (error.response?.status === 401) {
    //     // Clear token and redirect to login
    //     localStorage.removeItem("access_token");
    //     window.location.href = '/login';
    // }
    //
    if (error.response?.data) {
        return error.response.data;
    }
    return Promise.reject(error);
});

export default instance;