import { useAPI } from "../Service/APIContext";
import BookSlider from "./BookSlider";
import { useEffect, useState } from "react";

export default function BookHome() { 
  const {listBookHome,getListBookHome,getRecommend, isLogin} = useAPI();
  const [listRecommend, setListRecommned] = useState([]);
  useEffect(() => {
    getListBookHome();
    const fetch = async () => {
      const resp = await getRecommend();
      setListRecommned(resp.listBook);
    }
    if(isLogin) {
      fetch()
    }
  },[isLogin])
    return (

      <div className="bg-[#121214] ">
          { isLogin &&  listRecommend && listRecommend.length>0 && <div className="w-full container-block bg-[#121214] pt-10 px-4 sm:px-8 md:px-[60px]">
          
          <div className="flex items-center w-max mb-6">
            <h2 className="text-white text-4xl text-[1.625rem] font-rubik font-bold cursor-pointer">
                Sách liên quan
            </h2>
          </div>
          <div className="custom-shadow-short relative border-0">
          <BookSlider listBook={listRecommend}/>
          </div>
        
        </div>} 
        
      {
        listBookHome.filter((item) => item?.listBook?.length > 0).map((item,index) => (
          <div key={index} className="w-full container-block bg-[#121214] pt-10 px-4 sm:px-8 md:px-[60px]">
          
          <div className="flex items-center w-max mb-6">
            <h2 className="text-white text-4xl text-[1.625rem] font-rubik font-bold cursor-pointer">
              {item?.cateName}
            </h2>
          </div>
          <div className="custom-shadow-short relative border-0">
          <BookSlider listBook={item.listBook}/>
          </div>
        
        </div>
        ))
      }
      </div>
      
    );
}