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
import {App, ConfigProvider} from "antd";
import {AppProvider} from "./components/context/app.context.tsx";
import ProtectedRoute from "./components/auth";
import ManageOrderPage from "./pages/admin/manage.order.tsx";
import ManageUserPage from "./pages/admin/manage.user.tsx";
import ManageBookPage from "./pages/admin/manage.book.tsx";
import DashBoardPage from "./pages/admin/dashboard.tsx";
import LayoutAdmin from "./components/layout/layout.admin.tsx";
import enUS from 'antd/locale/en_US';
import viVN from 'antd/locale/vi_VN';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: "/book",
                path:"/book/:id",
                element: <BookPage />,
            },
            {
                path: "/about",
                element: <AboutPage />,
            },
            {
                path: "/checkout",
                element: (
                    <ProtectedRoute>
                        <div>checkout page</div>
                    </ProtectedRoute>
                ),
            }
        ]
    },
    {
        path: "admin",
        element: <LayoutAdmin />,
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute>
                        <DashBoardPage />
                    </ProtectedRoute>
                )
            },
            {
                path: "book",
                element: (
                    <ProtectedRoute>
                        <ManageBookPage />
                    </ProtectedRoute>
                )
            },
            {
                path: "order",
                element: (
                    <ProtectedRoute>
                        <ManageOrderPage />
                    </ProtectedRoute>
                )
            },
            {
                path: "user",
                element: (
                    <ProtectedRoute>
                        <ManageUserPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/admin",
                element: (
                    <ProtectedRoute>
                        <div>admin page</div>
                    </ProtectedRoute>
                ),
            },

        ]
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },

]);
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App>
            <AppProvider>
                <ConfigProvider locale ={enUS}>
                    <RouterProvider router={router} />
                </ConfigProvider>
            </AppProvider>
        </App>
    </StrictMode>,
)


