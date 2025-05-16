import ImageGallery from "react-image-gallery";
import {useEffect, useRef, useState} from "react";
import "./book.detail.scss";
import {Col, Divider, Rate, Row} from "antd";
import {MinusOutlined, PlusOutlined} from "@ant-design/icons";
import {FaShoppingCart} from "react-icons/fa";
import "react-image-gallery/styles/css/image-gallery.css";
import ModalGallery from "./modal.gallery.tsx";
interface IProps {
    currentBook: IBookTable| null
}
const BookDetail = (props:IProps) => {
    const {currentBook} = props;
    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const refGallery = useRef<ImageGallery>(null)
    const handleOnClickImage =() =>{
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex()??0);
    }
    const [imageGallery,setImageGallery] = useState<{
        original:string,
        thumbnail:string,
        originalClass:string,
        thumbnailClass:string,
    }[]>([])
    useEffect(()=>{
        if ( currentBook){
            const images =[]
            if (currentBook.thumbnail){
                images.push(
                    {
                        original:`${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook}`,
                        thumbnail:`${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook}`,
                        originalClass:"original-image",
                        thumbnailClass:"thumnail-images"
                    },
                )
            }
            if ( currentBook.slider) {
                currentBook.slider?.map(item=>{
                    images.push(
                        {
                            original:`${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook}`,
                            thumbnail:`${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook}`,
                            originalClass:"original-image",
                            thumbnailClass:"thumnail-images"
                        },
                    )
                })
            }
            setImageGallery(images)
        }
    }, [currentBook]);
    // const images = [
    //     {
    //         original: "https://picsum.photos/id/1018/1000/600/",
    //         thumbnail: "https://picsum.photos/id/1018/250/150/",
    //         originalClass:"original-image",
    //         thumbnailClass:"thumbnail-image",
    //     },
    //     {
    //         original: "https://picsum.photos/id/1015/1000/600/",
    //         thumbnail: "https://picsum.photos/id/1015/250/150/",
    //         originalClass:"original-image",
    //         thumbnailClass:"thumbnail-image",
    //     },
    //     {
    //         original: "https://picsum.photos/id/1019/1000/600/",
    //         thumbnail: "https://picsum.photos/id/1019/250/150/",
    //         originalClass:"original-image",
    //         thumbnailClass:"thumbnail-image",
    //     },
    // ];
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
                                <ImageGallery
                                    items={images}
                                    ref={refGallery}
                                    showPlayButton={false}
                                    showFullscreenButton={false}
                                    slideOnThumbnailOver={true}
                                    renderLeftNav={()=><></>}
                                    renderRightNav={()=><></>}
                                    onClick={handleOnClickImage}
                                />
                            </Col>
                            <Col md={14} sm={24}>
                                <Col md={0} sm={24} xs={24}>
                                    <ImageGallery
                                        items={images}
                                        ref ={refGallery}
                                        showPlayButton={false}
                                        showFullscreenButton={false}
                                        renderLeftNav={()=><></>}
                                        renderRightNav={()=><></>}
                                        showThumbnails={false}
                                        onClick={handleOnClickImage}
                                    />
                                </Col>
                                <Col span={24}>
                                    <div className={"author"}>Author <a href={"#"}>{currentBook?.author}</a></div>
                                    <div className={"title"}>{{currentBook?.mainText}}</div>
                                    <div className={"rating"}>
                                        <Rate
                                            value={5}
                                            disabled
                                            style={{color:'yellow'}}
                                        />
                                        <span className={"sold"}>
                                            <Divider type={"vertical"}/>
                                            Sold {currentBook?.sold ?? 0}
                                        </span>
                                    </div>
                                    <div className={"price"}>
                                        <span className={"currency"}>
                                                {new Intl.NumberFormat("vn-VN", {
                                                    style: "currency",currency:'VND'
                                                }).format({currentBook?.price ?? 0})}
                                        </span>
                                    </div>
                                    <div className={"delivery"}>
                                        <div>
                                            <span className={"left"}>Delivery</span>
                                            <span className={"right"}>Free-shipping</span>
                                        </div>
                                    </div>
                                    <div className={"quantity"}>
                                        <span className={"left"}>Quantity</span>
                                        <span className={"right"}>
                                                <button><MinusOutlined/></button>
                                                <input defaultValue={1}/>
                                                <button><PlusOutlined/></button>
                                            </span>
                                    </div>
                                    <div className={"buy"}>
                                        <button className={"cart"}>
                                            <FaShoppingCart className={"icon-cart"}/>
                                            Add cart
                                        </button>
                                        <button className={"now"}>Buy now</button>
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                    </div>
                </div>
                <ModalGallery
                    isOpenModalGallery = {isOpenModalGallery}
                    setIsOpenModalGallery={setIsOpenModalGallery}
                    currentIndex={currentIndex}
                    items ={images}
                    title={currentBook?.mainText ?? ""}
                />
            </div>
        </>
    )
}
export default BookDetail