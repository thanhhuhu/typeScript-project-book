import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import {App, Button, Popconfirm} from 'antd';
import {useRef, useState} from 'react';
import {deleteUserAPI, getUsersAPI} from "../../../services/api.ts";
import {MdAutoFixHigh, MdDelete} from "react-icons/md";
import {dateRangeValidate} from "../../../services/helpers.ts";
import DetailUser from "./detail.user.tsx";
import CreateUser from "./create.user.tsx";
import {AiOutlineExport} from "react-icons/ai";
import {CiImport} from "react-icons/ci";
import ImportUser from "./import.user.tsx";
import UpdateUser from "./update.user.tsx";

type TSearch = {
    fullName: string;
    email: string;
    createdAt : string;
    createdAtRange: string;
}
type TSort = {
    createAt : string;
}
interface IProps{
    dataImport: string;
    setDataImport: (v: string) => void;
}
const TableUser = (props:IProps) => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages:0,
        total: 0,
    })
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null);
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [openModalImport, setOpenModalImport] = useState<boolean>(false);
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataDetailUpdate, setDataDetailUpdate] =  useState<IUserTable | null >(null);
    const [deleteUser, setDeleteUser] =useState<boolean>(false);
    //Using api show message and notification from Antd
    const {message, notification} = App.useApp()
    //Function delete user
    const handleDeleteUser = async (_id: string) => {
        setDeleteUser(true)
        const res = await deleteUserAPI (_id)
        if ( res && res.data){
            message.success("Delete user successfully!")
            refreshTable()
        }else {
            notification.error({
                message: 'Delete user failed!',
                description:res.message
            })
        }
        setDeleteUser(false)
    }
    //Table include user
    const columns: ProColumns<IUserTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'Id',
            dataIndex: '_id',
            hideInSearch: true,
            render(dom,entity){
                return (
                    <a href="#"
                       onClick={() => {
                           setDataViewDetail(entity)
                           setOpenViewDetail(true)
                       }}
                    >{entity._id}</a>
                )
            }
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            copyable: true,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAtRange',
            valueType: 'dateRange',
            hideInTable:true,
        },
        {
            title: 'Action',
            tooltip: '',
            hideInSearch: true,
            render:(entity) => (
                <>
                    <div>
                        <MdAutoFixHigh
                            style={{cursor: 'pointer', fontSize: 20, marginLeft: '10px'}}
                            onClick={() => {
                                setDataDetailUpdate(entity)
                                setOpenModalUpdate(true)
                            }
                        }
                        />
                        <Popconfirm
                            title={"Confirm delete user!"}
                            onConfirm={() => handleDeleteUser(entity._id)}
                            okText = "Confirm!"
                            cancelText="Cancel"
                            okButtonProps={{loading:deleteUser}}
                        >
                            <MdDelete
                                style={{cursor: 'pointer', fontSize: 20}}
                            />
                        </Popconfirm>
                    </div>
                </>
            )
        },
    ];
    const refreshTable = () => {
        actionRef.current?.reload()
    }
    return (
        <>
            <ProTable<IUserTable,TSearch,TSort>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params,sort, filter);
                    // create query to find
                    let query =""
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`;
                        if (params.email){
                            query += `&email=/${params.email}/i`
                        }
                        if (params.fullName){
                            query += `&fullName=/${params.fullName}/i`
                        }
                        const createDateRange = dateRangeValidate(params.createdAtRange)
                        if (createDateRange){
                            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`;
                        }
                    }
                    // sort user when click
                    // query += `sort=-createdAt`
                    // sort
                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                    }
                    const res = await getUsersAPI(query);
                    if ( res.data) {
                        setMeta(res.data.meta)
                    }
                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total
                    }

                }}
                rowKey="_id"
                pagination={{
                    current: meta.current,
                    pageSize:meta.pageSize,
                    showSizeChanger:true,
                    total: meta.total,
                    showTotal:(total,range) => {
                        return (<div>{range[0]}-{range[1]} on {total} rows</div>)
                    }
                }}
                headerTitle="Table user"
                toolBarRender={() => [
                    <>
                        <Button
                            key="button"
                            icon={<CiImport />}
                            onClick = {() =>{
                                setOpenModalImport(true)
                            }}
                            type="primary"
                        >
                            Import
                        </Button>
                        <Button
                            key="button"
                            icon={<AiOutlineExport />}
                            type="primary"
                        >
                            Export
                        </Button>
                        <Button
                            key="button"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setOpenModalCreate(true)}}
                            type="primary"
                        >
                            Create new user
                        </Button>

                    </>
                ]}
            />
            <DetailUser
                openViewDetail ={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
            <CreateUser
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />
            <ImportUser
                openModalImport={openModalImport}
                setOpenModalImport={setOpenModalImport}
                refreshTable={refreshTable}
            />
            <UpdateUser
                openModalUpdate ={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                dataDetailUpdate = {dataDetailUpdate}
                setDataDetailUpdate={setDataDetailUpdate}
                refreshTable = {refreshTable}
            />
        </>
    );
};

export default TableUser;