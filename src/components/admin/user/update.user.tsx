import {App, Form, FormProps, Input, Modal} from "antd";
import {useEffect, useState} from "react";
import {updateUserAPI} from "../../../services/api.ts";

interface IProps {
    openModalUpdate: boolean,
    setOpenModalUpdate: (v: boolean) => void,
    dataDetailUpdate: IUserTable | null,
    setDataDetailUpdate: (v: IUserTable | null) => void,
    refreshTable: () => void,
}

type FieldType = {
    _id: string,
    fullName: string,
    email: string,
    phone: string,
}
const UpdateUser = (props: IProps) => {
    const {openModalUpdate, setOpenModalUpdate, dataDetailUpdate, setDataDetailUpdate, refreshTable} = props
    const [form] = Form.useForm()
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const {message, notification} = App.useApp()

    const onClose = () => {
        setOpenModalUpdate(false)
        setDataDetailUpdate(null)
    }
    useEffect(() => {
        if (dataDetailUpdate) {
            form.setFieldsValue({
                _id: dataDetailUpdate._id,
                fullName: dataDetailUpdate.fullName,
                email: dataDetailUpdate.email,
                phone: dataDetailUpdate.phone,
            })
        }
    }, [dataDetailUpdate])
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const {_id, fullName, phone} = values;
        setIsSubmit(true)
        const res = await updateUserAPI(_id, fullName, phone)
        if (res && res.data) {
            message.success("update user successfully")
            form.resetFields()
            setOpenModalUpdate(false)
            refreshTable()
        } else {
            notification.error({
                message: "Something went wrong",
                description: res.message
            })
        }
        setIsSubmit(false)
    }
    return (
        <>
            <Modal
                title="Update User"
                onClose={onClose}
                open={openModalUpdate}
                onCancel={() => {
                    setOpenModalUpdate(false)
                    setDataDetailUpdate(null)
                    form.resetFields()
                }}
                onOk={() => form.submit()}
                cancelText="Cancel"
                confirmLoading={isSubmit}
            >
                <Form
                    form={form}
                    name={"basic"}
                    onFinish={onFinish}
                    autoComplete="on"
                >
                    <Form.Item<FieldType>
                        hidden
                        label="_id"
                        name="_id"
                        labelCol={{span: 24}}
                        rules={[{required: true, message: 'Please input your email!'}]}
                    >
                        <Input
                            disabled={true}
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        labelCol={{span: 24}}
                        rules={[{required: true, message: 'Please input your email!'}]}
                    >
                        <Input disabled={true}/>
                    </Form.Item>
                    <Form.Item<FieldType>
                        name="fullName"
                        label="Full name"
                        labelCol={{span: 24}}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Phone number"
                        name="phone"
                        labelCol={{span: 24}}
                        rules={[{required: true, message: 'Please input your phone number!'}]}
                    >
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
        </>

    )
}
export default UpdateUser