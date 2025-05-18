
interface IProps {
    isOpenModalGallery: boolean
    setIsOpenModalGallery:any
    listCategory:{
        label:string,
        value:string
    }[]
    onFinish:any
}
const MobileFilter = (props:IProps) =>{
    const { isOpenModalGallery, setIsOpenModalGallery, handleChangeFilter, listCategory, onFinish } = props;
    const [form] = Form.useForm();
    return (
        <>

        </>
    )
}