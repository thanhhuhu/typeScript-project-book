import {Avatar, Descriptions, Drawer} from 'antd';
import { Badge } from 'antd';
import dayjs from "dayjs";
import {FORMATE_DATE_VN} from "../../../services/helpers.ts";

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IUserTable | null;
    setDataViewDetail: (v: IUserTable | null ) => void;
}
const DetailUser = (props: IProps) => {
    const { openViewDetail, setOpenViewDetail,dataViewDetail, setDataViewDetail  } = props;
    const onClose = () =>{
        setOpenViewDetail(false);
        setDataViewDetail(null)
    }
    const avatarURL = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${dataViewDetail?.avatar}`;
        return (
            <>
                <Drawer title="Basic Drawer"
                        onClose={onClose}
                        open={openViewDetail}
                        width={600}
                >
                    <Descriptions title="User Info">
                        <Descriptions.Item label="Id">{dataViewDetail?._id} </Descriptions.Item>
                        <Descriptions.Item label="Email">{dataViewDetail?.email} </Descriptions.Item>
                        <Descriptions.Item label="FullName">{dataViewDetail?.fullName}</Descriptions.Item>
                        <Descriptions.Item label="Phone">{dataViewDetail?.phone}</Descriptions.Item>
                        <Descriptions.Item label="Role">
                            <Badge status="processing" text = {dataViewDetail?.role}/>
                        </Descriptions.Item>
                        <br/>
                        <Descriptions.Item label="CreatedAt">
                            {dayjs(dataViewDetail?.createdAt).format(FORMATE_DATE_VN)}
                        </Descriptions.Item>
                        <Descriptions.Item label="UpdatedAt">
                            {dayjs(dataViewDetail?.updatedAt).format(FORMATE_DATE_VN)}
                        </Descriptions.Item>
                        <br/>
                        <Descriptions.Item label="Avatar">
                            <Avatar size = {40}  src={avatarURL} >USER</Avatar>
                        </Descriptions.Item>
                    </Descriptions>
                </Drawer>
            </>
        );
}
export default DetailUser;