import { useState, useRef, useEffect } from "react";
import { useAPI } from "../Service/APIContext";

export default function AuthorSlider({search="", onCountChange}) {
const {getAllListAuthor} =useAPI()
const [authors,setAuthors] =useState([])
useEffect(() => {

    const fetch = async () => { 
      let resp = await getAllListAuthor();
      if(search) {
        console.log("loc")
        resp = resp.filter((item,index) => item.name.toLowerCase().includes(search.toLowerCase()));
      }
      setAuthors(resp);
      if(onCountChange) onCountChange(resp.length);
    }
    fetch();
},[search])

  return ( 
    <div className="w-full overflow-hidden hide-scrollbar overflow-x-auto">
      <div className="w-full max-w-full list-carousel-item hide-scrollbar pl-[30px]">
        <div className="w-max flex hide-scrollbar">
          {authors.map((item, index) => (
            <div
              key={index}
              className="inline-block relative lg:w-52 group xl:w-56 2xl:w-[265px] cursor-pointer text-center mr-[62px] last:mr-[50px]"
            >
              <div className="flex flex-col justify-center items-center">
                <div className="relative">
                  <div className="relative overflow-hidden w-[250px] h-[250px] rounded-full ">
                    <img
                      src={item.imageURL}
                      alt="Đập nồi bán sắt đi học"
                      className="absolute top-0 left-0 object-cover rounded-full w-full h-full transition-transform duration-1000 ease-in-out hover:scale-125 "
                    />
                  </div>
               
                </div>
                <div className="mt-4 h-[41px]">
                  <a
                    href="/ebook/dap-noi-ban-sat-di-hoc-hong-thu-bac-bgNYYW.html"
                    className="text-white text-base-16-20 font-bold t-ellipsis-2 hover:text-primary"
                  >
                    {item.name}
                  </a>
                </div>
              </div>
                  
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
