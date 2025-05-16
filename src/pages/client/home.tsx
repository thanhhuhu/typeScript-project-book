// Các import giữ nguyên
import {
    Button,
    Checkbox,
    Col,
    Divider,
    Form,
    FormProps,
    InputNumber,
    Pagination,
    Rate,
    Row,
    Spin,
    Tabs,
    TabsProps
} from 'antd';
import { FaFilter } from "react-icons/fa";
import { IoReload } from "react-icons/io5";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import {getBooksAPI, getCategoriesAPI} from "../../services/api.ts";
import './home.scss'
import {useNavigate} from "react-router-dom";

type FieldType = {
    category?: string[];
    range?: {
        from?: number;
        to?: number;
    };
};

const HomePage = () => {
    const [listCategory, setListCategory] = useState<{ label: string, value: number }[]>([]);
    const [listBook, setListBook] = useState<IBookTable[]>([]);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("");
    const [sortQuerry, setSortQuerry] = useState<string>("sort=-sold");
    const navigate = useNavigate();
    const [form] = useForm();

    useEffect(() => {
        const initCategory = async () => {
            const res = await getCategoriesAPI();
            if (res && res.data) {
                const d = res.data.map((item: any) => ({
                    label: item,
                    value: item
                }));
                setListCategory(d);
            }
        };
        initCategory();
    }, []);

    useEffect(() => {
        fetchBook();
    }, [current, pageSize, filter, sortQuerry]);

    const fetchBook = async () => {
        setLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) query += `&${filter}`;
        if (sortQuerry) query += `&${sortQuerry}`;
        const res = await getBooksAPI(query);
        if (res && res.data) {
            setListBook(res.data.result);
            setTotal(res.data.meta.total);
        }
        setLoading(false);
    };

    const handleOnChangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination.current !== current) setCurrent(pagination.current);
        if (pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
    };

    const handleChangeFilter = (changedValue: any, values: any) => {
        if (changedValue.category) {
            const cate = values.category;
            if (cate && cate.length > 0) {
                const f = cate.join(',');
                setFilter(`category=${f}`);
            } else {
                setFilter('');
            }
        }
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const from = values.range?.from;
        const to = values.range?.to;
        let filterStr = "";
        if (from && to) filterStr = `price>=${from}&price<=${to}`;
        else if (from) filterStr = `price>=${from}`;
        else if (to) filterStr = `price<=${to}`;
        setFilter(prev => {
            const categoryFilter = prev.includes("category=") ? prev.split('&').find(p => p.includes("category=")) : '';
            return [categoryFilter, filterStr].filter(Boolean).join('&');
        });
    };

    const items: TabsProps['items'] = [
        { key: 'sort=-sold', label: 'Most Popular', children: <></> },
        { key: 'sort=-updatedAt', label: 'Latest', children: <></> },
        { key: 'sort=price', label: 'Price: High to Low', children: <></> },
        { key: 'sort=-price', label: 'Price: Low to High', children: <></> },
    ];

    return (
        <div className="homepage-containter" style={{ maxWidth: 1440, margin: '0 auto' }}>
            <Row gutter={[20, 20]}>
                <Col md={4} sm={0} xs={0} style={{ border: "1px  " }}>
                    <div style={{ justifyContent: 'space-between', display: 'flex' }}>
                        <span><FaFilter /> Filter</span>
                        <IoReload
                            cursor={"pointer"}
                            title={"Reset"}
                            onClick={() => {
                                form.resetFields();
                                setFilter('');
                            }}
                        />
                    </div>
                    <Divider />
                    <Form
                        onFinish={onFinish}
                        form={form}
                        onValuesChange={handleChangeFilter}
                        labelCol={{ span: 24 }}
                    >
                        <Form.Item name="category" label="List product">
                            <Checkbox.Group options={listCategory} />
                        </Form.Item>

                        <Form.Item
                            label="Price"
                            labelCol={{ span: 24 }}
                        >
                            <Row style={{ width: '100%' }}>
                                <Col xl={11} md={24}>
                                    <Form.Item name={["range", "from"]}>
                                        <InputNumber
                                            min={10000}
                                            placeholder="From VND"
                                            formatter={val => val?.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                            parser={val => val?.replace(/\./g, '') || ''}
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xl={2} md={0}>
                                    <div> - </div>
                                </Col>
                                <Col xl={11} md={24}>
                                    <Form.Item name={["range", "to"]} >
                                        <InputNumber
                                            min={0}
                                            placeholder="To VND"
                                            formatter={val => val?.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                            parser={val => val?.replace(/\./g, '') || ''}
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Button onClick={() => form.submit()} type="primary" style={{ marginTop: '10px', width: '100%' }}>
                                Confirm
                            </Button>
                        </Form.Item>

                        <Form.Item label="Rating">
                            {[5, 4, 3, 2, 1].map(r => (
                                <div key={r}>
                                    <Rate value={r} disabled style={{ color: 'deepskyblue' }} />
                                </div>
                            ))}
                        </Form.Item>
                    </Form>
                </Col>

                <Col md={20} sm={24} xs={24}>
                    <Spin spinning={loading} tip="Loading...">
                        <div style={{ padding: "20px", backgroundColor: "#fff" }}>
                            <Row>
                                <Tabs
                                    defaultActiveKey="sort=-sold"
                                    items={items}
                                    onChange={setSortQuerry}
                                    style={{ overflowX: 'auto' }}
                                />
                            </Row>
                            <Row className="customize-row" gutter={[16, 16]}>
                                {listBook?.map((item,index) =>{
                                    return (
                                        <>
                                            <div className={"column"} onClick={() => navigate(`/book/${item._id}`)}>
                                                <Col key={`book-${index}`} xs={20} sm={8} md={6} lg={4} xl={4}>
                                                    <div className="wrapper" style={{
                                                        border: "1px solid #eee",
                                                        padding: "20px",
                                                        borderRadius: "8px",
                                                        backgroundColor: "#fafafa",
                                                        display: "flex",
                                                        width:"200px",
                                                        flexDirection: "column",
                                                        transition: "transform 0.2s ease-in-out",
                                                    }}
                                                         onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                                                         onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                                    >
                                                        <div className="thumbnail" style={{ height: 150, marginBottom: 10 }}>
                                                            <img
                                                                src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`}
                                                                alt="thumbnail"
                                                                onClick={()=> navigate(`/book/${item._id}`)}
                                                            />
                                                        </div>
                                                        <div className="text" title={item.mainText} style={{
                                                            fontWeight: 500,
                                                            fontSize: "14px",
                                                            minHeight: "40px",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap",
                                                        }}>
                                                            {item.mainText}
                                                        </div>
                                                        <div style={{ marginTop: "auto" }}>
                                                            <div className="price" style={{ color: "red", margin: "5px 0" }}>
                                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.price)}
                                                            </div>
                                                            <div className="rating" style={{ fontSize: "12px" }}>
                                                                <Rate value={5} disabled style={{ fontSize: 12, color: "gold" }} />
                                                                <span style={{ marginLeft: 5 }}>Sold {item.sold ?? 0}</span>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </Col>
                                            </div>
                                        </>
                                    )
                                }
                                )}
                            </Row>
                            <Row justify="center" style={{ marginTop: 20 }}>
                                <Pagination
                                    current={current}
                                    total={total}
                                    pageSize={pageSize}
                                    responsive
                                    onChange={(p, s) => handleOnChangePage({ current: p, pageSize: s })}
                                />
                            </Row>
                        </div>
                    </Spin>
                </Col>
            </Row>
        </div>
    );
};

export default HomePage;
