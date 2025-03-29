import axios from '../services/axios.customize.ts'
import {IRegister} from "../types/global";
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