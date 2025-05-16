import {type ActionType, type ProColumns, ProTable} from "@ant-design/pro-components";
import {Button, message, notification, Popconfirm} from "antd";
import {AiOutlineExport} from "react-icons/ai";
import {PlusOutlined} from "@ant-design/icons";
import {MdAutoFixHigh, MdDelete} from "react-icons/md";
import {useRef, useState} from "react";
import {deleteBooksAPI, getBooksAPI} from "../../../services/api.ts";
import {dateRangeValidate} from "../../../services/helpers.ts";
import DetailBook from "./detail.book.tsx";
import {IBookTable} from "../../../types/global";
import CreateBook from "./create.book.tsx";
import dayjs from "dayjs";
import UpdateBook from "./update.book.tsx";

type TSearch = {
    mainText:string;
    author:string;
    price:string;
    quanity:string;
    category:string;
    createdAt : string;
    createdAtRange: string;
}
type TSort = {
    createAt : string;
    mainText : string;
    author: string;
    price: string;
}
const TableBook = () =>{
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages:0,
        total: 0,
    })
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IBookTable | null>(null);
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [deleteBook, setDeleteBook] = useState<boolean >(false);
    const [openViewUpdate, setOpenViewUpdate] = useState<boolean>(false);
    const [updateBook, setUpdateBook] = useState<IBookTable| null>(null);
    const columns: ProColumns<IUserTable>[] = [
        {
            title: 'Id',
            dataIndex: '_id',
            hideInSearch: true,
            render(entity){
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
            title: "Book name",
            dataIndex: 'mainText',
        },
        {
            title: 'Author',
            dataIndex: 'author',
            copyable: true,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            copyable: true,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            copyable: true,
            sorter: true,
            render (dom,entity){
                return (
                    <>
                        {new Intl.NumberFormat("vn-VN", {
                            style: "currency",currency:'VND'
                        }).format(entity.price)}
                    </>
                )
            }
        },
        {
            title: 'Day created',
            dataIndex: 'createdAt',
            sorter: true,
            valueType: 'dateRange',
            render: (_, entity) => (
                <>{dayjs(entity.createdAt).format('DD/MM/YYYY')}</>
            )
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
                                setOpenViewUpdate(true)
                                setUpdateBook(entity)
                            }
                            }
                        />
                        <Popconfirm
                            title={"Confirm delete book!"}
                            okText = "Confirm!"
                            cancelText="Cancel"
                            onConfirm={() => handleDeleteBook(entity._id)}
                            okButtonProps={{loading:deleteBook}}
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
    const handleDeleteBook = async (_id: string) => {
        setDeleteBook(true)
        const res = await deleteBooksAPI(_id)
        if (res && res.data) {
            message.success("Deleted book successfully!")
            refreshTable()
        }else {
            notification.error({
                message:"Delete book failed",
                description:res.message
            })
        }
        setDeleteBook(false);
    }
    return (
        <>
            <ProTable<IUserTable,TSearch,TSort>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter)
                    let query = ""
                    if (params){
                        query += `current=${params.current}&pageSize=${params.pageSize}`;
                        if (params.mainText){
                            query += `&mainText=/${params.mainText}/i`
                        }
                        if (params.author){
                            query += `&author=/${params.author}/i`
                        }
                        const createDateRange = dateRangeValidate(params.createdAtRange)
                        if (createDateRange){
                            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`;
                        }
                    }
                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                    }
                    if (sort && sort.mainText){
                        query += `&sort=${sort.mainText === "ascend" ? "mainText" : "-mainText"}`
                    }
                    if (sort && sort.author){
                        query += `&sort=${sort.author === "ascend" ? "author" : "-author"}`
                    }
                    if (sort && sort.price){
                        query += `&sort=${sort.price === "ascend" ? "price" : "-price"}`
                    }
                    const res = await getBooksAPI(query)
                    if (res.data) {
                        setMeta(res.data.meta)
                    }
                    return {
                        data:res.data?.result,
                        page:1,
                        success:true,
                        total:res.data?.meta.total
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
                headerTitle="Table book"
                toolBarRender={() => [
                    <>
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
                                setOpenModalCreate(true)
                            }}
                            type="primary"
                        >
                            Create new book
                        </Button>
                    </>
                ]}
            />
            <DetailBook
                openViewDetail ={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
            <CreateBook
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />
            <UpdateBook
                updateBook ={updateBook}
                setUpdateBook = {setUpdateBook}
                openViewUpdate = {openViewUpdate}
                setOpenViewUpdate = {setOpenViewUpdate}
                refreshTable = {refreshTable}
            />
        </>
    )
}
export default TableBook