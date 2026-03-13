import { useEffect, useState } from "react"
import BookSlider from "../HomeBook/BookSlider";
import AuthorSlider from "../Author/AuthorSlider";
import { useParams } from "react-router-dom";
import { useAPI } from "../Service/APIContext";

export default function Search() {
    const {searchBook} = useAPI();
    const [listBookSearch, setListBookSearch] = useState([]);
    const [totalBook, setTotalBook] = useState(0);
    const [authorCount, setAuthorCount] = useState(0);
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
        <div className="pt-[70px] min-h-screen bg-black">
        <div className="px-4 sm:px-8 md:px-12 lg:px-16 py-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
            <div className="text-white">
            <i className="fa-sharp-duotone bg-gray-500 p-3 sm:p-4 text-2xl sm:text-[32px] font-bold rounded-xl fa-solid fa-magnifying-glass"></i>
            </div>
            <div className="text-white font-oswald">
                <div className="font-bold text-lg sm:text-[24px]">
                    <span>Kết quả cho “</span><span className="text-primary">{param}</span><span>”</span>
                </div>
                <div className="text-sm sm:text-base text-gray-400">
                    <span>Tìm thấy {totalBook + authorCount} kết quả phù hợp</span>
                </div>
            </div>
            </div>

            {/* Danh sách sách */}
            {listBookSearch && listBookSearch.length > 0 ? listBookSearch.map((item,index) => (
  <div key={index} className="mt-6">
  <div className="text-white ml-2 font-bold font-rubik text-xl sm:text-[28px] mb-2">
      <span>{item.cateName + ` (${item.listBook.length})`}</span>
  </div>
  <BookSlider scale={75} listBook={item.listBook}/>
 </div>
            )) : (
                <div className="text-gray-400 text-center py-8 text-sm">Không tìm thấy sách phù hợp</div>
            )}

            {/* Tác giả */}
           <div className="mt-8">
            <div className="text-white ml-2 font-bold font-rubik text-xl sm:text-[28px] mb-4">
                <span>Tác giả {authorCount > 0 ? `(${authorCount})` : ""}</span>
            </div>
            <div className="overflow-x-auto">
           <AuthorSlider search={param} onCountChange={setAuthorCount}/>
            </div>
           </div>
        </div>
        </div>
    )
}