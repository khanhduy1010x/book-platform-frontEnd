import { useEffect, useState } from "react"
import { useAPI } from "../../Service/APIContext";
import { Link } from "react-router-dom";
import load from '../../../assets/image/Book.gif'
export default function BookList({isSelectType}) {
    const [listBook, setLisBook] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const {getBookReaded,getBookBought,getFavorite} = useAPI();
    useEffect(() => {
        setIsLoading(true);
        const fetch = async () => {
            let resp = [];
            if(isSelectType === "Đang đọc") {
                 resp = await getBookReaded();
            }else if (isSelectType === "Sách đã mua"){
                resp = await getBookBought()
            }else  if(isSelectType=== "Sách yêu thích"){
               resp = await getFavorite();
            
            }
            setLisBook(resp);
            setIsLoading(false);
        }
        const delayFetch = setTimeout(() => {
            fetch();
        }, 900);
        return () => clearTimeout(delayFetch);
    },[isSelectType])

    const emptyMessages = {
        "Đang đọc": { icon: "fa-solid fa-book-open", text: "Bạn chưa đọc cuốn sách nào" },
        "Sách đã mua": { icon: "fa-solid fa-bag-shopping", text: "Bạn chưa mua cuốn sách nào" },
        "Sách yêu thích": { icon: "fa-solid fa-heart", text: "Bạn chưa có sách yêu thích nào" },
    };

    return (
        <>
        {isLoading ? (
            <div className="flex flex-col h-[450px] items-center justify-center">
                <img src={load}/>
                <div>Loading ....</div>
            </div>
        ) : listBook.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px] gap-4 text-gray-500">
                <i className={`${emptyMessages[isSelectType]?.icon} text-[56px] text-gray-600`}></i>
                <p className="text-[18px] font-oswald">{emptyMessages[isSelectType]?.text}</p>
                <Link to="/" className="mt-2 px-6 py-2 bg-primary rounded-full text-white text-[14px] font-bold hover:scale-105 transition-transform duration-200">
                    Khám phá sách
                </Link>
            </div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4 md:gap-6 mt-6 mb-6 font-oswald">
            {listBook?.map((item,index) => (
                <Link to={`/detail/${item?.book?.id}`} key={index} className="group flex flex-col"> 
                <div className="relative w-full">
                    {/* Fixed aspect ratio image box */}
                    <div className="relative w-full pt-[150%] rounded-xl overflow-hidden">
                        <div className="absolute inset-0 transition-transform duration-1000 ease-in-out group-hover:scale-[110%]">
                            <div className="absolute top-0 left-0 w-full h-full book-border z-10"></div>
                            <img className="object-cover w-full h-full rounded-xl" src={item?.book?.coverImage}/>
                        </div>
                    </div>
                    {/* Progress bar */}
                    {item.percent >= 0 && (
                        <div className="absolute bottom-2 left-2 right-2 border border-yellow-200 bg-gray-200 rounded-full overflow-hidden z-20">
                            <div className="h-1 bg-primary rounded-full transition-all duration-500" style={{ width: `${item?.percent}%` }}></div>
                        </div>
                    )}
                </div>
                <div className="font-bold text-white text-[14px] group-hover:text-primary mt-2 text-center line-clamp-2 leading-snug">
                    {item?.book?.bookName}
                </div>
                </Link>
            ))}
            </div>
        )}
        </>
    )
}