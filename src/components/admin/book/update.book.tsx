import {App, Col, Divider, Form, Input, InputNumber, Modal, Row, Select, Upload} from "antd";
import {useEffect, useState} from "react";


interface IProps{
    updateBook:IBookTable | null,
    setUpdateBook: (v:IBookTable | null) => void,
    openViewUpdate:boolean,
    setOpenViewUpdate: (v:boolean) => void,
    refreshTable:()=>void,
}
type FieldType ={
    _id:string,
    mainText : string,
    author : string,
    quantity:string,
    price : string,
    category : string,
    thumbnail : never,
    slider:never,
}
const UpdateBook =(props:IProps) =>{
    const {updateBook,setUpdateBook,openViewUpdate,setOpenViewUpdate, refreshTable}=props
    const [form]= Form.useForm()
    const [iSubmit, setIsSubmit] = useState<boolean>(false)
    const {message,notification} =App.useApp()
    const [listCategory, setListCategory] = useState<{
        label:string,
        value:string,
    }[]>([])
    const onClose =() =>{
        setOpenViewUpdate(false);
        setUpdateBook(null);
    }
    useEffect(()=>{
        if (updateBook){
            form.setFieldsValue({
                _id:updateBook._id,
                maintext:updateBook.mainText,
                author:updateBook.author,
                quantity:updateBook.quantity,
                price:updateBook.price,
                category:updateBook.quantity,
                thumbnail:updateBook.thumbnail,
                slider:updateBook.thumbnail,
            })
        }
    },[updateBook])
    return (
        <>
            <Modal
                title="Update book"
                onClose={onClose}
                open={openViewUpdate}
                onOk={() => {
                    form.submit()
                }}
                onCancel={() => {
                    setOpenViewUpdate(false);
                    setUpdateBook(null)
                    form.resetFields();
                }}
                okText={"Save"}
                cancelText={"Cancel"}
                // confirmLoading={isSubmit}
            >
                <Form
                    form={form}
                    name={"basic"}
                    // onFinish={onFinish}
                    autoComplete="on"
                    layout="vertical"
                >
                    <Divider/>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                name="mainText"
                                label="Book name"
                                rules={[{required: true, message: 'Please input your book name!'}]}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                name="author"
                                label="Author"
                                rules={[{required: true, message: 'Please input your author!'}]}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item<FieldType>
                                name="price"
                                label="Price"
                                rules={[{required: true, message: 'Please input your price!'}]}
                            >
                                <InputNumber
                                    min={0}
                                    addonAfter="đ"
                                    style={{ width: '100%' }}
                                    formatter={(value) =>
                                        value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                                    }
                                    parser={(value) =>
                                        value?.replace(/\./g, '') || ''
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<FieldType>
                                label="Category"
                                name="category"
                                rules={[{required: true, message: 'Please input your category!'}]}
                            >
                                <Select
                                    defaultValue="Art"
                                    style={{ width: 120 }}
                                    options={listCategory}
                                    placeholder="Select a category"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item<FieldType>
                                label="Quantity"
                                name="quantity"
                                rules={[{required: true, message: 'Please input your quantity!'}]}
                            >
                                <InputNumber min={1} max={10000} defaultValue={3}  changeOnWheel />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                label="Thumbnail"
                                name="thumbnail"
                                rules={[{required: true, message: 'Please input your thumbnail!'}]}
                                valuePropName="fileList"
                                // getValueFromEvent={normFile}
                            >
                                <Upload
                                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                                    listType="picture-card"
                                    // fileList={fileListThumbnail}
                                    onChange={({ fileList }) => setFileListThumbnail(fileList)}
                                    // onPreview={onPreview}
                                    maxCount={1}
                                >
                                    {/*{fileListThumbnail.length >= 1 ? null : '+ Upload'}*/}
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                label="Photo slider"
                                name="slider"
                                rules={[{ message: 'Please upload slider images!' }]}
                                valuePropName="fileList"
                                // getValueFromEvent={normFile}
                            >
                                <Upload
                                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                                    listType="picture-card"
                                    // fileList={fileListSlider}
                                    onChange={({ fileList }) => setFileListSlider(fileList)}
                                    // onPreview={onPreview}
                                    multiple
                                >
                                    {/*{fileListSlider.length >= 10 ? null : '+ Upload'}*/}
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}
export default UpdateBook
