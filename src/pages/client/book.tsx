import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import BookDetail from "./book/book.detail.tsx";
import {getBookByIdAPI} from "../../services/api.ts";
import {App, notification} from "antd";
import BookLoader from "./bookLoader.tsx";

const BookPage = () => {
    let {id} = useParams()
    const {notification}  = App.useApp()
    const [currentBook, setCurrentBook] = useState<IBookTable | null>(null);
    const [isLoadingBook, setIsLoadingBook] = useState<boolean>(true);
    useEffect(() => {
        if(id){
            const fetchBookByAPI = async () =>{
                setIsLoadingBook(true);
                const res = await getBookByIdAPI(id)
                if ( res && res.data){
                    setCurrentBook(res.data)
                }else {
                    setCurrentBook(null)
                    notification.error ({
                        message:'Book not found!',
                        description:'No book found.'
                    })
                }
                setIsLoadingBook(false);
            }
            fetchBookByAPI();
        }
    },[id, notification])
    return (
        <div>
            {
                isLoadingBook?
                    <BookLoader/>
                    :
                    <BookDetail
                        currentBook={currentBook}
                    />
            }

        </div>
    )
}
export default BookPage