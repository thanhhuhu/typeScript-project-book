import axios from '../services/axios.customize.ts'
import {IRegister, IResponseImport} from "../types/global";
import {ILogin} from "../types/global";
export const registerAPI =
    (fullName: string,
     email: string,
     password: string,
     phone: string,
    ) => {
    // truyền vào url + data
    const urlBackend = "/api/v1/user/register";
    return axios.post <IBackendRes<IRegister>> (urlBackend,{fullName, email, password, phone})
}
export const loginAPI =
    (username:string,
     password:string) =>{
    const urlBackend = "/api/v1/auth/login";
    return axios.post<IBackendRes<ILogin>> (urlBackend,{username, password})
}
export const fetchAccountAPI = async () => {
    const urlBackend = "/api/v1/auth/account";
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend, {
        headers: {
            delay: 1000
        }
    });
}
export const logoutAPI = ()=> {
    const urlBackend = "/api/v1/auth/logout";
    return axios.post<IBackendRes<IRegister>> (urlBackend)
}
export const getUsersAPI = (query:string)=> {
    const urlBackend = `/api/v1/user?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend)
}
export const createUserAPI = (
    fullName: string,
    password: string,
    email: string,
    phone: string
) =>{
    const urlBackend = "/api/v1/user";
    return axios.post<IBackendRes<IRegister>>(urlBackend, {fullName, password,email, phone})
}
export const bulkCreateUserAPI = (
    data: {
        fullName: string,
        password: string,
        email: string,
        phone: string,
    }[]) =>{
    const urlBackend = "/api/v1/user/bulk-create";
    return axios.post<IBackendRes<IResponseImport>>(urlBackend, data)
}