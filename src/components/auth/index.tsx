import * as React from "react";
import {useCurrentApp} from "../context/app.context.tsx";
import {Button, Result} from "antd";
import {Link, useLocation} from "react-router-dom";

interface IProps{
    children:React.ReactNode,
}
const ProtectedRoute = (props : IProps) =>{
    const {isAuthenticated,user } = useCurrentApp()
    const location = useLocation()
    console.log(location.pathname)
    // if (isAuthenticated){
    //     return (
    //         <Result
    //             status="404"
    //             title="Not login"
    //             subTitle="Please login to continue using!"
    //             extra={<Button type="primary"><Link to={"/login"}>Login</Link></Button>}
    //         />
    //     )
    // }
    // const isAdminRoute = location.pathname.includes("admin")
    // if ( isAuthenticated  && isAdminRoute === true ){
    //     const role = user?.role;
    //     if ( role === "USER" ){
    //         return (
    //             <Result
    //                 status="403"
    //                 title="403"
    //                 subTitle="Sorry, you are not authorized to access this page."
    //                 extra={<Button type="primary"><Link to={"/"}>Back Home</Link></Button>}
    //             />
    //         )
    //     }
    // }
    return (
        <div>
            {props.children}
        </div>
    )
}
export default ProtectedRoute
