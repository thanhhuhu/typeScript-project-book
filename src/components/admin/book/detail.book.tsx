import {
    Badge,
    Descriptions,
    Divider,
    Drawer,
    GetProp,
    Modal,
    Upload,
    UploadFile,
    UploadProps
} from "antd";
import dayjs from "dayjs";
import { FORMATE_DATE_VN } from "../../../services/helpers.ts";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid"; // ✅ Bổ sung thiếu

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IUserTable | null;
    setDataViewDetail: (v: IUserTable | null) => void;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const DetailBook = (props: IProps) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    };

    useEffect(() => {
        if (dataViewDetail) {
            const imgSlider: UploadFile[] = [];
            let imgThumbnail: UploadFile | null = null;

            if (dataViewDetail.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: dataViewDetail.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataViewDetail.thumbnail}`
                };
            }

            if (dataViewDetail.slider?.length > 0) {
                dataViewDetail.slider.map(item => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    });
                });
            }

            setFileList(imgThumbnail ? [imgThumbnail, ...imgSlider] : imgSlider);
        }
    }, [dataViewDetail]);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    return (
        <>
            <Drawer
                title={dataViewDetail?.mainText || "Book details"}
                onClose={onClose}
                open={openViewDetail}
                width={600}
            >
                <Descriptions title="User Info">
                    <Descriptions.Item label="Id">{dataViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="Book name">{dataViewDetail?.mainText}</Descriptions.Item>
                    <Descriptions.Item label="Author">{dataViewDetail?.author}</Descriptions.Item>
                    <Descriptions.Item label="Category">
                        <Badge status="processing">{dataViewDetail?.category}</Badge>
                    </Descriptions.Item>
                    <Descriptions.Item label="Price">
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: 'VND'
                        }).format(dataViewDetail?.price ?? 0)}
                    </Descriptions.Item>
                    <br />
                    <Descriptions.Item label="Created at" span={2}>
                        {dayjs(dataViewDetail?.createdAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated at">
                        {dayjs(dataViewDetail?.updatedAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>
                </Descriptions>
                <Divider orientation={"left"}>Photos of book</Divider>
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={{ showRemoveIcon: false }}
                >
                </Upload>
                <Modal
                    open={previewOpen}
                    title="Preview"
                    footer={null}
                    onCancel={() => setPreviewOpen(false)}
                >
                    <img
                        alt="preview"
                        style={{ width: '100%' }}
                        src={previewImage}
                    />
                </Modal>
            </Drawer>
        </>
    );
};

export default DetailBook;
