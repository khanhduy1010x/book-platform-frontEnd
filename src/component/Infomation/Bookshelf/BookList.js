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
    return (
        <>
        {isLoading ? (<div className="flex flex-col h-[450px] items-center justify-center">
        <img src={load}/>
        <div>Loading ....</div>
        </div>) : (

<div className="grid 2xl:grid-cols-6 grid-cols-4 gap-10 mt-6 mb-6 font-oswald">
{
  listBook.length > 0 &&  listBook?.map((item,index) =>
(
    <Link to={`/detail/${item?.book?.id}`}  key={index} className="rounded-lg overflow-hidden flex justify-center "> 
    <div className="group relative flex justify-center flex-col ">
    <div className="inline-block mb-2 relative show-tooltip lg:w-52  flex justify-center flex-col xl:w-56 2xl:w-[265px] cursor-pointer float-left lg:w-full xl:w-full 2xl:w-full w-full col-span-1">
    <div className="w-[170px] h-[260px]  rounded-xl overflow-hidden  flex justify-center flex-col">
      
        <div className="transition-transform duration-1000 ease-in-out group-hover:scale-[120%]  flex justify-center flex-col w-full h-full ">
        <div className="absolute top-0 left-0 w-full h-full book-border z-10"></div>

<img className="object-fit rounded-lg  w-full h-full " src={item?.book?.coverImage}/>



        </div>
  
    </div>
    </div>
    <div className="font-bold text-white  text-[16px] group-hover:text-primary  flex justify-center flex-col"><span className="text-center">{item?.book?.bookName}</span></div>
    {
        item.percent >=0   &&    <div className="absolute bottom-10 border border-yellow-200 left-2 w-[155px]  bg-gray-200 rounded-full overflow-hidden z-20">
        <div
          className="h-1 bg-primary rounded-full transition-all  duration-500"
          style={{
            width: `${item?.percent}%`
          }}
        ></div>
      </div>
    }
 
    </div>

</Link>
))
}

</div>
        )}
        </>
       
    )
}