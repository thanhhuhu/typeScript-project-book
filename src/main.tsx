import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Layout from "./layout.tsx";
import BookPage from "./pages/client/book.tsx";
import AboutPage from "./pages/client/about.tsx";
import LoginPage from "./pages/client/auth/login.tsx";
import RegisterPage from "./pages/client/auth/register.tsx";
import HomePage from "./pages/client/home.tsx";
import {App} from "antd";
import {AppProvider} from "./components/context/app.context.tsx";
import ProtectedRoute from "./components/auth";
const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "/book",
                element: <BookPage />,
            },
            {
                path: "/about",
                element: <AboutPage />,
            },
            {
                path:"/checkout",
                element:(
                    <ProtectedRoute>
                        <div>checkout page</div>
                    </ProtectedRoute>
                   ),
            },
            {
                path:"/admin",
                element: (
                    <ProtectedRoute>
                        <div>admin page</div>
                    </ProtectedRoute>
                ),
            }
        ],
    },
    {
        path: "/login",
        element: <LoginPage/>,
    },
    {
        path: "/register",
        element:  <RegisterPage/>,

    },

]);
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App>
            <AppProvider>
                <RouterProvider router={router} />
            </AppProvider>
        </App>
    </StrictMode>,
)


