import {Button, Divider, Form, FormProps, Input, message} from 'antd';
import { Link } from "react-router-dom";
import {registerAPI} from '../../../services/api.ts'
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
type FieldType = {
    fullName: string,
    email: string,
    password: string,
    phone: string,
};


const RegisterPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true)

        const {email, fullName,password, phone} = values
        const res = await registerAPI(fullName,email, password, phone);


        try {
            const { email, fullName, password, phone } = values;
            const res = await registerAPI(fullName, email, password, phone);

            console.log("API Response:", res);

            if (res) {
                message.success("Đăng ký user thành công!");
                navigate('/login');
            } else {
                message.error(res?.message || "Đã có lỗi xảy ra");
            }
        } catch (error) {
            console.error("Register Error:", error);
            message.error("Lỗi hệ thống, vui lòng thử lại sau!");
        } finally {
            setIsSubmit(false);
        }
    };
    return (
        <div
            className="page-register"
            style={{
                maxWidth: '30%',
                margin: '100px auto 0',
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
                Register
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
                        label="Full Name"
                        name="fullName"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
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

                    <Form.Item<FieldType>
                        label="Phone Number"
                        name="phone"
                        rules={[{ required: true, message: 'Please input your phone number!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isSubmit}
                        >
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <Divider>Or</Divider>
            <div style={{ fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>
                Already have an account? <Link to="/login">Login</Link>
            </div>
        </div>
    );
};

export default RegisterPage;
