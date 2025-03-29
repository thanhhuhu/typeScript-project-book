import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Button, Divider, Form, FormProps, Input, message, notification} from "antd";
import {loginAPI} from "../../../services/api.ts";
import {useCurrentApp} from "../../../components/context/app.context.tsx";

type FieldType = {
    username: string,
    password: string,
};
const LoginPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();
    const {setIsAuthenticated, setUser} = useCurrentApp();
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
            setIsSubmit(true);
            const res = await loginAPI(values.username, values.password);
            console.log("API Response:", JSON.stringify(res, null, 2));

            if (res?.data?.access_token) {
                setIsAuthenticated(true);
                setUser({
                    ...res.data.user,
                    roles: res.data.user.role
                });
                localStorage.setItem("access_token", JSON.stringify(res.data.access_token));
                message.success("Login successfully!");
                navigate('/');
            } else {
                notification.error({
                    message: "Something went wrong",
                    description: res?.message || "Unknown error",
                    duration: 1
                });
                setIsSubmit(false);
            }

    };

    return (
        <div
            className="page-register"
            style={{
                maxWidth: '30%',
                margin: '150px auto 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50vh',
                background: '#FFE6E6',
                borderRadius: '10px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                padding: '20px'
            }}
        >
            <div
                style={{
                    textAlign: 'center',
                    fontSize: '30px',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                }}
            >
                Login
            </div>
            <div
                className="form-register"
                style={{
                    marginTop: '5px',
                    width: '90%',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Form
                    name="basic"
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                    style={{ width: '100%' }}
                >
                    <Form.Item<FieldType>
                        label="Email"
                        name="username"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Invalid email format!' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isSubmit}
                        >
                            login
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <Divider>Or</Divider>
            <div style={{ fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>
                Not already have an account? <Link to="/register">Register here</Link>
            </div>
            <div style={{ fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>
                 <Link to="/">Homepage</Link>
            </div>
        </div>
    )
}
export default LoginPage