import {useEffect, useState} from "react";
import {
    App,
    Col,
    Divider,
    Form,
    FormProps,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Upload, UploadFile
} from "antd";
import {createBooksAPI, getCategoriesAPI} from "../../../services/api.ts";

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate:(v:boolean) => void;
    refreshTable:() => void
}
type FieldType ={
    mainText : string,
    author : string,
    quantity:string,
    price : string,
    category : string,
    thumbnail : never,
    slider:never,
}
const CreateBook = (props:IProps) =>{
    const {openModalCreate, setOpenModalCreate, refreshTable} = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [form] = Form.useForm();
    const {message, notification} = App.useApp()
    const [listCategory, setListCategory] = useState<{
        label:string,
        value:string,
    }[]>([]);
    const [fileListThumbnail,setFileListThumbnail]= useState<UploadFile[]>([]);
    const [fileListSlider,setFileListSlider]=useState<UploadFile[]>([]);

    // const [previewImage,setPreviewImage]=useState<boolean>(false)
    // const [previewOpen,setPreviewOpen]=useState<string>('');
    //
    // const [loadingThumbnail,setLoadingThumbnail]=useState<boolean>(false)
    // const [loadingSlider,setLoadingSlider]=useState<boolean>(false)

    useEffect(() => {
        const fetchCategory =async()=>{
            const res = await getCategoriesAPI();
            if (res && res.data){
                const d = res.data.map(item=>{
                    return {
                        label:item,
                        value:item,
                    }
                })
                setListCategory(d)
            }
        }
        fetchCategory()
    }, []);
    const onClose =() =>{
        setOpenModalCreate(false);
    }
    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src && file.originFileObj) {
            src = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as File);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values)=>{
        setIsSubmit(true);
        const {mainText, author, price,quantity, category } = values
        const thumbnail = fileListThumbnail?.[0].name??"";
        const slider =fileListSlider?.map(item =>item.name)??[]
        const res = await createBooksAPI(mainText, author, quantity,price, category, thumbnail,slider)
        if ( res && res.data){
            message.success("Create user successfully!")
            form.resetFields();
            setFileListSlider([]);
            setFileListThumbnail([]);
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
    const normFile = (e: never) => Array.isArray(e) ? e : e?.fileList;

    return (
        <>
            <Modal
                title="Create book"
                onClose={onClose}
                open={openModalCreate}
                onOk={() => {
                    form.submit()
                }}
                onCancel={() => {
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
                                getValueFromEvent={normFile}
                            >
                                    <Upload
                                        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                                        listType="picture-card"
                                        fileList={fileListThumbnail}
                                        onChange={({ fileList }) => setFileListThumbnail(fileList)}
                                        onPreview={onPreview}
                                        maxCount={1}
                                    >
                                        {fileListThumbnail.length >= 1 ? null : '+ Upload'}
                                    </Upload>
                        </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                label="Photo slider"
                                name="slider"
                                rules={[{ message: 'Please upload slider images!' }]}
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                                    listType="picture-card"
                                    fileList={fileListSlider}
                                    onChange={({ fileList }) => setFileListSlider(fileList)}
                                    onPreview={onPreview}
                                    multiple
                                >
                                    {fileListSlider.length >= 10 ? null : '+ Upload'}
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}
export default CreateBook;