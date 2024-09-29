import { useState, useRef } from "react";

export default function AuthorSlider() {
  const numbers = [];
  const [isRightHalf, setIsRightHalf] = useState(false);


  for (let i = 1; i <= 10; i++) {
    numbers.push(i);
  }

  const handleMouseEnter = (event) => {
    const element = event.currentTarget; 
    const rect = element.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    if (rect.left + rect.width / 2 > screenWidth / 2) {
      setIsRightHalf(true); 
    } else {
      setIsRightHalf(false);
    }
  };


  return (
    <div className="w-full overflow-hidden hide-scrollbar overflow-x-auto">
      <div className="w-full max-w-full list-carousel-item hide-scrollbar pl-[30px]">
        <div className="w-max flex hide-scrollbar">
          {numbers.map((_, index) => (
            <div
              key={index}
              className="inline-block relative lg:w-52 group xl:w-56 2xl:w-[265px] cursor-pointer text-center mr-[62px] last:mr-[50px]"
            >
              <div className="flex flex-col justify-center items-center">
                <div className="relative">
                  <div className="relative overflow-hidden w-[250px] h-[250px] rounded-full ">
                    <img
                      src="https://images2.thanhnien.vn/zoom/686_429/528068263637045248/2024/4/3/jack-1712114239424422902059-0-0-847-1355-crop-17121146540022088371085.jpg"
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
                    Jack
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
