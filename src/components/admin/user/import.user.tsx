import {useState} from "react";
import {App, Button, Form, Modal, notification, Table, TableProps, Upload, UploadFile} from "antd";
import {InboxOutlined, UploadOutlined} from "@ant-design/icons";
import type { UploadProps } from 'antd'
const {Dragger} = Upload
import { Buffer } from 'buffer';
import ExcelJS from 'exceljs';
import {bulkCreateUserAPI} from "../../../services/api.ts";

interface IProps {
    openModalImport: boolean;
    setOpenModalImport:(v:boolean) => void;
    refreshTable: () => void;
}
interface IDataType {
    key: string;
    fullName: string;
    email: string;
    phone: string;
}

const ImportUser = (props: IProps) =>{
    const {openModalImport, setOpenModalImport, refreshTable} = props
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const {message} = App.useApp()
    const [dataImport, setDataImport] = useState<IDataType[]>([]);
    // const arrayBuffer = await file.arrayBuffer()
    // const buffer = Buffer.from(arrayBuffer)

    const propsUpload: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        //just accept file excel
        accept: ".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel",
        // loading
        customRequest({file, onSuccess}){
            setTimeout(() =>{
                if (onSuccess) onSuccess("oke")
            }, 1000)
        },
        async onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                console.log (info)
                message.success(`${info.file.name} file uploaded successfully.`);
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj!

                    //load file to buffer
                    const workbook = new ExcelJS.Workbook();
                    const arrayBuffer = await file.arrayBuffer()
                    const buffer = Buffer.from(arrayBuffer)
                    await workbook.xlsx.load(buffer);

                    //convert file to json
                    let jsonData:IDataType[] = [];
                    workbook.worksheets.forEach(function(sheet) {
                        // read first row as data keys
                        let firstRow = sheet.getRow(1);
                        if (!firstRow.cellCount) return;

                        let keys = firstRow.values as any;

                        sheet.eachRow((row, rowNumber) => {
                            if (rowNumber == 1) return;
                            let values = row.values
                            let obj: any = {};
                            for (let i = 1; i < keys.length; i ++) {
                                obj[keys[i]] = values[i];
                                obj.id = i
                            }
                            jsonData.push(obj);
                        })
                    });
                    jsonData = jsonData.map((item, index) => ({
                        ...item,
                        key: `${index}`,
                        id: index + 1,
                    }));

                    setDataImport(jsonData)
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },

    };
    const handleImport = async () =>{
        setIsSubmit(true);
        const dataSubmit = dataImport.map(item =>({
            fullName: item.fullName,
            email: item.email,
            phone: item.phone,
            password:import.meta.env.VITE_USER_CREATE_DEFAULT_PASSWORD
        }))
        const res = await bulkCreateUserAPI(dataSubmit)
        if ( res.data) {
            notification.success({
                message:"Bulk Created successfully.",
                description: ` Success = ${res.data.countSuccess}. Error = ${res.data.countError}`
            })
        }
        setIsSubmit(false);
        setOpenModalImport(false);
        setDataImport([]);
        refreshTable();
    }
    return (
        <>
            <Modal
                title={"Import data user"}
                open={openModalImport}
                onCancel={() =>{
                    setOpenModalImport(false)
                    setDataImport([]);
                }
            }
                onOk={() =>{
                    handleImport()
                }}
                okText={"Import"}
                cancelText={"Cancel"}
                // button always disabled before saving
                okButtonProps={{
                    disabled: dataImport.length <= 0,
                    loading: isSubmit,
                }}
                // dont close when click outside
                maskClosable={false}
                width={600}
            >
                    <Dragger {...propsUpload}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                            banned files.
                            <a href="">Download sample file</a>
                        </p>
                    </Dragger>
                    <Table <IDataType>
                        dataSource={dataImport}
                        title ={() => <span><b>Data upload</b></span>}
                        columns={[
                            {dataIndex: "fullName", title: 'Full name'},
                            {dataIndex: "email", title: 'Email'},
                            {dataIndex: "phone", title: 'Phone number'},
                        ]}
                    />
            </Modal>
        </>
    )
}
export default ImportUser