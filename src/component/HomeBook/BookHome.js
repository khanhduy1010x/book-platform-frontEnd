import BookSlider from "./BookSlider";
import { useState } from "react";

export default function BookHome() { 
  const numbers = [];
  for (let i = 1; i <= 3; i++) {
    numbers.push(i);
  }
    return (
      <div className="bg-[#121214] ">
      {
        numbers.map((_,index) => (
          <div key={index} className="w-full  container-block bg-[#121214] pt-[60px] pl-[60px] pr-[60px] ">
          
          <div className="flex items-center w-max mb-6">
            <h2 className="text-white text-4xl text-[1.625rem] font-rubik font-bold cursor-pointer">
              Sách nói
            </h2>
          </div>
          <div className="custom-shadow-short relative border-0">
          <BookSlider />
          </div>
        
        </div>
        ))
      }
      </div>
      
    );
}