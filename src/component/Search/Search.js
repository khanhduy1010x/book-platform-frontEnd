import { useEffect, useState } from "react"
import BookSlider from "../HomeBook/BookSlider";
import AuthorSlider from "../Author/AuthorSlider";
import { useParams } from "react-router-dom";
import { useAPI } from "../Service/APIContext";

export default function Search() {
    const {searchBook} = useAPI();
    const [listBookSearch, setListBookSearch] = useState([]);
    const [totalBook, setTotalBook] = useState(0);
    const {param} = useParams();
    useEffect(() => {
        const fetchBook = async () => {
            const book  = await searchBook(param);
            setListBookSearch(book)
         
            let total = 0;
            if (book) {
                book.forEach(item => {
                    total += item.listBook.length;
                  });
            }
           
            setTotalBook(total);
    }
        fetchBook()
    },[param])
    const [isFocusType, setIsFocusType] = useState("");
    return (
        <div className="pt-[64px] min-h-screen bg-black"> 
        <div className="p-[64px] ">
            <div className="flex">
            <div className="text-white">
            <i className="fa-sharp-duotone  bg-gray-500 p-4 text-[32px] font-bold rounded-xl fa-solid fa-magnifying-glass"></i>
            </div>
            <div className="ml-2 text-white font-oswald">
                <div className=" font-bold text-[24px]">
                    <span>Kết quả tìm kiếm cho từ "</span><span className="text-primary">{param}</span><span>"</span>
                </div>
                <div>
                    <span>Tìm thấy {totalBook} kết quả phù hợp</span>
                </div>
            </div>
            </div>
            <div className="text-white font-bold text-[20px] gap-2 mt-4 flex">
               <div className={`hover:bg-white hover:text-primary p-2 rounded-xl cursor-pointer ${isFocusType === '' ?  'text-primary' : '' } `}> 
               <span>Tất cả</span>
               </div>
               <div className="hover:bg-white hover:text-primary p-2 rounded-xl cursor-pointer "> 
               <span>Sách nói</span>
               </div>
               <div className="hover:bg-white hover:text-primary p-2 rounded-xl cursor-pointer "> 
               <span>Sách giấy</span>
               </div>
               <div className="hover:bg-white hover:text-primary p-2 rounded-xl cursor-pointer "> 
               <span>Postcast</span>
               </div>
               <div className="hover:bg-white hover:text-primary p-2 rounded-xl cursor-pointer "> 
               <span>Tuyển tập</span>
               </div>
            </div>

            {listBookSearch && listBookSearch.map((item,index) => (
  <div className="mt-5">
  <div className="text-white ml-2 font-bold font-rubik text-[28px]">
      <span>{item.cateName + ` (${item.listBook.length})`}</span>
  </div>
  <div className="">
  <BookSlider scale={75} listBook={item.listBook}/>
  </div>
 </div>
            )) 
            }
         

       

        

           <div className="mt-5">
            <div className="text-white ml-2 font-bold font-rubik  text-[28px]">
                <span>Tác giả (322) </span>
            </div>
            <div className="mt-4">
           <AuthorSlider/>
            </div>
           </div>
        </div>
        </div>
    )
}