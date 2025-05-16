import { Col, Image, Modal, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";

interface IProps {
    isOpenModalGallery: boolean;
    setIsOpenModalGallery: (v: boolean) => void;
    currentIndex: number;
    items: {
        original: string;
        thumbnail: string;
        originalClass?: string;
        thumbnailClass?: string;
    }[];
    title: string;
}

const ModalGallery = (props: IProps) => {
    const { isOpenModalGallery, setIsOpenModalGallery, currentIndex, items, title } = props;
    const [activeIndex, setActiveIndex] = useState(0);
    const refGallery = useRef<ImageGallery>(null);

    useEffect(() => {
        if (isOpenModalGallery) {
            setActiveIndex(currentIndex);
            refGallery.current?.slideToIndex(currentIndex);
        }
    }, [isOpenModalGallery, currentIndex]);

    return (
        <Modal
            width={'60vw'}
            open={isOpenModalGallery}
            onCancel={() => { setIsOpenModalGallery(false); }}
            footer={null}
            closable={false}
            className={"modal-gallery"}
        >
            <Row gutter={[20, 20]}>
                <Col span={16}>
                    <ImageGallery
                        items={items}
                        ref={refGallery}
                        showPlayButton={false}
                        showFullscreenButton={false}
                        showThumbnails={false}
                        onSlide={(i) => setActiveIndex(i)}
                        slideDuration={0}
                    />
                </Col>
                {
                    items?.map((item, i) => (
                        <Col key={`image-${i}`}>
                            <Image
                                className={"img-normal"}
                                width={100}
                                height={100}
                                src={item.original}
                                preview={false}
                                onClick={() => {
                                    refGallery.current?.slideToIndex(i);
                                }}
                            />
                            <div className={activeIndex === i ? "active": ""}></div>
                        </Col>
                    ))
                }
            </Row>
        </Modal>
    );
};

export default ModalGallery;
