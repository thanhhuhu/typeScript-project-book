import {Col, Row, Skeleton} from "antd";

const BookLoader = () =>{
    return (
        <>
            <div
                className="book-detail"
                style={{background:'#efefef'}}
            >
                <div
                    className="view-detail-book"
                    style={{maxWidth:1440,margin:"0 auto"}}
                >
                    <div
                        style={{padding:"20px", background:"#fff", borderRadius:5}}
                    >
                        <Row gutter={[20,20]} justify="center" align="middle">
                            <Col md={10} sm={24} xs={0}>
                                <Skeleton.Image
                                    active={true}
                                />
                                <Skeleton.Image
                                    active={true}
                                />
                                <Skeleton.Image
                                    active={true}
                                />
                            </Col>
                            <Col md={14} sm={24}>
                                <Col md={0} sm={24} xs={24}>
                                    <Skeleton.Input
                                        active={true}
                                        block={true}
                                        style={{width:"100%",height:50}}
                                    />
                                </Col>
                                <Col span={24}>
                                    <div className={"author"}>
                                        <Skeleton.Input
                                            active={true}
                                            block={true}
                                            style={{width:"100%",height:50}}
                                        />
                                    </div>
                                    <div className={"title"}>
                                        <Skeleton.Input
                                            active={true}
                                            block={true}
                                            style={{width:"100%",height:50}}
                                        />
                                    </div>
                                    <div className={"rating"}>
                                        <Skeleton.Input
                                            active={true}
                                            block={true}
                                            style={{width:"100%",height:50}}
                                        />
                                    </div>
                                    <div className={"price"}>
                                        <Skeleton.Input
                                            active={true}
                                            block={true}
                                            style={{width:"100%",height:50}}
                                        />
                                    </div>
                                    <div className={"delivery"}>
                                        <Skeleton.Input
                                            active={true}
                                            block={true}
                                            style={{width:"100%",height:50}}
                                        />
                                    </div>
                                    <div className={"quantity"}>
                                        <Skeleton.Input
                                            active={true}
                                            block={true}
                                            style={{width:"100%",height:50}}
                                        />
                                    </div>
                                    <div className={"buy"}>
                                        <Skeleton.Input
                                            active={true}
                                            block={true}
                                            style={{width:"100%",height:50}}
                                        />
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                    </div>
                </div>

            </div>
        </>
    )
}
export default BookLoader;