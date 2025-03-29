import {Outlet} from "react-router-dom"
import AppHeader from "./components/layout/app.header.tsx";
import {useEffect} from "react";
import {fetchAccountAPI} from "./services/api.ts";
import {useCurrentApp} from "./components/context/app.context.tsx";
import {PacmanLoader} from "react-spinners";

function Layout  () {
    const {setUser,setIsAuthenticated,isAppLoading,setIsAppLoading} = useCurrentApp()
    useEffect(() => {
        const fetchAccount = async () => {
            const res = await fetchAccountAPI()
            console.log(res)
            if (res.data)
            {
                setUser(res.data.user)
                setIsAuthenticated(true)
            }
            setIsAppLoading(false)
        };
        fetchAccount();
    }, [setUser, setIsAuthenticated, setIsAppLoading]);
    return (
        <>
            {isAppLoading ? (
                <div
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <PacmanLoader size={50}  color="blue" />
                </div>
            ) : (
                <div>
                    <AppHeader />
                    <Outlet />
                </div>
            )}
        </>


    )
}
export default Layout