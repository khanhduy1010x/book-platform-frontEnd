import { useAPI } from "../Service/APIContext";
import BookSlider from "./BookSlider";
import { useState } from "react";

export default function BookHome() { 
  const {listBookHome} = useAPI();
    return (
      <div className="bg-[#121214] ">
      {
        listBookHome.map((item,index) => (
          <div key={index} className="w-full  container-block bg-[#121214] pt-[60px] pl-[60px] pr-[60px] ">
          
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