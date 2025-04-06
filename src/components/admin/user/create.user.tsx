import {App, Button, Divider, Form, FormProps, Input, Modal} from "antd";
import {useState} from "react";
import {createUserAPI} from "../../../services/api.ts";

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate:(v:boolean) => void;
    refreshTable:() => void
}
type FieldType ={
    fullName : string,
    email : string,
    password : string,
    phone : string,
}
const CreateUser = (props:IProps) =>{
    const {openModalCreate, setOpenModalCreate, refreshTable} = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [form] = Form.useForm();
    const {message, notification} = App.useApp()

    const onClose =() =>{
        setOpenModalCreate(false);
    }
    const onFinish: FormProps<FieldType>['onFinish'] = async (values)=>{
        const {fullName, password, email, phone} = values
        setIsSubmit(true);
        const res = await createUserAPI(fullName, password, email, phone)
        if ( res && res.data){
            message.success("Create user successfully!")
            form.resetFields();
            setOpenModalCreate(false);
            refreshTable()
        }else {
            notification.error({
                message:"Something went wrong",
                description:res.message
            })
        }
        setIsSubmit(false);
    }
    return (
        <>
            <Modal
                title="Create User"
                onClose={onClose}
                open={openModalCreate}
                onOk={() =>{form.submit()}}
                onCancel={() =>{
                    setOpenModalCreate(false);
                    form.resetFields();
                }}
                okText={"Save"}
                cancelText={"Cancel"}
                confirmLoading={isSubmit}

            >
                <Form
                    form={form}
                    name={"basic"}
                    onFinish={onFinish}
                    autoComplete="on"
                >
                    <Divider/>
                    <Form.Item<FieldType>
                        name="fullName"
                        label="Full name"
                        labelCol = {{span : 24}}
                        rules={[{ required: true, message: 'Please input your full name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Password"
                        name="password"
                        labelCol = {{span : 24}}
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        labelCol = {{span : 24}}
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Phone number"
                        name="phone"
                        labelCol = {{span : 24}}
                        rules={[{ required: true, message: 'Please input your phone number!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Divider/>
                </Form>
            </Modal>
        </>
    )
}
export default CreateUser