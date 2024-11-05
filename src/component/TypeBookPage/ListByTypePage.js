import Carousel3d from "./Carousel3D/3DCarousel";
import BookSlider from "../HomeBook/BookSlider"
import { useParams } from "react-router-dom";
import { useAPI } from "../Service/APIContext";
import { useEffect, useState } from "react";
import { useScroll } from "@react-spring/web";
export default function ListByTypePage() {
    const {bookType,cate} = useParams();
    const [totalResult, setTotalResult] =useState(0);

  const {getListBookByCateAndBookType,listBookByCateAndBookType,memberMapper} = useAPI();
  useEffect(() => {
    getListBookByCateAndBookType(cate,bookType);
    console.log(getListBookByCateAndBookType)
  },[bookType,cate])    
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
   <Carousel3d listBook={listBookByCateAndBookType}/>
   <div className="mt-10">
    <h2 className="text-white font-bold font-oswald text-[24px]">Tất cả sách "<span className="text-primary">{listBookByCateAndBookType[0]?.listBook[0]?.category?.cateName}</span>"</h2>
    <p className="text-white font-oswald">{totalResult} kết quả</p>
    {
        listBookByCateAndBookType.map((item,index) => (
<div className="mt-6" key={index}>
    <span className="text-white text-[30px] font-bold font-oswald">{!memberMapper(item.memberType) ? "Miễn phí/Trả phí" : memberMapper(item.memberType)}</span>
     <BookSlider  listBook={item.listBook}/>
</div>
        ))
    }

   </div>
    </div>
  );
}
