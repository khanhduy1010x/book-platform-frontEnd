import Carousel3d from "./Carousel3D/3DCarousel";
import BookSlider from "../HomeBook/BookSlider"
import { useParams } from "react-router-dom";
import { useAPI } from "../Service/APIContext";
import { useEffect, useState } from "react";
import { useScroll } from "@react-spring/web";
export default function ListByTypePage() {
    const {bookType,cate} = useParams();
    const [totalResult, setTotalResult] =useState(0);
    const [combinedBooks, setCombinedBooks] = useState([]); 
    const [isBookTypeFilter, setIsBookSearchFilter] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

  const {getListBookByCateAndBookType,listBookByCateAndBookType,memberMapper,getListBookByBookType,listBookByBookType} = useAPI();
  useEffect(() => {
    if(!cate) {
      setIsBookSearchFilter(true)
      getListBookByBookType(bookType);
    }else {
      setIsBookSearchFilter(false);
      getListBookByCateAndBookType(cate,bookType);
    }
  },[bookType,cate])    

  useEffect(() => {
    if (listBookByBookType) {
        const combinedList = listBookByBookType.flatMap(item => item.listBook); 
        setCombinedBooks(combinedList);
        setIsLoading(false);
        setTotalResult(combinedList.length);
    }
}, [listBookByBookType]);
  useEffect(() => {
    let total =0;
    if(listBookByCateAndBookType ) {
 listBookByCateAndBookType.map((book) => {
        total+=book?.listBook?.length;
    })
    }
    
    setTotalResult(total)
  },[listBookByCateAndBookType])
  return (
    <div className="bg-black p-[124px] relative min-h-screen">
               <div className="blur-layer-1 absolute top-[206px] !bg-blur-bg-primary right-1/2 z-0"></div>
               <div className="blur-layer-2 absolute -top-[98px] left-1/2 z-0"></div>
               {!isLoading && (
                <Carousel3d 
                    isBookTypeFilter= {isBookTypeFilter}
                    listBook={isBookTypeFilter ? combinedBooks : listBookByCateAndBookType} 
                />
            )}   <div className="mt-10">
    <h2 className="text-white font-bold font-oswald text-[24px]">Tất cả sách "<span className="text-primary">{ !isBookTypeFilter ? listBookByCateAndBookType[0]?.listBook[0]?.category?.cateName : bookType === "EBOOK" ? "Sách điện tử" : "Sách giấy"}</span>"</h2>
    <p className="text-white font-oswald">{totalResult} kết quả</p>
     {
      !isBookTypeFilter &&  listBookByCateAndBookType.map((item,index) => (
<div className="mt-6" key={index}>
    <span className="text-white text-[30px] font-bold font-oswald">{!memberMapper(item.memberType) ? "Miễn phí/Trả phí" : memberMapper(item.memberType)}</span>
     <BookSlider  listBook={item.listBook}/>
</div>
        ))
    }
       {
      isBookTypeFilter &&  listBookByBookType.map((item,index) => (
<div className="mt-6" key={index}>
    <span className="text-white text-[30px] font-bold font-oswald">{item.cateName}</span>
     <BookSlider  listBook={item.listBook}/>
</div>
        ))
    }

   </div>
    </div>
  );
}
