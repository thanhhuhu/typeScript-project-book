import axios from '../services/axios.customize.ts'
import {IBookTable, ICreateBook, IRegister, IResponseImport} from "../types/global";
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
export const updateUserAPI = (_id: string, fullName: string, phone: string
    ) =>{
    const urlBackend = "/api/v1/user";
    return axios.put<IBackendRes<IRegister>>(urlBackend, {_id, fullName, phone})
}
export const deleteUserAPI = (_id:string) =>{
    const urlBackend = `/api/v1/user/${_id}`;
    return axios.delete<IBackendRes<IRegister>>(urlBackend)
}
export const getBooksAPI = (query:string) =>{
    const urlBackend = `/api/v1/book?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackend,{
        headers:{
            delay:1000
        }
    })
}
export const createBooksAPI = (
    mainText : string,
    author : string,
    quantity:string,
    price : string,
    category : string,
    thumbnail : any,
    slider:any,
) =>{
    const urlBackend = "/api/v1/book";
    return axios.post<IBackendRes<ICreateBook>>(urlBackend, {mainText, author,quantity, price,category, thumbnail, slider})
}
export const getCategoriesAPI = () =>{
    const urlBackend = "/api/v1/database/category";
    return axios.get<IBackendRes<string[]>>(urlBackend)
}
export const deleteBooksAPI = (_id:string) =>{
    const urlBackend = `/api/v1/book/${_id}`;
    return axios.delete<IBackendRes<ICreateBook>>(urlBackend)
}
export const updateBooksAPI = (
    _id:string,
    mainText: string,
    author : string,
    price:number,
    quantity:number,
    category:string,
    thumbnail:string,
    slider:string,
) =>{
    const urlBackend=`/api/v1/book/${_id}`;
    return axios.put<IBackendRes<ICreateBook>>(urlBackend, {mainText, author,quantity, price,category, thumbnail, slider})
}
export const getBookByIdAPI = (_id:string) =>{
    const urlBackend = `/api/v1/book/${_id}`;
    return axios.get<IBackendRes<IBookTable>>(urlBackend,
        {
            headers:{
                delay:0
            }
        }
        )
}